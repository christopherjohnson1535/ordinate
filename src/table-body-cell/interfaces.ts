// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TableBodyCellProps extends BaseComponentProps {
  /**
   * The content of the cell. Ignored when `selectionType` is set, because the cell then holds the
   * selection control.
   */
  children?: React.ReactNode;
  /**
   * Renders the cell as the header of its row (`<th scope="row">`), so screen readers announce it
   * when moving through the other cells of the row. Use it for the column that identifies each item,
   * such as its name.
   */
  isRowHeader?: boolean;
  /**
   * Vertical alignment of the content. `top` suits rows whose cells wrap onto several lines.
   */
  verticalAlign?: TableBodyCellProps.VerticalAlign;
  /**
   * The number of columns the cell spans, for example for a message that fills the whole row.
   */
  colSpan?: number;
  /**
   * Turns the cell into a selection cell holding a checkbox (`multi`) or a radio button (`single`).
   */
  selectionType?: TableBodyCellProps.SelectionType;
  /**
   * Whether the selection control is checked.
   */
  selected?: boolean;
  /**
   * Prevents the row from being selected or cleared.
   */
  selectionDisabled?: boolean;
  /**
   * Name of the radio group for single selection. Give every selection cell of a table the same name
   * so the arrow keys move between them.
   */
  selectionName?: string;
  /**
   * Accessible name of the selection control, such as "Select instance i-0a12". Defaults to "Select row".
   */
  selectionAriaLabel?: string;
  /**
   * Called when the user checks or clears the selection control, or clicks anywhere in the selection
   * cell. `event.detail.shiftKey` tells whether Shift was held, for selecting a range of rows.
   */
  onSelectionChange?: NonCancelableEventHandler<TableBodyCellProps.SelectionChangeDetail>;
}

export namespace TableBodyCellProps {
  export type VerticalAlign = 'middle' | 'top';

  export type SelectionType = 'single' | 'multi';

  export interface SelectionChangeDetail {
    /**
     * The requested state. Always `true` for single selection.
     */
    selected: boolean;
    shiftKey: boolean;
  }
}
