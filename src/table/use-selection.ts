// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

import { fireNonCancelableEvent } from '../internal/events';
import { TableProps } from './interfaces';
import { getTrackedValue } from './utils';

interface SelectionOptions<T> {
  items: ReadonlyArray<T>;
  selectedItems: ReadonlyArray<T>;
  selectionType?: TableProps.SelectionType;
  trackBy?: TableProps.TrackBy<T>;
  isItemDisabled?: (item: T) => boolean;
  onSelectionChange?: TableProps<T>['onSelectionChange'];
}

export interface Selection<T> {
  isSelected: (item: T) => boolean;
  isDisabled: (item: T) => boolean;
  allSelected: boolean;
  someSelected: boolean;
  noneSelectable: boolean;
  selectItem: (index: number, selected: boolean, shiftKey: boolean) => void;
  selectAll: (selected: boolean) => void;
}

/**
 * Selection rules for the table. Changes are reported as a full new list; items selected on
 * other pages stay in it, and disabled items keep their state.
 */
export function useSelection<T>({
  items,
  selectedItems,
  selectionType,
  trackBy,
  isItemDisabled,
  onSelectionChange,
}: SelectionOptions<T>): Selection<T> {
  const anchorIndexRef = useRef<number | null>(null);

  const keyOf = (item: T) => getTrackedValue(trackBy, item);
  const selectedKeys = new Set(selectedItems.map(keyOf));
  const isSelected = (item: T) => selectedKeys.has(keyOf(item));
  const isDisabled = (item: T) => isItemDisabled?.(item) ?? false;

  const selectable = items.filter(item => !isDisabled(item));
  const selectedCount = selectable.filter(isSelected).length;
  const allSelected = selectable.length > 0 && selectedCount === selectable.length;

  const emit = (next: T[]) => fireNonCancelableEvent(onSelectionChange, { selectedItems: next });

  const apply = (targets: ReadonlyArray<T>, selected: boolean) => {
    if (selected) {
      emit([...selectedItems, ...targets.filter(item => !isSelected(item))]);
    } else {
      const removed = new Set(targets.map(keyOf));
      emit(selectedItems.filter(item => !removed.has(keyOf(item))));
    }
  };

  const selectItem = (index: number, selected: boolean, shiftKey: boolean) => {
    const item = items[index];
    if (!item || isDisabled(item)) {
      return;
    }
    if (selectionType === 'single') {
      emit([item]);
      return;
    }
    const anchor = anchorIndexRef.current;
    const hasRange = shiftKey && anchor !== null && anchor < items.length;
    const range = hasRange ? items.slice(Math.min(anchor, index), Math.max(anchor, index) + 1) : [item];
    anchorIndexRef.current = index;
    apply(
      range.filter(candidate => !isDisabled(candidate)),
      selected
    );
  };

  return {
    isSelected,
    isDisabled,
    allSelected,
    someSelected: selectedCount > 0 && !allSelected,
    noneSelectable: selectable.length === 0,
    selectItem,
    selectAll: selected => apply(selectable, selected),
  };
}
