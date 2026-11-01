// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { addDays, addMonths, addYears, createDate, endOfWeek, startOfMonth, startOfWeek } from './arithmetic';
import { DateGranularity } from './iso';

/**
 * Weeks shown in every month grid. A fixed count keeps the grid the same height from month to
 * month, so a popup does not jump while the user pages through months.
 */
export const weeksPerGrid = 6;

/**
 * Months per row in a year grid.
 */
export const monthsPerRow = 3;

/**
 * The days shown for `month`, as weeks starting on `weekStart`. Leading and trailing days come
 * from the neighboring months.
 */
export function getMonthGrid(month: Date, weekStart: number): Date[][] {
  const first = startOfWeek(startOfMonth(month), weekStart);
  return Array.from({ length: weeksPerGrid }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day))
  );
}

/**
 * The twelve months of the year that holds `date`, as rows of `monthsPerRow`.
 */
export function getYearGrid(date: Date): Date[][] {
  const year = date.getFullYear();
  return Array.from({ length: 12 / monthsPerRow }, (_, row) =>
    Array.from({ length: monthsPerRow }, (_, column) => createDate(year, row * monthsPerRow + column, 1))
  );
}

export interface GridKeyPress {
  key: string;
  shiftKey?: boolean;
  /**
   * The step a horizontal arrow key takes along the reading direction: `1` toward the end of the
   * line, `-1` toward the start, `0` for other keys. Comes from `getLogicalArrowStep`.
   */
  logicalStep: -1 | 0 | 1;
}

function moveDay(date: Date, { key, shiftKey, logicalStep }: GridKeyPress, weekStart: number): Date | null {
  if (logicalStep !== 0) {
    return addDays(date, logicalStep);
  }
  switch (key) {
    case 'ArrowUp':
      return addDays(date, -7);
    case 'ArrowDown':
      return addDays(date, 7);
    case 'Home':
      return startOfWeek(date, weekStart);
    case 'End':
      return endOfWeek(date, weekStart);
    case 'PageUp':
      return shiftKey ? addYears(date, -1) : addMonths(date, -1);
    case 'PageDown':
      return shiftKey ? addYears(date, 1) : addMonths(date, 1);
  }
  return null;
}

function moveMonth(date: Date, { key, shiftKey, logicalStep }: GridKeyPress): Date | null {
  const column = date.getMonth() % monthsPerRow;
  if (logicalStep !== 0) {
    return addMonths(date, logicalStep);
  }
  switch (key) {
    case 'ArrowUp':
      return addMonths(date, -monthsPerRow);
    case 'ArrowDown':
      return addMonths(date, monthsPerRow);
    case 'Home':
      return addMonths(date, -column);
    case 'End':
      return addMonths(date, monthsPerRow - 1 - column);
    case 'PageUp':
      return addYears(date, shiftKey ? -10 : -1);
    case 'PageDown':
      return addYears(date, shiftKey ? 10 : 1);
  }
  return null;
}

/**
 * Where focus goes in a calendar grid after a key press, or `null` when the key does not move it.
 * Days move by day, by week (up and down), to the ends of the week (Home and End) and by month
 * (Page Up and Page Down, by year with Shift). Months move by month, by row, to the ends of the
 * row, and by year (by decade with Shift).
 */
export function getNextFocusedDate(
  date: Date,
  press: GridKeyPress,
  granularity: DateGranularity,
  weekStart: number
): Date | null {
  return granularity === 'month' ? moveMonth(date, press) : moveDay(date, press, weekStart);
}
