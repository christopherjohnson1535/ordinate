// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import {
  addDays,
  addMonths,
  addYears,
  compareDays,
  compareMonths,
  createDate,
  daysInMonth,
  endOfMonth,
  endOfWeek,
  formatDayNumber,
  formatFullDate,
  formatIsoDate,
  formatIsoMonth,
  formatIsoValue,
  formatMonthYear,
  formatTime,
  getMonthGrid,
  getNextFocusedDate,
  getWeekdayNames,
  getWeekStart,
  getYearGrid,
  isCompleteTime,
  isDateSelectable,
  isDayBetween,
  isSameDay,
  isSameMonth,
  isWithinBounds,
  joinIsoDateTime,
  parseIsoDate,
  parseIsoDateTimeDay,
  parseIsoMonth,
  parseIsoValue,
  parseTime,
  resolveLocale,
  splitIsoDateTime,
  startOfMonth,
  startOfWeek,
  toFullTime,
} from '../../../lib/components/internal/dates';

const iso = (date: Date | null) => (date ? formatIsoDate(date) : null);

describe('date arithmetic', () => {
  test('creates local dates, keeping two-digit years as written', () => {
    expect(iso(createDate(2026, 2, 5))).toBe('2026-03-05');
    expect(createDate(45, 0, 1).getFullYear()).toBe(45);
  });

  test('counts the days in a month, including leap years', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2025, 1)).toBe(28);
    expect(daysInMonth(1900, 1)).toBe(28);
    expect(daysInMonth(2000, 1)).toBe(29);
    expect(daysInMonth(2026, 3)).toBe(30);
    expect(daysInMonth(2026, 11)).toBe(31);
  });

  test('adds days across months and years', () => {
    expect(iso(addDays(createDate(2026, 11, 31), 1))).toBe('2027-01-01');
    expect(iso(addDays(createDate(2026, 2, 1), -1))).toBe('2026-02-28');
  });

  test('adds months, clamping to the end of shorter months', () => {
    expect(iso(addMonths(createDate(2026, 0, 31), 1))).toBe('2026-02-28');
    expect(iso(addMonths(createDate(2024, 0, 31), 1))).toBe('2024-02-29');
    expect(iso(addMonths(createDate(2026, 0, 15), -1))).toBe('2025-12-15');
    expect(iso(addYears(createDate(2024, 1, 29), 1))).toBe('2025-02-28');
  });

  test('finds the start and end of months and weeks', () => {
    const date = createDate(2026, 2, 18); // A Wednesday.
    expect(iso(startOfMonth(date))).toBe('2026-03-01');
    expect(iso(endOfMonth(date))).toBe('2026-03-31');
    expect(iso(startOfWeek(date, 1))).toBe('2026-03-16');
    expect(iso(endOfWeek(date, 1))).toBe('2026-03-22');
    expect(iso(startOfWeek(date, 0))).toBe('2026-03-15');
    expect(iso(startOfWeek(date, 6))).toBe('2026-03-14');
  });

  test('compares by day and by month', () => {
    const morning = new Date(2026, 2, 5, 8);
    const evening = new Date(2026, 2, 5, 20);
    expect(isSameDay(morning, evening)).toBe(true);
    expect(isSameDay(morning, null)).toBe(false);
    expect(compareDays(morning, evening)).toBe(0);
    expect(compareDays(createDate(2026, 2, 4), morning)).toBeLessThan(0);
    expect(isSameMonth(createDate(2026, 2, 1), createDate(2026, 2, 31))).toBe(true);
    expect(compareMonths(createDate(2025, 11, 31), createDate(2026, 0, 1))).toBe(-1);
  });

  test('checks whether a day is between two others in either order', () => {
    const start = createDate(2026, 2, 5);
    const end = createDate(2026, 2, 10);
    expect(isDayBetween(createDate(2026, 2, 7), start, end)).toBe(true);
    expect(isDayBetween(createDate(2026, 2, 7), end, start)).toBe(true);
    expect(isDayBetween(end, start, end)).toBe(true);
    expect(isDayBetween(createDate(2026, 2, 11), start, end)).toBe(false);
  });
});

describe('ISO strings', () => {
  test('parses complete, possible days only', () => {
    expect(iso(parseIsoDate('2026-03-05'))).toBe('2026-03-05');
    expect(iso(parseIsoDate('2024-02-29'))).toBe('2024-02-29');
    expect(parseIsoDate('2025-02-29')).toBeNull();
    expect(parseIsoDate('2026-13-01')).toBeNull();
    expect(parseIsoDate('2026-00-10')).toBeNull();
    expect(parseIsoDate('2026-03')).toBeNull();
    expect(parseIsoDate('2026-3-5')).toBeNull();
    expect(parseIsoDate('')).toBeNull();
    expect(parseIsoDate(undefined)).toBeNull();
  });

  test('parses months', () => {
    expect(iso(parseIsoMonth('2026-03'))).toBe('2026-03-01');
    expect(parseIsoMonth('2026-13')).toBeNull();
    expect(parseIsoMonth('2026-03-01')).toBeNull();
    expect(iso(parseIsoValue('2026-03', 'month'))).toBe('2026-03-01');
    expect(iso(parseIsoValue('2026-03-09', 'day'))).toBe('2026-03-09');
  });

  test('formats with padding', () => {
    expect(formatIsoDate(createDate(987, 0, 2))).toBe('0987-01-02');
    expect(formatIsoMonth(createDate(2026, 8, 30))).toBe('2026-09');
    expect(formatIsoValue(createDate(2026, 8, 30), 'month')).toBe('2026-09');
    expect(formatIsoValue(createDate(2026, 8, 30), 'day')).toBe('2026-09-30');
  });

  test('splits and joins date-times', () => {
    expect(splitIsoDateTime('2026-03-05T14:30:00')).toEqual({ date: '2026-03-05', time: '14:30:00' });
    expect(splitIsoDateTime('2026-03-05T14:30:00.250+01:00')).toEqual({ date: '2026-03-05', time: '14:30:00' });
    expect(splitIsoDateTime('2026-03-05T14:30Z')).toEqual({ date: '2026-03-05', time: '14:30' });
    expect(splitIsoDateTime('2026-03-05')).toEqual({ date: '2026-03-05', time: '' });
    expect(joinIsoDateTime('2026-03-05', '09:00:00')).toBe('2026-03-05T09:00:00');
    expect(joinIsoDateTime('2026-03-05', '')).toBe('2026-03-05');
    expect(iso(parseIsoDateTimeDay('2026-03-05T23:59:59'))).toBe('2026-03-05');
  });
});

describe('time strings', () => {
  test('parses complete 24-hour times', () => {
    expect(parseTime('09')).toEqual({ hours: 9, minutes: 0, seconds: 0 });
    expect(parseTime('23:59')).toEqual({ hours: 23, minutes: 59, seconds: 0 });
    expect(parseTime('07:05:09')).toEqual({ hours: 7, minutes: 5, seconds: 9 });
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('12:60')).toBeNull();
    expect(parseTime('9:30')).toBeNull();
    expect(parseTime('')).toBeNull();
  });

  test('checks completeness against a format', () => {
    expect(isCompleteTime('09:30', 'hh:mm')).toBe(true);
    expect(isCompleteTime('09:30', 'hh:mm:ss')).toBe(false);
    expect(isCompleteTime('09:3', 'hh:mm')).toBe(false);
  });

  test('formats and expands times', () => {
    expect(formatTime({ hours: 9, minutes: 5, seconds: 0 }, 'hh:mm')).toBe('09:05');
    expect(formatTime({ hours: 9, minutes: 5, seconds: 0 }, 'hh')).toBe('09');
    expect(toFullTime('09:05')).toBe('09:05:00');
    expect(toFullTime('09:0')).toBeNull();
  });
});

describe('constraints', () => {
  const min = createDate(2026, 2, 5);
  const max = createDate(2026, 2, 20);

  test('checks bounds by day or by month', () => {
    expect(isWithinBounds(createDate(2026, 2, 4), { min, max })).toBe(false);
    expect(isWithinBounds(createDate(2026, 2, 5), { min, max })).toBe(true);
    expect(isWithinBounds(createDate(2026, 2, 21), { min, max })).toBe(false);
    expect(isWithinBounds(createDate(2026, 2, 1), { min, max }, 'month')).toBe(true);
    expect(isWithinBounds(createDate(2026, 3, 1), { min, max }, 'month')).toBe(false);
    expect(isWithinBounds(createDate(1900, 0, 1), {})).toBe(true);
  });

  test('combines bounds with the enabled check', () => {
    const isDateEnabled = (date: Date) => date.getDay() !== 0;
    expect(isDateSelectable(createDate(2026, 2, 8), { min, max, isDateEnabled })).toBe(false);
    expect(isDateSelectable(createDate(2026, 2, 9), { min, max, isDateEnabled })).toBe(true);
    expect(isDateSelectable(createDate(2026, 3, 9), { min, max, isDateEnabled })).toBe(false);
  });
});

describe('grids', () => {
  test('builds six weeks for a month, starting on the week start', () => {
    const grid = getMonthGrid(createDate(2026, 2, 18), 1);
    expect(grid).toHaveLength(6);
    expect(grid.every(week => week.length === 7)).toBe(true);
    expect(iso(grid[0][0])).toBe('2026-02-23');
    expect(iso(grid[0][6])).toBe('2026-03-01');
    expect(iso(grid[5][6])).toBe('2026-04-05');
  });

  test('starts on Sunday when asked', () => {
    const grid = getMonthGrid(createDate(2026, 2, 1), 0);
    expect(iso(grid[0][0])).toBe('2026-03-01');
  });

  test('builds a year of months in rows of three', () => {
    const grid = getYearGrid(createDate(2026, 6, 14));
    expect(grid).toHaveLength(4);
    expect(grid.map(row => row.map(date => date.getMonth()))).toEqual([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9, 10, 11],
    ]);
  });
});

describe('keyboard movement', () => {
  const date = createDate(2026, 2, 18); // A Wednesday.
  const move = (key: string, options: { shiftKey?: boolean; logicalStep?: -1 | 0 | 1 } = {}) =>
    iso(getNextFocusedDate(date, { key, logicalStep: 0, ...options }, 'day', 1));
  const moveMonth = (key: string, options: { shiftKey?: boolean; logicalStep?: -1 | 0 | 1 } = {}) => {
    const next = getNextFocusedDate(createDate(2026, 4, 1), { key, logicalStep: 0, ...options }, 'month', 1);
    return next ? formatIsoMonth(next) : null;
  };

  test('moves days by day, week, week end and month', () => {
    expect(move('ArrowRight', { logicalStep: 1 })).toBe('2026-03-19');
    expect(move('ArrowLeft', { logicalStep: -1 })).toBe('2026-03-17');
    expect(move('ArrowUp')).toBe('2026-03-11');
    expect(move('ArrowDown')).toBe('2026-03-25');
    expect(move('Home')).toBe('2026-03-16');
    expect(move('End')).toBe('2026-03-22');
    expect(move('PageUp')).toBe('2026-02-18');
    expect(move('PageDown')).toBe('2026-04-18');
    expect(move('PageUp', { shiftKey: true })).toBe('2025-03-18');
    expect(move('PageDown', { shiftKey: true })).toBe('2027-03-18');
    expect(move('Enter')).toBeNull();
  });

  test('follows the logical step, so right-to-left callers pass a reversed step', () => {
    expect(move('ArrowRight', { logicalStep: -1 })).toBe('2026-03-17');
  });

  test('moves months by month, row, row end and year', () => {
    expect(moveMonth('ArrowRight', { logicalStep: 1 })).toBe('2026-06');
    expect(moveMonth('ArrowUp')).toBe('2026-02');
    expect(moveMonth('ArrowDown')).toBe('2026-08');
    expect(moveMonth('Home')).toBe('2026-04');
    expect(moveMonth('End')).toBe('2026-06');
    expect(moveMonth('PageUp')).toBe('2025-05');
    expect(moveMonth('PageDown', { shiftKey: true })).toBe('2036-05');
  });
});

describe('locale helpers', () => {
  test('finds the first day of the week by locale', () => {
    expect(getWeekStart('en-US')).toBe(0);
    expect(getWeekStart('en-GB')).toBe(1);
    expect(getWeekStart('de-DE')).toBe(1);
    expect(getWeekStart('ar-EG')).toBe(6);
    expect(getWeekStart('not a locale')).toBe(1);
  });

  test('resolves a usable locale', () => {
    expect(resolveLocale('fr-FR')).toBe('fr-FR');
    expect(resolveLocale('%%')).not.toBe('%%');
  });

  test('names weekdays in display order', () => {
    const names = getWeekdayNames('en-US', 1, 'short');
    expect(names[0]).toEqual({ day: 1, name: 'Mon' });
    expect(names[6]).toEqual({ day: 0, name: 'Sun' });
  });

  test('formats months, days and full dates', () => {
    const date = createDate(2026, 2, 5);
    expect(formatMonthYear(date, 'en-US')).toBe('March 2026');
    expect(formatDayNumber(date, 'en-US')).toBe('5');
    expect(formatFullDate(date, 'en-US')).toBe('Thursday, March 5, 2026');
    expect(formatMonthYear(date, 'de-DE')).toBe('März 2026');
  });
});
