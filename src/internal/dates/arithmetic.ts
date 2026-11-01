// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Every date here is a local calendar day at midnight. Arithmetic goes through the calendar
// fields rather than milliseconds, so a daylight saving change never shifts a day.

/**
 * A new local date at midnight. `month` counts from 0, as in `Date`. Years 0 to 99 stay as
 * written instead of mapping to 1900 to 1999.
 */
export function createDate(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day);
  if (year >= 0 && year < 100) {
    date.setFullYear(year, month, day);
  }
  return date;
}

/**
 * The calendar day of `date`, without its time.
 */
export function startOfDay(date: Date): Date {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate());
}

export function today(): Date {
  return startOfDay(new Date());
}

export function daysInMonth(year: number, month: number): number {
  return createDate(year, month + 1, 0).getDate();
}

export function addDays(date: Date, amount: number): Date {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/**
 * Moves by whole months, keeping the day of the month where it exists and otherwise using the
 * last day, so January 31 plus one month is the end of February.
 */
export function addMonths(date: Date, amount: number): Date {
  const target = createDate(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
  return createDate(target.getFullYear(), target.getMonth(), day);
}

export function addYears(date: Date, amount: number): Date {
  return addMonths(date, amount * 12);
}

export function startOfMonth(date: Date): Date {
  return createDate(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * The first day of the week that holds `date`. `weekStart` is 0 for Sunday to 6 for Saturday.
 */
export function startOfWeek(date: Date, weekStart: number): Date {
  const offset = (date.getDay() - weekStart + 7) % 7;
  return addDays(date, -offset);
}

export function endOfWeek(date: Date, weekStart: number): Date {
  return addDays(startOfWeek(date, weekStart), 6);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/**
 * Orders two dates by calendar day, ignoring the time: negative when `a` is earlier.
 */
export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

/**
 * Orders two dates by calendar month, ignoring the day.
 */
export function compareMonths(a: Date, b: Date): number {
  return a.getFullYear() * 12 + a.getMonth() - (b.getFullYear() * 12 + b.getMonth());
}

/**
 * Whether `date` falls on or between two days, in either order.
 */
export function isDayBetween(date: Date, start: Date, end: Date): boolean {
  const [low, high] = compareDays(start, end) <= 0 ? [start, end] : [end, start];
  return compareDays(date, low) >= 0 && compareDays(date, high) <= 0;
}
