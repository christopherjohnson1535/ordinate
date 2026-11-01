// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from 'react';

/**
 * The part of an event the hook reads. Ordinate components pass a `CustomEvent`, which fits this shape.
 */
export interface DetailEvent<Detail> {
  detail: Detail;
}

export type DetailEventHandler<Detail> = (event: DetailEvent<Detail>) => void;

/**
 * The fields of a table or cards column definition that sorting uses.
 */
export interface SortingColumn<T> {
  /**
   * The item property to sort by when there is no `sortingComparator`.
   */
  sortingField?: string;
  /**
   * Compares two items, returning a negative number when `a` comes first in ascending order.
   */
  sortingComparator?: (a: T, b: T) => number;
}

export interface SortingState<T> {
  sortingColumn: SortingColumn<T>;
  isDescending?: boolean;
}

export type PropertyFilterOperator = '=' | '!=' | ':' | '!:' | '>' | '<' | '>=' | '<=' | '^' | '!^';

/**
 * An operator with its own matching rule, for values the built-in comparison does not understand.
 */
export interface PropertyFilterOperatorExtended<TokenValue = unknown> {
  operator: PropertyFilterOperator;
  /**
   * Returns whether an item's value matches the token value. Negated operators should return the
   * negated result themselves.
   */
  match?: (itemValue: unknown, tokenValue: TokenValue) => boolean;
}

export interface FilteringProperty {
  /**
   * The item property the filter reads.
   */
  key: string;
  propertyLabel: string;
  groupValuesLabel: string;
  /**
   * Operators the property supports, in addition to its default operator.
   */
  operators?: ReadonlyArray<PropertyFilterOperator | PropertyFilterOperatorExtended>;
  /**
   * The operator used when a token does not name one. Defaults to `=`.
   */
  defaultOperator?: PropertyFilterOperator;
  group?: string;
}

export interface FilteringOption {
  propertyKey: string;
  value: string;
  label?: string;
}

export interface PropertyFilterToken {
  /**
   * The property to match. Without it, the token is free text matched against every filtering property.
   */
  propertyKey?: string;
  operator: PropertyFilterOperator;
  value: unknown;
}

export type PropertyFilterOperation = 'and' | 'or';

export interface PropertyFilterQuery {
  tokens: ReadonlyArray<PropertyFilterToken>;
  operation: PropertyFilterOperation;
}

export interface UseCollectionOptions<T> {
  /**
   * Text filtering, for a text filter. Filters before property filtering, sorting and pagination.
   */
  filtering?: {
    /**
     * Decides whether an item matches the text. By default an item matches when any of `fields`,
     * or any of its own string, number or boolean properties, contains the text, ignoring case.
     */
    filteringFunction?: (item: T, filteringText: string, fields?: ReadonlyArray<string>) => boolean;
    /**
     * The item properties the default filtering function searches.
     */
    fields?: ReadonlyArray<string>;
    /**
     * Shown by the collection when there are no items at all.
     */
    empty?: ReactNode;
    /**
     * Shown by the collection when no item matches the filter.
     */
    noMatch?: ReactNode;
    defaultFilteringText?: string;
  };
  /**
   * Property filtering, for a property filter.
   */
  propertyFiltering?: {
    filteringProperties: ReadonlyArray<FilteringProperty>;
    /**
     * Replaces the built-in token matching.
     */
    filteringFunction?: (item: T, query: PropertyFilterQuery) => boolean;
    defaultQuery?: PropertyFilterQuery;
    empty?: ReactNode;
    noMatch?: ReactNode;
  };
  sorting?: {
    defaultState?: SortingState<T>;
  };
  pagination?: {
    /**
     * Items per page. Defaults to 10.
     */
    pageSize?: number;
    /**
     * The page shown first, counting from 1.
     */
    defaultPage?: number;
  };
  selection?: {
    defaultSelectedItems?: ReadonlyArray<T>;
    /**
     * Keeps the selection when the filter, sorting or page changes. By default those changes clear it,
     * so the user never acts on items they can no longer see.
     */
    keepSelection?: boolean;
    /**
     * The property, or a function, that identifies an item across data reloads.
     */
    trackBy?: string | ((item: T) => string);
  };
}

export interface CollectionActions<T> {
  setFiltering(filteringText: string): void;
  setPropertyFiltering(query: PropertyFilterQuery): void;
  setSorting(state: SortingState<T>): void;
  setCurrentPage(pageIndex: number): void;
  setSelectedItems(selectedItems: ReadonlyArray<T>): void;
}

export interface CollectionProps<T> {
  empty?: ReactNode;
  sortingColumn?: SortingColumn<T>;
  sortingDescending?: boolean;
  onSortingChange?: DetailEventHandler<SortingState<T>>;
  selectedItems?: ReadonlyArray<T>;
  onSelectionChange?: DetailEventHandler<{ selectedItems: ReadonlyArray<T> }>;
  trackBy?: string | ((item: T) => string);
}

export interface FilterProps {
  filteringText: string;
  onChange: DetailEventHandler<{ filteringText: string }>;
}

export interface PropertyFilterProps {
  query: PropertyFilterQuery;
  onChange: DetailEventHandler<PropertyFilterQuery | { query: PropertyFilterQuery }>;
  filteringProperties: ReadonlyArray<FilteringProperty>;
  filteringOptions: ReadonlyArray<FilteringOption>;
}

export interface PaginationProps {
  currentPageIndex: number;
  pagesCount: number;
  onChange: DetailEventHandler<{ currentPageIndex: number }>;
}

export interface UseCollectionResult<T> {
  /**
   * The items to render: filtered, sorted and cut to the current page.
   */
  items: ReadonlyArray<T>;
  /**
   * How many items match the filters across all pages. `undefined` when no filtering is set up.
   */
  filteredItemsCount: number | undefined;
  actions: CollectionActions<T>;
  collectionProps: CollectionProps<T>;
  filterProps: FilterProps;
  propertyFilterProps: PropertyFilterProps;
  paginationProps: PaginationProps;
}
