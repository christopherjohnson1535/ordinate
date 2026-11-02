// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TableHeaderCellProps extends BaseComponentProps {
  /**
   * The column heading. Ignored when `selectionType` is set, because the cell then holds the
   * selection control.
   */
  children?: React.ReactNode;
  /**
   * Makes the column sortable and tells how it is sorted now. The heading becomes a button that
   * requests a new order through `onSortingChange`, and the cell gets the matching `aria-sort`.
   * Leave it out for a column that cannot be sorted.
   */
  sortingState?: TableHeaderCellProps.SortingState;
  /**
   * Keeps the sorting indicator but stops the user from changing the order, for example while data loads.
   */
  sortingDisabled?: boolean;
  /**
   * Called when the user activates the sorting button. `event.detail.descending` is the requested
   * direction: ascending for an unsorted or descending column, descending for an ascending one.
   * The cell does not change on its own: update `sortingState`.
   */
  onSortingChange?: NonCancelableEventHandler<TableHeaderCellProps.SortingChangeDetail>;
  /**
   * What the column holds. `number` aligns the heading to the end of the cell, over figures set with a
   * `TableBodyCell` of the same `contentType`. `text` and `identifier` keep it at the start.
   */
  contentType?: TableHeaderCellProps.ContentType;
  /**
   * Width of the column, as a number of pixels or any CSS length.
   */
  width?: number | string;
  /**
   * Smallest width of the column. Resizing stops at this width, which defaults to 80 pixels for a
   * resizable column.
   */
  minWidth?: number | string;
  /**
   * Largest width of the column. Resizing stops at this width.
   */
  maxWidth?: number | string;
  /**
   * Adds a handle at the end of the cell that the user drags, or focuses and moves with the arrow
   * keys, to change the column width. Use it in a table root with the `fixed` layout.
   */
  resizable?: boolean;
  /**
   * Called continuously while the user resizes the column, with the new width in pixels.
   * The cell does not change on its own: update `width`.
   */
  onResize?: NonCancelableEventHandler<TableHeaderCellProps.ResizeDetail>;
  /**
   * Called once the user lets go of the resize handle, or after each arrow key press, with the final
   * width in pixels. Use it to save the width.
   */
  onResizeEnd?: NonCancelableEventHandler<TableHeaderCellProps.ResizeDetail>;
  /**
   * How screen readers describe the resize handle, which is named after the column heading.
   * Defaults to "resize handle".
   */
  resizerRoleDescription?: string;
  /**
   * Turns the cell into the heading of a narrow row tag column, the column of `TableBodyCell`s with a
   * `rowTag`. The heading reads "Tag" unless you pass your own in `children`.
   */
  rowTagColumn?: boolean;
  /**
   * Turns the cell into the heading of a selection column. `multi` shows a checkbox that selects or
   * clears every row. `single` shows nothing, but still names the column for screen readers.
   */
  selectionType?: TableHeaderCellProps.SelectionType;
  /**
   * Whether the select-all checkbox is checked, for multiple selection.
   */
  selected?: boolean;
  /**
   * Shows the select-all checkbox as partly checked, when only some rows are selected.
   */
  indeterminate?: boolean;
  /**
   * Prevents the user from using the select-all checkbox.
   */
  selectionDisabled?: boolean;
  /**
   * Accessible name of the select-all checkbox, or of the selection column for single selection.
   * Defaults to "Select all rows" and "Row selection".
   */
  selectionAriaLabel?: string;
  /**
   * Called when the user checks or clears the select-all checkbox, with the requested state.
   */
  onSelectionChange?: NonCancelableEventHandler<TableHeaderCellProps.SelectionChangeDetail>;
}

export namespace TableHeaderCellProps {
  export type SortingState = 'unsorted' | 'ascending' | 'descending';

  export type SelectionType = 'single' | 'multi';

  export type ContentType = 'text' | 'identifier' | 'number';

  export interface SortingChangeDetail {
    descending: boolean;
  }

  export interface ResizeDetail {
    width: number;
  }

  export interface SelectionChangeDetail {
    selected: boolean;
  }
}
