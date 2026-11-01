// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TableProps<T = unknown> extends BaseComponentProps {
  /**
   * The items shown as rows, in display order. The table neither sorts, filters nor pages them:
   * pass the items of the current page in the current order.
   */
  items: ReadonlyArray<T>;
  /**
   * The columns. Each column has a `header` and a `cell` function that renders the content for one item.
   * See `TableProps.ColumnDefinition` for sorting, widths and alignment.
   */
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  /**
   * Identifies each item: the name of a property that holds a unique value, or a function that returns
   * one. Selection relies on it to recognize items across re-renders and pages. Without it, items are
   * compared by reference.
   */
  trackBy?: TableProps.TrackBy<T>;
  /**
   * Replaces the rows with a loading message.
   */
  loading?: boolean;
  /**
   * The loading message. Defaults to "Loading".
   */
  loadingText?: string;
  /**
   * Shown in place of the rows when there are no items and the table is not loading, usually a short
   * message and an action.
   */
  empty?: React.ReactNode;
  /**
   * The heading area of the table. Use the Header component, with the item count as its `counter`
   * and actions in `actions`.
   */
  header?: React.ReactNode;
  /**
   * A short title drawn in small mono capitals directly above the column headings, like the title of a
   * schedule on a drawing: "Schedule of services". It is the table's caption, so it also names the table
   * for screen readers unless `ariaLabels.tableLabel` is set.
   */
  caption?: React.ReactNode;
  /**
   * Returns a short reference for each row, such as "S1", drawn in a circle in a narrow first column.
   * Use it to point at a row from elsewhere on the page, for example from a split panel's `headerTag`.
   * Receives the item and its index in `items`. Keep tags stable across sorting and paging, for example
   * by deriving them from the item rather than from the index.
   */
  rowTag?: (item: T, index: number) => string;
  /**
   * A filter control shown below the header, such as a text filter.
   */
  filter?: React.ReactNode;
  /**
   * A pagination control shown at the end of the row below the header.
   */
  pagination?: React.ReactNode;
  /**
   * A preferences control shown after the pagination, such as collection preferences.
   */
  preferences?: React.ReactNode;
  /**
   * Content below the rows, separated by a rule, such as a "View all" link.
   */
  footer?: React.ReactNode;
  /**
   * The column the items are sorted by, matched against the column definitions by object, by
   * `sortingField` or by `sortingComparator`.
   */
  sortingColumn?: TableProps.SortingColumn<T>;
  /**
   * Whether the items are sorted in descending order.
   */
  sortingDescending?: boolean;
  /**
   * Keeps the sorting indicators but stops the user from changing the order, for example while items load.
   */
  sortingDisabled?: boolean;
  /**
   * Called when the user activates a column heading to sort by it. The first activation sorts in
   * ascending order, and each further one reverses the order. The table does not sort the items:
   * sort them and update `sortingColumn` and `sortingDescending`.
   */
  onSortingChange?: NonCancelableEventHandler<TableProps.SortingState<T>>;
  /**
   * Adds a selection column: radio buttons for `single`, checkboxes and a select-all checkbox for
   * `multi`. With `multi`, Shift-click selects or clears every row between the last row changed and
   * this one.
   */
  selectionType?: TableProps.SelectionType;
  /**
   * The selected items. Selection is controlled: update this in `onSelectionChange`.
   */
  selectedItems?: ReadonlyArray<T>;
  /**
   * Called when the user changes the selection, with the full new list of selected items.
   * Selected items that are not on the current page are kept.
   */
  onSelectionChange?: NonCancelableEventHandler<TableProps.SelectionChangeDetail<T>>;
  /**
   * Returns `true` for items the user may not select or clear.
   */
  isItemDisabled?: (item: T) => boolean;
  /**
   * Accessible names for the table and its selection controls.
   */
  ariaLabels?: TableProps.AriaLabels<T>;
  /**
   * The order and visibility of the columns, by column `id`, usually from collection preferences.
   * Columns missing from the list are hidden. Without it, every column shows in definition order.
   */
  columnDisplay?: ReadonlyArray<TableProps.ColumnDisplayProperties>;
  /**
   * Keeps the column headings in view while the table scrolls past the top of the page or of a
   * scrolling container.
   */
  stickyHeader?: boolean;
  /**
   * Distance in pixels from the top of the scrolling area at which the sticky header stops, for
   * example the height of a fixed top navigation bar.
   */
  stickyHeaderVerticalOffset?: number;
  /**
   * Shades every second row.
   */
  stripedRows?: boolean;
  /**
   * Lets long cell content wrap onto several lines instead of keeping each row on one line.
   */
  wrapLines?: boolean;
  /**
   * `compact` tightens the rows of this table even when the page uses comfortable density.
   */
  contentDensity?: TableProps.ContentDensity;
  /**
   * The table is drawn as a schedule: column labels in small mono capitals, a heavy ink rule under them,
   * thin rules between the columns and the selected row in solid ink.
   *
   * - `container` draws the table on its own sheet, framed by a heavy ink rule, with the header and footer inside it.
   * - `full-page` is for a table that is the main content of a page: the header sits above the framed sheet.
   * - `embedded` is for a table placed inside another container: no sheet of its own, and thin rules only.
   * - `borderless` looks the same as `embedded`.
   */
  variant?: TableProps.Variant;
  /**
   * Lets the user change column widths by dragging the end of a column heading, or by focusing it and
   * using the arrow keys. Columns start at their `width`, or at the width of their content, and the
   * last column takes the remaining space.
   */
  resizableColumns?: boolean;
  /**
   * Called when the user finishes resizing a column, with the width of every column in the order of
   * `columnDefinitions`, including hidden ones. Store the widths in the column definitions to keep them.
   */
  onColumnWidthsChange?: NonCancelableEventHandler<TableProps.ColumnWidthsChangeDetail>;
  /**
   * The position of the first item of `items` in the whole data set, starting at 1. Set it, with
   * `totalItemsCount`, when the table shows one page of a longer list, so screen readers announce
   * the right row numbers.
   */
  firstIndex?: number;
  /**
   * The number of items in the whole data set, when the table shows only some of them.
   */
  totalItemsCount?: number;
  /**
   * Called when the user clicks a row, with the item and its index in `items`.
   */
  onRowClick?: NonCancelableEventHandler<TableProps.RowClickDetail<T>>;
  /**
   * Returns the text announced to screen readers when the shown items change, such as
   * "Showing items 11 to 20 of 54".
   */
  renderAriaLive?: (data: TableProps.LiveAnnouncement) => string;
}

export namespace TableProps {
  export type TrackBy<T> = string | ((item: T) => string);

  export type SelectionType = 'single' | 'multi';

  export type ContentDensity = 'comfortable' | 'compact';

  export type Variant = 'container' | 'embedded' | 'borderless' | 'full-page';

  export type VerticalAlign = 'middle' | 'top';

  export interface ColumnDefinition<T> {
    /**
     * Unique ID of the column, used by `columnDisplay` and as the React key. Required with `columnDisplay`.
     */
    id?: string;
    /**
     * The column heading.
     */
    header: React.ReactNode;
    /**
     * Renders the content of the column for one item.
     */
    cell: (item: T) => React.ReactNode;
    /**
     * The item property the column sorts by. Setting it, or `sortingComparator`, makes the column sortable.
     */
    sortingField?: string;
    /**
     * A comparison function for sorting by this column. It also makes the column sortable.
     */
    sortingComparator?: (a: T, b: T) => number;
    /**
     * Keeps the column from being sortable even with a `sortingField` or `sortingComparator`.
     */
    sortingDisabled?: boolean;
    /**
     * Width of the column, as a number of pixels or any CSS length. With resizable columns, only a
     * number is used as the starting width.
     */
    width?: number | string;
    /**
     * Smallest width of the column.
     */
    minWidth?: number | string;
    /**
     * Largest width of the column.
     */
    maxWidth?: number | string;
    /**
     * Makes the cells of this column the headers of their rows, so screen readers announce them while
     * moving through the row. Use it for the column that names each item.
     */
    isRowHeader?: boolean;
    /**
     * Vertical alignment of the cells. `top` suits columns whose content wraps onto several lines.
     */
    verticalAlign?: VerticalAlign;
  }

  export interface SortingColumn<T> {
    sortingField?: string;
    sortingComparator?: (a: T, b: T) => number;
  }

  export interface SortingState<T> {
    sortingColumn: SortingColumn<T>;
    isDescending?: boolean;
  }

  export interface SelectionChangeDetail<T> {
    selectedItems: T[];
  }

  export interface SelectionState<T> {
    selectedItems: ReadonlyArray<T>;
  }

  export interface AriaLabels<T> {
    /**
     * Accessible name of the table.
     */
    tableLabel?: string;
    /**
     * Accessible name of the select-all checkbox. Defaults to "Select all rows".
     */
    allItemsSelectionLabel?: (data: SelectionState<T>) => string;
    /**
     * Accessible name of the selection control of one row, such as "Select instance i-0a12".
     * Defaults to "Select row" and the row number.
     */
    itemSelectionLabel?: (data: SelectionState<T>, item: T) => string;
    /**
     * Name of the selection column for screen readers, used with single selection. Defaults to "Row selection".
     */
    selectionGroupLabel?: string;
    /**
     * How screen readers describe the column resize handles. Defaults to "resize handle".
     */
    resizerRoleDescription?: string;
  }

  export interface ColumnDisplayProperties {
    id: string;
    visible: boolean;
  }

  export interface ColumnWidthsChangeDetail {
    widths: ReadonlyArray<number>;
  }

  export interface RowClickDetail<T> {
    rowIndex: number;
    item: T;
  }

  export interface LiveAnnouncement {
    firstIndex: number;
    lastIndex: number;
    visibleItemsCount: number;
    totalItemsCount?: number;
  }
}
