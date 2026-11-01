// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface TableRootProps extends BaseComponentProps {
  /**
   * The parts of the table: a `TableHead` and a `TableBody`.
   */
  children?: React.ReactNode;
  /**
   * Accessible name of the table, for a table without a visible heading to point to with `ariaLabelledby`.
   */
  ariaLabel?: string;
  /**
   * ID of the element that names the table, usually its heading.
   */
  ariaLabelledby?: string;
  /**
   * ID of the element that describes the table.
   */
  ariaDescribedby?: string;
  /**
   * The total number of rows, including the header row, when the table shows only some of them,
   * for example one page of a longer list. Give each row its position with `TableRow`'s `ariaRowindex`.
   */
  ariaRowcount?: number;
  /**
   * Keeps the header row in view while the table scrolls past the top of the page or of a scrolling
   * container.
   */
  stickyHeader?: boolean;
  /**
   * Distance in pixels from the top of the scrolling area at which the sticky header stops, for
   * example the height of a fixed top navigation bar.
   */
  stickyHeaderVerticalOffset?: number;
  /**
   * Shades every second body row, to help the eye follow wide rows.
   */
  stripedRows?: boolean;
  /**
   * Lets long cell content wrap onto several lines. By default it stays on one line, and the table
   * scrolls sideways when it does not fit.
   */
  wrapLines?: boolean;
  /**
   * `compact` tightens the rows of this table even when the page uses comfortable density.
   * `comfortable` follows the density of the page.
   */
  contentDensity?: TableRootProps.ContentDensity;
  /**
   * - `auto` sizes columns to their content.
   * - `fixed` gives each column the width set on its header cell. A column without a width takes the
   *   remaining space. Use it with resizable columns, and to keep the layout steady while data changes.
   */
  layout?: TableRootProps.Layout;
}

export namespace TableRootProps {
  export type ContentDensity = 'comfortable' | 'compact';

  export type Layout = 'auto' | 'fixed';
}
