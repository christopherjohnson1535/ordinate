// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { UseCollectionOptions } from '../interfaces';
import { CollectionState } from '../state';
import { filterByText } from './filter';
import { clampPageIndex, getPage, getPagesCount, normalizePageSize } from './paginate';
import { filterByQuery } from './property-filter';
import { sortItems } from './sort';

export interface ProcessedItems<T> {
  items: ReadonlyArray<T>;
  filteredItemsCount: number | undefined;
  pagesCount: number;
  currentPageIndex: number;
}

/**
 * Runs the collection pipeline: text filter, property filter, sort, then the current page.
 */
export function processItems<T>(
  allItems: ReadonlyArray<T>,
  state: CollectionState<T>,
  { filtering, propertyFiltering, sorting, pagination }: UseCollectionOptions<T>
): ProcessedItems<T> {
  let items = allItems;
  if (filtering) {
    items = filterByText(items, state.filteringText, filtering);
  }
  if (propertyFiltering) {
    items = filterByQuery(
      items,
      state.propertyFilteringQuery,
      propertyFiltering.filteringProperties,
      propertyFiltering.filteringFunction
    );
  }
  const filteredItemsCount = filtering || propertyFiltering ? items.length : undefined;
  if (sorting) {
    items = sortItems(items, state.sortingState);
  }
  if (!pagination) {
    return { items, filteredItemsCount, pagesCount: 1, currentPageIndex: 1 };
  }
  const pageSize = normalizePageSize(pagination.pageSize);
  const pagesCount = getPagesCount(items.length, pageSize);
  const currentPageIndex = clampPageIndex(state.currentPageIndex, pagesCount);
  return { items: getPage(items, currentPageIndex, pageSize), filteredItemsCount, pagesCount, currentPageIndex };
}
