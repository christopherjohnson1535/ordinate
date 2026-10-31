// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { Dropdown } from '../internal/components/dropdown';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { SelectProps } from './interfaces';
import { flattenOptions, getLabel, isSameOption, ListItem, OptionItem } from './utils';

import styles from './styles.css.js';

const typeAheadResetMs = 500;

// Loads the next page a little before the user reaches the very end of the list.
const loadMoreThreshold = 16;

type HighlightSource = 'keyboard' | 'mouse';

interface Highlight {
  index: number;
  source: HighlightSource;
}

function findEnabled(options: OptionItem[], start: number, step: 1 | -1): number {
  for (let index = start; index >= 0 && index < options.length; index += step) {
    if (!options[index].disabled) {
      return index;
    }
  }
  return -1;
}

export const InternalSelect = React.forwardRef(
  (
    {
      options = [],
      selectedOption,
      onChange,
      placeholder,
      disabled = false,
      readOnly = false,
      filteringType = 'none',
      filteringPlaceholder,
      filteringAriaLabel,
      empty,
      noMatch,
      statusType = 'finished',
      loadingText,
      finishedText,
      errorText,
      recoveryText,
      errorIconAriaLabel,
      onLoadItems,
      ariaLabel,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      ...rest
    }: SelectProps,
    ref: React.Ref<SelectProps.Ref>
  ) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const filterRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => triggerRef.current?.focus() }));

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid });
    const baseId = useId();
    const listId = `${baseId}listbox`;
    const hiddenLabelId = `${baseId}label`;
    const triggerContentId = `${baseId}value`;
    const optionId = (index: number) => `${baseId}option-${index}`;

    const [open, setOpen] = useState(false);
    const [filteringText, setFilteringText] = useState('');
    const [highlight, setHighlight] = useState<Highlight>({ index: -1, source: 'keyboard' });
    const suppressSpaceKeyUp = useRef(false);
    const typeAhead = useRef({ text: '', timer: undefined as ReturnType<typeof setTimeout> | undefined });

    const hasFilter = filteringType !== 'none';
    const items = useMemo(
      () => flattenOptions(options, filteringType === 'auto' ? filteringText : ''),
      [options, filteringType, filteringText]
    );
    const optionItems = useMemo(() => items.filter((item): item is OptionItem => item.type === 'option'), [items]);
    const selectedIndex = optionItems.findIndex(item => isSameOption(item.option, selectedOption));
    const highlightedIndex = highlight.index < optionItems.length ? highlight.index : -1;

    const labelIds = field.ariaLabelledby ?? (ariaLabel ? hiddenLabelId : undefined);

    useEffect(() => {
      if (!open) {
        return;
      }
      (hasFilter ? filterRef.current : listRef.current)?.focus();
    }, [open, hasFilter]);

    useEffect(() => {
      if (highlight.source !== 'keyboard' || highlightedIndex < 0) {
        return;
      }
      // jsdom does not implement scrollIntoView.
      document.getElementById(optionId(highlightedIndex))?.scrollIntoView?.({ block: 'nearest' });
      // optionId only depends on baseId, which never changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlight, highlightedIndex]);

    useEffect(() => () => clearTimeout(typeAhead.current.timer), []);

    const loadItems = (detail: SelectProps.LoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail);

    const openList = (source: HighlightSource, initialIndex?: number) => {
      if (disabled || readOnly || open) {
        return;
      }
      const index = initialIndex ?? (selectedIndex >= 0 ? selectedIndex : findEnabled(optionItems, 0, 1));
      setHighlight({ index, source });
      setOpen(true);
      loadItems({ filteringText: '', firstPage: true, samePage: false });
    };

    const closeList = (returnFocus: boolean) => {
      setOpen(false);
      setFilteringText('');
      if (returnFocus) {
        triggerRef.current?.focus();
      }
    };

    const choose = (index: number) => {
      const item = optionItems[index];
      if (!item || item.disabled) {
        return;
      }
      if (!isSameOption(item.option, selectedOption)) {
        fireNonCancelableEvent(onChange, { selectedOption: item.option });
      }
      closeList(true);
    };

    const moveHighlight = (index: number) => {
      if (index >= 0) {
        setHighlight({ index, source: 'keyboard' });
      }
    };

    // Finds the next option whose label starts with the typed text. Repeating one letter cycles through its options.
    const findByTypeAhead = (character: string, from: number): number => {
      const state = typeAhead.current;
      clearTimeout(state.timer);
      state.text += character.toLowerCase();
      state.timer = setTimeout(() => (state.text = ''), typeAheadResetMs);

      const cycling = state.text.split('').every(letter => letter === state.text[0]);
      const search = cycling ? state.text[0] : state.text;
      const start = cycling || from < 0 ? from + 1 : from;
      for (let offset = 0; offset < optionItems.length; offset++) {
        const index = (start + offset) % optionItems.length;
        const item = optionItems[index];
        if (!item.disabled && getLabel(item.option).toLowerCase().startsWith(search)) {
          return index;
        }
      }
      return -1;
    };

    const isTypeAheadKey = (event: React.KeyboardEvent) =>
      event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

    const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
      if (open || disabled || readOnly) {
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openList('keyboard');
      } else if (isTypeAheadKey(event) && event.key !== ' ') {
        event.preventDefault();
        const index = findByTypeAhead(event.key, selectedIndex);
        openList('keyboard', index >= 0 ? index : undefined);
      }
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      const fromFilter = event.target === filterRef.current;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveHighlight(findEnabled(optionItems, highlightedIndex + 1, 1));
          return;
        case 'ArrowUp':
          event.preventDefault();
          moveHighlight(
            findEnabled(optionItems, highlightedIndex < 0 ? optionItems.length - 1 : highlightedIndex - 1, -1)
          );
          return;
        case 'Home':
          if (!fromFilter) {
            event.preventDefault();
            moveHighlight(findEnabled(optionItems, 0, 1));
          }
          return;
        case 'End':
          if (!fromFilter) {
            event.preventDefault();
            moveHighlight(findEnabled(optionItems, optionItems.length - 1, -1));
          }
          return;
        case 'PageDown':
        case 'PageUp':
          event.preventDefault();
          moveHighlight(
            event.key === 'PageDown'
              ? findEnabled(optionItems, Math.min(highlightedIndex + 10, optionItems.length - 1), -1)
              : findEnabled(optionItems, Math.max(highlightedIndex - 10, 0), 1)
          );
          return;
        case 'Enter':
          event.preventDefault();
          choose(highlightedIndex);
          return;
        case 'Escape':
          // Stops a surrounding modal from closing too.
          event.preventDefault();
          event.stopPropagation();
          closeList(true);
          return;
        case 'Tab':
          // Focus the trigger before the popup is removed, so the browser moves on from the trigger and not from the page start.
          closeList(true);
          return;
      }
      if (fromFilter) {
        return;
      }
      if (event.key === ' ' && typeAhead.current.text === '') {
        event.preventDefault();
        suppressSpaceKeyUp.current = true;
        choose(highlightedIndex);
      } else if (isTypeAheadKey(event)) {
        event.preventDefault();
        moveHighlight(findByTypeAhead(event.key, highlightedIndex));
      }
    };

    const handleFilterChange = (text: string) => {
      setFilteringText(text);
      const next = flattenOptions(options, filteringType === 'auto' ? text : '').filter(
        (item): item is OptionItem => item.type === 'option'
      );
      setHighlight({ index: text ? findEnabled(next, 0, 1) : -1, source: 'keyboard' });
      loadItems({ filteringText: text, firstPage: true, samePage: false });
    };

    const handleContentScroll = (element: HTMLElement) => {
      if (statusType !== 'pending') {
        return;
      }
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - loadMoreThreshold) {
        loadItems({ filteringText, firstPage: false, samePage: false });
      }
    };

    const handleFocus = (event: React.FocusEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        fireNonCancelableEvent(onFocus, null);
      }
    };

    const handleBlur = (event: React.FocusEvent) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
        return;
      }
      if (open) {
        closeList(false);
      }
      fireNonCancelableEvent(onBlur, null);
    };

    const renderOptionContent = (option: SelectProps.Option, optionDisabled: boolean) => (
      <span className={styles['option-content']}>
        <span className={styles['option-main']}>
          {option.iconName && (
            <InternalIcon
              className={styles['option-icon']}
              name={option.iconName}
              ariaLabel={option.iconAriaLabel}
              variant={optionDisabled ? 'disabled' : 'normal'}
            />
          )}
          <span className={styles['option-label']} lang={option.lang}>
            {getLabel(option)}
          </span>
          {option.labelTag && <span className={styles['option-label-tag']}>{option.labelTag}</span>}
        </span>
        {option.description && <span className={styles['option-description']}>{option.description}</span>}
        {option.tags && option.tags.length > 0 && (
          <span className={styles['option-tags']}>
            {option.tags.map((tag, index) => (
              <span key={index} className={styles['option-tag']}>
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>
    );

    const renderOption = (item: OptionItem) => {
      const index = optionItems.indexOf(item);
      const selected = index === selectedIndex;
      const highlighted = index === highlightedIndex;
      return (
        <li
          key={index}
          id={optionId(index)}
          role="option"
          className={clsx(
            styles.option,
            item.group && styles['option-in-group'],
            selected && styles['option-selected'],
            highlighted && styles['option-highlighted'],
            highlighted && highlight.source === 'keyboard' && styles['option-keyboard'],
            item.disabled && styles['option-disabled']
          )}
          aria-selected={selected}
          aria-disabled={item.disabled ? 'true' : undefined}
          data-value={item.option.value}
          onMouseMove={() => {
            if (!item.disabled && (highlightedIndex !== index || highlight.source !== 'mouse')) {
              setHighlight({ index, source: 'mouse' });
            }
          }}
          onClick={() => choose(index)}
        >
          {renderOptionContent(item.option, item.disabled)}
          <span className={styles['option-check']}>{selected && <InternalIcon name="check" />}</span>
        </li>
      );
    };

    const renderItems = (list: ListItem[]) => {
      const nodes: React.ReactNode[] = [];
      for (let position = 0; position < list.length; position++) {
        const item = list[position];
        if (item.type === 'option') {
          nodes.push(renderOption(item));
          continue;
        }
        const groupLabelId = `${baseId}group-${position}`;
        const children: OptionItem[] = [];
        while (position + 1 < list.length) {
          const next = list[position + 1];
          if (next.type !== 'option' || next.group !== item.option) {
            break;
          }
          children.push(next);
          position++;
        }
        nodes.push(
          <li key={`group-${position}`} role="presentation" className={styles.group}>
            <div id={groupLabelId} className={clsx(styles['group-label'], item.disabled && styles['option-disabled'])}>
              {renderOptionContent(item.option, item.disabled)}
            </div>
            <ul role="group" aria-labelledby={groupLabelId} className={styles['group-options']}>
              {children.map(renderOption)}
            </ul>
          </li>
        );
      }
      return nodes;
    };

    const renderStatus = () => {
      if (statusType === 'loading') {
        return (
          <span className={styles['status-loading']}>
            <InternalIcon name="status-in-progress" className={styles['status-spinner']} />
            <span>{loadingText}</span>
          </span>
        );
      }
      if (statusType === 'error') {
        return (
          <span className={styles['status-error']}>
            <InternalIcon name="status-negative" variant="error" ariaLabel={errorIconAriaLabel} />
            <span>{errorText}</span>
            {recoveryText && (
              <InternalButton
                className={styles.recovery}
                variant="link"
                formAction="none"
                onClick={() => loadItems({ filteringText, firstPage: false, samePage: true })}
              >
                {recoveryText}
              </InternalButton>
            )}
          </span>
        );
      }
      if (optionItems.length === 0) {
        if (filteringText && filteringType === 'auto' && options.length > 0) {
          return noMatch;
        }
        return empty;
      }
      return statusType === 'finished' ? finishedText : null;
    };

    const status = open ? renderStatus() : null;
    const selectedLabel = selectedOption ? getLabel(selectedOption) : '';

    const trigger = (
      <button
        ref={triggerRef}
        id={field.controlId}
        type="button"
        className={clsx(
          styles.trigger,
          open && styles['trigger-open'],
          field.invalid && styles.invalid,
          readOnly && styles['read-only']
        )}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={labelIds ? `${labelIds} ${triggerContentId}` : undefined}
        aria-describedby={field.ariaDescribedby}
        aria-invalid={field.invalid ? 'true' : undefined}
        aria-disabled={readOnly && !disabled ? 'true' : undefined}
        // A click from Enter or Space has no click count, so the list opens in keyboard mode.
        onClick={event => (open ? closeList(true) : openList(event.detail === 0 ? 'keyboard' : 'mouse'))}
        onKeyDown={handleTriggerKeyDown}
        onKeyUp={event => {
          // Space chose an option in the list and moved focus here; its keyup must not reopen the list.
          if (event.key === ' ' && suppressSpaceKeyUp.current) {
            suppressSpaceKeyUp.current = false;
            event.preventDefault();
          }
        }}
      >
        <span id={triggerContentId} className={styles['trigger-content']}>
          {selectedOption?.iconName && (
            <InternalIcon
              className={styles['option-icon']}
              name={selectedOption.iconName}
              ariaLabel={selectedOption.iconAriaLabel}
            />
          )}
          {selectedOption ? (
            <span className={styles['trigger-label']} lang={selectedOption.lang}>
              {selectedLabel}
            </span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </span>
        <InternalIcon className={styles['trigger-icon']} name="angle-down" />
      </button>
    );

    const filter = hasFilter ? (
      <input
        ref={filterRef}
        className={styles['filter-input']}
        type="text"
        role="combobox"
        value={filteringText}
        placeholder={filteringPlaceholder}
        autoComplete="off"
        aria-label={filteringAriaLabel}
        aria-expanded={true}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined}
        onChange={event => handleFilterChange(event.target.value)}
      />
    ) : undefined;

    return (
      <div
        {...rest}
        className={styles.root}
        onKeyDown={open ? handleListKeyDown : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {ariaLabel && !field.ariaLabelledby && (
          <span id={hiddenLabelId} hidden={true}>
            {ariaLabel}
          </span>
        )}
        <Dropdown
          open={open}
          trigger={trigger}
          header={filter}
          footer={
            status ? (
              <div className={styles.status} aria-live="polite">
                {status}
              </div>
            ) : undefined
          }
          onOutsideClick={() => closeList(false)}
          onContentScroll={handleContentScroll}
          className={styles.dropdown}
        >
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className={styles.list}
            tabIndex={hasFilter ? undefined : -1}
            aria-labelledby={labelIds}
            aria-activedescendant={!hasFilter && highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined}
          >
            {renderItems(items)}
          </ul>
        </Dropdown>
      </div>
    );
  }
);
