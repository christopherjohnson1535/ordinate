// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type React from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import { FilteringType, LoadItemsDetail, OptionsDefinition, StatusType } from '../option-list/interfaces';
import { isScrolledToEnd } from '../option-list/status';
import { HighlightSource, useHighlight } from '../option-list/use-highlight';
import { isTypeAheadKey, useTypeAhead } from '../option-list/use-type-ahead';
import { findEnabled, flattenOptions, getOptionItems, ListItem, OptionItem } from '../option-list/utils';

export interface SelectListOptions {
  options: OptionsDefinition;
  filteringType: FilteringType;
  disabled: boolean;
  readOnly: boolean;
  statusType: StatusType;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  onFocus?: NonCancelableEventHandler;
  onBlur?: NonCancelableEventHandler;
  /**
   * Adds rows to the filtered rows, such as a "Select all" row. Mark added rows with `extra`.
   */
  addExtraRows?: (items: ListItem[]) => ListItem[];
  /**
   * The option to highlight when the list opens, such as the selected option, or -1 for the first one.
   */
  getInitialIndex(optionItems: ReadonlyArray<OptionItem>): number;
  /**
   * Called when the user chooses an option that is not disabled. Return `true` to keep the list open.
   */
  onChoose(item: OptionItem): boolean;
}

/**
 * The state and keyboard model shared by Select and Multiselect: a trigger button that opens a listbox,
 * an optional filter input, a highlight moved with the arrow keys and type-ahead, and paged loading.
 */
export function useSelectList({
  options,
  filteringType,
  disabled,
  readOnly,
  statusType,
  onLoadItems,
  onFocus,
  onBlur,
  addExtraRows,
  getInitialIndex,
  onChoose,
}: SelectListOptions) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const suppressSpaceKeyUp = useRef(false);

  const baseId = useId();
  const listId = `${baseId}listbox`;
  const getOptionId = (index: number) => `${baseId}option-${index}`;

  const [open, setOpen] = useState(false);
  const [filteringText, setFilteringText] = useState('');
  const hasFilter = filteringType !== 'none';

  const buildItems = (text: string) => {
    const rows = flattenOptions(options, filteringType === 'auto' ? text : '');
    return addExtraRows ? addExtraRows(rows) : rows;
  };
  // buildItems only reads the values listed here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => buildItems(filteringText), [options, filteringType, filteringText, addExtraRows]);
  const optionItems = useMemo(() => getOptionItems(items), [items]);

  const highlight = useHighlight(optionItems, getOptionId);
  const typeAhead = useTypeAhead(optionItems);
  const { highlightedIndex } = highlight;

  useEffect(() => {
    if (open) {
      (hasFilter ? filterRef.current : listRef.current)?.focus();
    }
  }, [open, hasFilter]);

  const loadItems = (detail: LoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail);

  const openList = (source: HighlightSource, initialIndex?: number) => {
    if (disabled || readOnly || open) {
      return;
    }
    const preferred = initialIndex ?? getInitialIndex(optionItems);
    highlight.setHighlight(preferred >= 0 ? preferred : findEnabled(optionItems, 0, 1), source);
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
    const keepOpen = onChoose(item);
    if (!keepOpen) {
      closeList(true);
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (open || disabled || readOnly) {
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openList('keyboard');
    } else if (isTypeAheadKey(event) && event.key !== ' ') {
      event.preventDefault();
      const index = typeAhead.find(event.key, getInitialIndex(optionItems));
      openList('keyboard', index >= 0 ? index : undefined);
    }
  };

  const handleTriggerKeyUp = (event: React.KeyboardEvent) => {
    // Space chose an option in the list and moved focus here; its keyup must not reopen the list.
    if (event.key === ' ' && suppressSpaceKeyUp.current) {
      suppressSpaceKeyUp.current = false;
      event.preventDefault();
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
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
    // Other keys belong to whatever else has focus, such as the recovery button.
    const fromFilter = event.target === filterRef.current;
    if (!fromFilter && event.target !== listRef.current) {
      return;
    }
    if (highlight.handleNavigationKey(event, fromFilter)) {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      choose(highlightedIndex);
      return;
    }
    if (fromFilter) {
      return;
    }
    if (event.key === ' ' && !typeAhead.isTyping()) {
      event.preventDefault();
      suppressSpaceKeyUp.current = true;
      choose(highlightedIndex);
    } else if (isTypeAheadKey(event)) {
      event.preventDefault();
      highlight.moveHighlight(typeAhead.find(event.key, highlightedIndex));
    }
  };

  const handleFilterChange = (text: string) => {
    setFilteringText(text);
    const next = getOptionItems(buildItems(text));
    const firstOption = next.findIndex(item => !item.disabled && !item.extra);
    highlight.setHighlight(text ? firstOption : -1, 'keyboard');
    loadItems({ filteringText: text, firstPage: true, samePage: false });
  };

  const handleContentScroll = (element: HTMLElement) => {
    if (statusType === 'pending' && isScrolledToEnd(element)) {
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

  return {
    open,
    filteringText,
    hasFilter,
    items,
    optionItems,
    highlight,
    listId,
    getOptionId,
    triggerRef,
    listRef,
    filterRef,
    openList,
    closeList,
    choose,
    retry: () => loadItems({ filteringText, firstPage: false, samePage: true }),
    rootProps: {
      onKeyDown: open ? handleListKeyDown : undefined,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
    triggerProps: {
      // A click from Enter or Space has no click count, so the list opens in keyboard mode.
      onClick: (event: React.MouseEvent) =>
        open ? closeList(true) : openList(event.detail === 0 ? 'keyboard' : 'mouse'),
      onKeyDown: handleTriggerKeyDown,
      onKeyUp: handleTriggerKeyUp,
    },
    onFilterChange: handleFilterChange,
    onContentScroll: handleContentScroll,
    onOutsideClick: () => closeList(false),
  };
}
