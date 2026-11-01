// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface ColumnLayoutProps extends BaseComponentProps {
  /**
   * The largest number of columns, from 1 to 4. Columns drop away as the container gets narrower: below
   * 465 pixels everything stacks in one column, and below 688 pixels at most two columns remain.
   */
  columns?: ColumnLayoutProps.Columns;
  /**
   * - `default` places the children in columns with no decoration.
   * - `text-grid` rules off the columns with vertical lines, for runs of text or key-value content.
   *   It ignores `borders`.
   */
  variant?: ColumnLayoutProps.Variant;
  /**
   * Lines drawn between the children.
   *
   * - `none` draws no lines.
   * - `vertical` draws a line between neighboring columns.
   * - `horizontal` draws a line between rows.
   * - `all` draws both.
   */
  borders?: ColumnLayoutProps.Borders;
  /**
   * The narrowest a column may get, in pixels. When set, the layout fits as many columns as this width
   * allows, up to `columns`, instead of following the built-in breakpoints.
   */
  minColumnWidth?: number;
  /**
   * Removes the space between columns and rows, and next to any lines.
   */
  disableGutters?: boolean;
  /**
   * The content of the columns. Each child takes one cell, filling the rows in reading order.
   */
  children?: React.ReactNode;
}

export namespace ColumnLayoutProps {
  export type Columns = 1 | 2 | 3 | 4;

  export type Variant = 'default' | 'text-grid';

  export type Borders = 'none' | 'vertical' | 'horizontal' | 'all';
}
