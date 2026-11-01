// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Which parts of a time are entered: hours, hours and minutes, or hours, minutes and seconds.
 */
export type TimeFormat = 'hh' | 'hh:mm' | 'hh:mm:ss';

export interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

const timePattern = /^(\d{2})(?::(\d{2}))?(?::(\d{2}))?$/;

export function getTimePartCount(format: TimeFormat): number {
  return format.split(':').length;
}

/**
 * Reads a complete `HH`, `HH:mm` or `HH:mm:ss` time with a 24-hour clock. Missing parts are zero.
 * Returns `null` for partial or impossible times.
 */
export function parseTime(value: string | null | undefined): TimeParts | null {
  const match = timePattern.exec(value ?? '');
  if (!match) {
    return null;
  }
  const [hours, minutes, seconds] = [match[1], match[2], match[3]].map(part => Number(part ?? 0));
  if (hours > 23 || minutes > 59 || seconds > 59) {
    return null;
  }
  return { hours, minutes, seconds };
}

/**
 * Whether `value` is a complete time with exactly the parts of `format`.
 */
export function isCompleteTime(value: string, format: TimeFormat): boolean {
  return parseTime(value) !== null && value.split(':').length === getTimePartCount(format);
}

/**
 * Writes the parts of a time that `format` asks for, such as `09:30` for `hh:mm`.
 */
export function formatTime({ hours, minutes, seconds }: TimeParts, format: TimeFormat): string {
  return [hours, minutes, seconds]
    .slice(0, getTimePartCount(format))
    .map(part => String(part).padStart(2, '0'))
    .join(':');
}

/**
 * Expands a complete time of any format to `HH:mm:ss`, or returns `null` when it is not complete.
 */
export function toFullTime(value: string): string | null {
  const parts = parseTime(value);
  return parts ? formatTime(parts, 'hh:mm:ss') : null;
}
