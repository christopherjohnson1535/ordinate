// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PropertyFilterQuery, SortingState, UseCollectionOptions } from './interfaces';

export interface CollectionState<T> {
  filteringText: string;
  propertyFilteringQuery: PropertyFilterQuery;
  sortingState: SortingState<T> | undefined;
  currentPageIndex: number;
  selectedItems: ReadonlyArray<T>;
}

type Change<T> =
  | { type: 'filtering'; filteringText: string }
  | { type: 'property-filtering'; query: PropertyFilterQuery }
  | { type: 'sorting'; sortingState: SortingState<T> }
  | { type: 'pagination'; pageIndex: number }
  | { type: 'selection'; selectedItems: ReadonlyArray<T> };

/**
 * A change to the collection, with the selection setting in effect when it was made.
 */
export type CollectionAction<T> = Change<T> & { keepSelection: boolean };

export const emptyQuery: PropertyFilterQuery = { tokens: [], operation: 'and' };

export function createInitialState<T>(options: UseCollectionOptions<T>): CollectionState<T> {
  return {
    filteringText: options.filtering?.defaultFilteringText ?? '',
    propertyFilteringQuery: options.propertyFiltering?.defaultQuery ?? emptyQuery,
    sortingState: options.sorting?.defaultState,
    currentPageIndex: options.pagination?.defaultPage ?? 1,
    selectedItems: options.selection?.defaultSelectedItems ?? [],
  };
}

function applyChange<T>(state: CollectionState<T>, change: Change<T>): CollectionState<T> {
  switch (change.type) {
    case 'filtering':
      return { ...state, filteringText: change.filteringText, currentPageIndex: 1 };
    case 'property-filtering':
      return { ...state, propertyFilteringQuery: change.query, currentPageIndex: 1 };
    case 'sorting':
      return { ...state, sortingState: change.sortingState, currentPageIndex: 1 };
    case 'pagination':
      return { ...state, currentPageIndex: change.pageIndex };
    case 'selection':
      return { ...state, selectedItems: change.selectedItems };
  }
}

/**
 * Filtering and sorting change which items are on the first page, so both go back to page 1.
 * Unless the selection is kept, any change other than selecting clears it.
 */
export function collectionReducer<T>(state: CollectionState<T>, action: CollectionAction<T>): CollectionState<T> {
  const next = applyChange(state, action);
  if (action.type !== 'selection' && !action.keepSelection && next.selectedItems.length > 0) {
    return { ...next, selectedItems: [] };
  }
  return next;
}
