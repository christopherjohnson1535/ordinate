// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMemo, useReducer } from 'react';

import {
  CollectionActions,
  CollectionProps,
  FilteringProperty,
  FilteringPropertyDefinition,
  PropertyFilterQuery,
  UseCollectionOptions,
  UseCollectionResult,
} from './interfaces';
import { processItems } from './operations';
import { getFilteringOptions } from './operations/property-filter';
import { collectionReducer, createInitialState } from './state';

// The component only needs operator names; matching rules stay with the hook.
function toDefinition({ operators, ...property }: FilteringProperty): FilteringPropertyDefinition {
  return operators
    ? {
        ...property,
        operators: operators.map(operator => (typeof operator === 'string' ? operator : operator.operator)),
      }
    : property;
}

function readQuery(detail: PropertyFilterQuery | { query: PropertyFilterQuery }): PropertyFilterQuery {
  return 'query' in detail ? detail.query : detail;
}

/**
 * Holds the filtering, sorting, pagination and selection state of a collection and returns the items to
 * show, together with props to spread onto the table or cards, the filter and the pagination.
 *
 * The options are read once for their defaults. Later changes to them, such as a new page size, apply to
 * the items on the next render.
 */
export function useCollection<T>(allItems: ReadonlyArray<T>, options: UseCollectionOptions<T>): UseCollectionResult<T> {
  const [state, dispatch] = useReducer(collectionReducer<T>, options, createInitialState<T>);
  const keepSelection = options.selection?.keepSelection ?? false;

  const actions = useMemo<CollectionActions<T>>(
    () => ({
      setFiltering: filteringText => dispatch({ type: 'filtering', filteringText, keepSelection }),
      setPropertyFiltering: query => dispatch({ type: 'property-filtering', query, keepSelection }),
      setSorting: sortingState => dispatch({ type: 'sorting', sortingState, keepSelection }),
      setCurrentPage: pageIndex => dispatch({ type: 'pagination', pageIndex, keepSelection }),
      setSelectedItems: selectedItems => dispatch({ type: 'selection', selectedItems, keepSelection }),
    }),
    [keepSelection]
  );

  const { filtering, propertyFiltering, sorting, selection } = options;
  const { items, filteredItemsCount, pagesCount, currentPageIndex } = processItems(allItems, state, options);

  const filteringProperties = propertyFiltering?.filteringProperties;
  const filteringOptions = useMemo(
    () => (filteringProperties ? getFilteringOptions(allItems, filteringProperties) : []),
    [allItems, filteringProperties]
  );
  const filteringPropertyDefinitions = useMemo(
    () => (filteringProperties ?? []).map(toDefinition),
    [filteringProperties]
  );

  const noMatch = allItems.length > 0 && filteredItemsCount === 0;
  const collectionProps: CollectionProps<T> = {
    empty: noMatch
      ? (filtering?.noMatch ?? propertyFiltering?.noMatch)
      : (filtering?.empty ?? propertyFiltering?.empty),
  };
  if (sorting) {
    collectionProps.sortingColumn = state.sortingState?.sortingColumn;
    collectionProps.sortingDescending = state.sortingState?.isDescending;
    collectionProps.onSortingChange = ({ detail }) => actions.setSorting(detail);
  }
  if (selection) {
    collectionProps.selectedItems = state.selectedItems;
    collectionProps.onSelectionChange = ({ detail }) => actions.setSelectedItems(detail.selectedItems);
    collectionProps.trackBy = selection.trackBy;
  }

  return {
    items,
    filteredItemsCount,
    actions,
    collectionProps,
    filterProps: {
      filteringText: state.filteringText,
      onChange: ({ detail }) => actions.setFiltering(detail.filteringText),
    },
    propertyFilterProps: {
      query: state.propertyFilteringQuery,
      // Accepts the query as the detail itself or under `detail.query`, so it fits either event shape.
      onChange: ({ detail }) => actions.setPropertyFiltering(readQuery(detail)),
      filteringProperties: filteringPropertyDefinitions,
      filteringOptions,
    },
    paginationProps: {
      currentPageIndex,
      pagesCount,
      onChange: ({ detail }) => actions.setCurrentPage(detail.currentPageIndex),
    },
  };
}
