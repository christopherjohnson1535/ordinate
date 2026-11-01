// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { InputProps } from '../input/interfaces';
import { InternalInput } from '../input/internal';
import { Dropdown } from '../internal/components/dropdown';
import { OptionList } from '../internal/components/option-list';
import { OptionDefinition } from '../internal/components/option-list/interfaces';
import { isScrolledToEnd, renderDropdownStatus } from '../internal/components/option-list/status';
import { HighlightSource, useHighlight } from '../internal/components/option-list/use-highlight';
import { findEnabled, flattenOptions, getOptionItems, ListItem } from '../internal/components/option-list/utils';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { AutosuggestProps } from './interfaces';

import styles from './styles.css.js';

export const InternalAutosuggest = React.forwardRef(
  (
    {
      value,
      onChange,
      options = [],
      onSelect,
      filteringType = 'auto',
      enteredTextLabel,
      hideEnteredTextOption = false,
      empty,
      statusType = 'finished',
      loadingText,
      finishedText,
      errorText,
      recoveryText,
      errorIconAriaLabel,
      onLoadItems,
      placeholder,
      disabled = false,
      readOnly = false,
      name,
      ariaLabel,
      ariaRequired,
      onFocus,
      onBlur,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      ...rest
    }: AutosuggestProps,
    ref: React.Ref<AutosuggestProps.Ref>
  ) => {
    const i18n = useInternalI18n('autosuggest');
    const inputRef = useRef<InputProps.Ref>(null);
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      select: () => inputRef.current?.select(),
    }));

    const field = useFormFieldContext({ controlId, ariaLabelledby, ariaDescribedby, invalid, warning });
    const baseId = useId();
    const listId = `${baseId}listbox`;
    const getOptionId = (index: number) => `${baseId}option-${index}`;
    const [open, setOpen] = useState(false);

    const enteredText = enteredTextLabel?.(value) ?? i18n('enteredTextLabel', undefined, { value });
    const enteredTextOption = useMemo<OptionDefinition>(() => ({ value, label: enteredText }), [value, enteredText]);
    const showEnteredText = !hideEnteredTextOption && value !== '';

    const items = useMemo(() => {
      const rows = flattenOptions(options, filteringType === 'auto' ? value : '');
      const enteredTextRow: ListItem = {
        type: 'option',
        option: enteredTextOption,
        group: null,
        disabled: false,
        extra: true,
      };
      return showEnteredText ? [enteredTextRow, ...rows] : rows;
    }, [options, filteringType, value, enteredTextOption, showEnteredText]);
    const optionItems = useMemo(() => getOptionItems(items), [items]);
    const suggestionCount = optionItems.filter(item => !item.extra).length;

    const highlight = useHighlight(optionItems, getOptionId);
    const { highlightedIndex } = highlight;

    const loadItems = (detail: AutosuggestProps.LoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail);

    const status = renderDropdownStatus({
      statusType,
      loadingText,
      finishedText,
      errorText,
      recoveryText,
      errorIconAriaLabel: i18n('errorIconAriaLabel', errorIconAriaLabel),
      empty,
      isEmpty: suggestionCount === 0,
      isNoMatch: false,
      onRecoveryClick: () => loadItems({ filteringText: value, firstPage: false, samePage: true }),
    });
    // An open list with nothing in it would draw an empty box under the input.
    const expanded = open && (items.length > 0 || status !== undefined);

    const openList = (initialIndex: number, source: HighlightSource) => {
      if (disabled || readOnly || open) {
        return;
      }
      highlight.setHighlight(initialIndex, source);
      setOpen(true);
      loadItems({ filteringText: value, firstPage: true, samePage: false });
    };

    const closeList = () => setOpen(false);

    const choose = (index: number) => {
      const item = optionItems[index];
      if (!item || item.disabled) {
        return;
      }
      if (item.extra) {
        fireNonCancelableEvent(onSelect, { value });
      } else {
        const chosen = item.option.value ?? '';
        fireNonCancelableEvent(onChange, { value: chosen });
        fireNonCancelableEvent(onSelect, { value: chosen, selectedOption: item.option });
      }
      closeList();
    };

    const handleInputChange = (text: string) => {
      fireNonCancelableEvent(onChange, { value: text });
      highlight.setHighlight(-1, 'keyboard');
      setOpen(true);
      loadItems({ filteringText: text, firstPage: true, samePage: false });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) {
        return;
      }
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          if (!expanded) {
            event.preventDefault();
            const last = optionItems.length - 1;
            openList(
              event.key === 'ArrowDown' ? findEnabled(optionItems, 0, 1) : findEnabled(optionItems, last, -1),
              'keyboard'
            );
            return;
          }
          break;
        case 'Enter':
          if (expanded && highlightedIndex >= 0) {
            // Keeps a surrounding form from submitting when Enter chooses a suggestion.
            event.preventDefault();
            choose(highlightedIndex);
          } else {
            closeList();
          }
          return;
        case 'Escape':
          if (expanded) {
            event.preventDefault();
            event.stopPropagation();
            closeList();
          } else if (value !== '') {
            event.preventDefault();
            event.stopPropagation();
            fireNonCancelableEvent(onChange, { value: '' });
          }
          return;
        case 'Tab':
          closeList();
          return;
      }
      if (expanded) {
        highlight.handleNavigationKey(event, true);
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
      closeList();
      fireNonCancelableEvent(onBlur, null);
    };

    const input = (
      <InternalInput
        ref={inputRef}
        value={value}
        onChange={event => handleInputChange(event.detail.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        autoComplete={false}
        ariaLabel={ariaLabel}
        ariaRequired={ariaRequired}
        controlId={field.controlId}
        ariaLabelledby={field.ariaLabelledby}
        ariaDescribedby={field.ariaDescribedby}
        invalid={field.invalid}
        warning={field.warning}
        nativeInputAttributes={{
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-expanded': expanded,
          'aria-controls': expanded ? listId : undefined,
          'aria-activedescendant': expanded && highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined,
          onKeyDown: handleKeyDown,
          onClick: () => openList(-1, 'mouse'),
        }}
      />
    );

    return (
      <div {...rest} className={styles.root} onFocus={handleFocus} onBlur={handleBlur}>
        <Dropdown
          open={expanded}
          trigger={input}
          footer={status}
          onOutsideClick={closeList}
          onContentScroll={element => {
            if (statusType === 'pending' && isScrolledToEnd(element)) {
              loadItems({ filteringText: value, firstPage: false, samePage: false });
            }
          }}
          className={styles.dropdown}
        >
          <OptionList
            id={listId}
            items={items}
            getOptionId={getOptionId}
            highlight={highlight}
            indicator="none"
            getOptionState={(_, index) => ({ selected: index === highlightedIndex })}
            onOptionClick={choose}
            ariaLabel={field.ariaLabelledby ? undefined : ariaLabel}
            ariaLabelledby={field.ariaLabelledby}
          />
        </Dropdown>
      </div>
    );
  }
);
