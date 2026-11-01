// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createDate, daysInMonth } from './arithmetic';

/**
 * How fine a date value is: a whole day (`YYYY-MM-DD`) or a whole month (`YYYY-MM`).
 */
export type DateGranularity = 'day' | 'month';

const dayPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const monthPattern = /^(\d{4})-(\d{2})$/;

function pad(value: number, length: number): string {
  return String(value).padStart(length, '0');
}

/**
 * Reads a complete `YYYY-MM-DD` string as a local date. Returns `null` for anything else,
 * including impossible days such as `2025-02-30`.
 */
export function parseIsoDate(value: string | null | undefined): Date | null {
  const match = dayPattern.exec(value ?? '');
  if (!match) {
    return null;
  }
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month - 1)) {
    return null;
  }
  return createDate(year, month - 1, day);
}

/**
 * Reads a complete `YYYY-MM` string as the first day of that month.
 */
export function parseIsoMonth(value: string | null | undefined): Date | null {
  const match = monthPattern.exec(value ?? '');
  if (!match) {
    return null;
  }
  const [year, month] = [Number(match[1]), Number(match[2])];
  if (month < 1 || month > 12) {
    return null;
  }
  return createDate(year, month - 1, 1);
}

/**
 * Reads a complete value of the given granularity, or `null`.
 */
export function parseIsoValue(value: string | null | undefined, granularity: DateGranularity): Date | null {
  return granularity === 'month' ? parseIsoMonth(value) : parseIsoDate(value);
}

export function formatIsoDate(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`;
}

export function formatIsoMonth(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}`;
}

export function formatIsoValue(date: Date, granularity: DateGranularity): string {
  return granularity === 'month' ? formatIsoMonth(date) : formatIsoDate(date);
}

/**
 * Splits an ISO date-time such as `2026-03-05T14:30:00` into its date and time parts.
 * A value without a time gets an empty time.
 */
export function splitIsoDateTime(value: string): { date: string; time: string } {
  const [date = '', time = ''] = value.split('T');
  // Offsets and fractions are not edited in the inputs, so they are dropped from the time part.
  return { date, time: time.replace(/(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/, '') };
}

/**
 * Joins a date and a time into an ISO date-time, or returns the date alone when there is no time.
 */
export function joinIsoDateTime(date: string, time: string): string {
  return time ? `${date}T${time}` : date;
}

/**
 * Reads the date part of an ISO date or date-time string as a local date.
 */
export function parseIsoDateTimeDay(value: string | null | undefined): Date | null {
  return parseIsoDate(splitIsoDateTime(value ?? '').date);
}
