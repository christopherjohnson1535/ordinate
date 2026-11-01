// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { breakpointMinWidths } from '../internal/breakpoints';

export interface ColumnCountOptions {
  columns: number;
  /**
   * The measured width of the layout, or `null` before it has been measured.
   */
  width: number | null;
  minColumnWidth?: number;
  /**
   * The space between columns, in pixels.
   */
  gap: number;
}

function breakpointLimit(width: number): number {
  if (width < breakpointMinWidths.xxs) {
    return 1;
  }
  return width < breakpointMinWidths.xs ? 2 : Infinity;
}

function minWidthLimit(width: number, minColumnWidth: number, gap: number): number {
  return Math.floor((width + gap) / (minColumnWidth + gap));
}

/**
 * How many columns fit. Before the layout is measured, such as while rendering on the server, it
 * assumes there is room for all of them.
 */
export function getColumnCount({ columns, width, minColumnWidth, gap }: ColumnCountOptions): number {
  if (width === null) {
    return columns;
  }
  const limit =
    minColumnWidth && minColumnWidth > 0 ? minWidthLimit(width, minColumnWidth, gap) : breakpointLimit(width);
  return Math.max(1, Math.min(columns, limit));
}
