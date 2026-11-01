// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useImperativeHandle, useRef, useState } from 'react';

import { InputProps } from '../input/interfaces';
import { InternalInput } from '../input/internal';
import { Dropdown } from '../internal/components/dropdown';
import { OptionList } from '../internal/components/option-list';
import { OptionDefinition, OptionsDefinition, StatusType } from '../internal/components/option-list/interfaces';
import { isScrolledToEnd, renderDropdownStatus } from '../internal/components/option-list/status';
import { HighlightSource, useHighlight } from '../internal/components/option-list/use-highlight';
import { findEnabled, flattenOptions, getOptionItems, ListItem } from '../internal/components/option-list/utils';

import styles from './styles.css.js';

export interface FilteringInputStatus {
  statusType: StatusType;
  loadingText?: string;
  finishedText?: string;
  errorText?: string;
  recoveryText?: string;
  errorIconAriaLabel?: string;
  empty?: React.ReactNode;
}

export interface FilteringInputProps {
  /**
   * `search` shows a search icon and a clear button. The query line drops them once it holds filters,
   * where the input reads as the next condition.
   */
  type: 'search' | 'text';
  value: string;
  onChange(value: string): void;
  /**
   * The suggestions, already filtered for the value.
   */
  options: OptionsDefinition;
  /**
   * Label of the row that submits the typed text, or undefined to leave the row out.
   */
  enteredTextLabel?: string;
  /**
   * Called for a suggestion. Return `true` to keep the list open for the next suggestion.
   */
  onChoose(option: OptionDefinition): boolean;
  /**
   * Called when the user submits the typed text, with Enter or the entered text row.
   */
  onSubmit(): void;
  /**
   * Called when the list needs suggestions for `value`.
   */
  onLoadItems(detail: { firstPage: boolean; samePage: boolean }): void;
  status: FilteringInputStatus;
  placeholder?: string;
  ariaLabel?: string;
  disabled: boolean;
  expandToViewport: boolean;
}

/**
 * The text input of the property filter: a combobox that suggests properties, operators and values,
 * built from the same input, popup and option list as the autosuggest. Unlike an autosuggest, choosing
 * a property or an operator keeps the list open, and Enter submits the typed text as a filter.
 */
export const FilteringInput = React.forwardRef(
  (
    {
      type,
      value,
      onChange,
      options,
      enteredTextLabel,
      onChoose,
      onSubmit,
      onLoadItems,
      status,
      placeholder,
      ariaLabel,
      disabled,
      expandToViewport,
    }: FilteringInputProps,
    ref: React.Ref<InputProps.Ref>
  ) => {
    const inputRef = useRef<InputProps.Ref>(null);
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      select: () => inputRef.current?.select(),
    }));

    const baseId = useId();
    const listId = `${baseId}listbox`;
    const getOptionId = (index: number) => `${baseId}option-${index}`;
    const [open, setOpen] = useState(false);

    const suggestionRows = flattenOptions(options);
    const items: ListItem[] =
      enteredTextLabel === undefined
        ? suggestionRows
        : [
            { type: 'option', option: { value, label: enteredTextLabel }, group: null, disabled: false, extra: true },
            ...suggestionRows,
          ];
    const optionItems = getOptionItems(items);
    const suggestionCount = optionItems.filter(item => !item.extra).length;

    const highlight = useHighlight(optionItems, getOptionId);
    const { highlightedIndex } = highlight;

    const dropdownStatus = renderDropdownStatus({
      ...status,
      isEmpty: suggestionCount === 0,
      isNoMatch: false,
      onRecoveryClick: () => onLoadItems({ firstPage: false, samePage: true }),
    });
    const expanded = open && (items.length > 0 || dropdownStatus !== undefined);

    const openList = (initialIndex: number, source: HighlightSource) => {
      if (disabled || open) {
        return;
      }
      highlight.setHighlight(initialIndex, source);
      setOpen(true);
      onLoadItems({ firstPage: true, samePage: false });
    };

    const choose = (index: number) => {
      const item = optionItems[index];
      if (!item || item.disabled) {
        return;
      }
      if (item.extra) {
        onSubmit();
        setOpen(false);
        return;
      }
      const keepOpen = onChoose(item.option);
      highlight.setHighlight(-1, 'keyboard');
      setOpen(keepOpen);
      inputRef.current?.focus();
    };

    const handleChange = (text: string) => {
      onChange(text);
      highlight.setHighlight(-1, 'keyboard');
      setOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
          // Keeps a surrounding form from submitting: Enter belongs to the filter here.
          event.preventDefault();
          if (expanded && highlightedIndex >= 0) {
            choose(highlightedIndex);
          } else {
            onSubmit();
            setOpen(false);
          }
          return;
        case 'Escape':
          if (expanded) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          } else if (value !== '') {
            event.preventDefault();
            event.stopPropagation();
            onChange('');
          }
          return;
        case 'Tab':
          setOpen(false);
          return;
      }
      if (expanded) {
        highlight.handleNavigationKey(event, true);
      }
    };

    const input = (
      <InternalInput
        ref={inputRef}
        type={type}
        value={value}
        onChange={event => handleChange(event.detail.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={false}
        disableBrowserAutocorrect={true}
        ariaLabel={ariaLabel}
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
      <div
        className={styles['filtering-input']}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOpen(false);
          }
        }}
      >
        <Dropdown
          open={expanded}
          trigger={input}
          footer={dropdownStatus}
          onOutsideClick={() => setOpen(false)}
          onContentScroll={element => {
            if (status.statusType === 'pending' && isScrolledToEnd(element)) {
              onLoadItems({ firstPage: false, samePage: false });
            }
          }}
          expandToViewport={expandToViewport}
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
            ariaLabel={ariaLabel}
          />
        </Dropdown>
      </div>
    );
  }
);
