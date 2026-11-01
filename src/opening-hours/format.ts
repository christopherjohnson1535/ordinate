// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createDate } from '../internal/dates/arithmetic';
import { getDateFormatter } from '../internal/dates/locale';
import { OpeningHoursProps } from './interfaces';

export const dayIndexes: Readonly<Record<OpeningHoursProps.DayName, number>> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export interface ClockTime {
  hours: number;
  minutes: number;
}

/**
 * Reads a time written on a 24-hour clock, such as `8:00` or `17:30`. `24:00` is accepted for
 * midnight at the end of the day. Returns `null` for anything else.
 */
export function parseClockTime(value: string): ClockTime | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (minutes > 59 || hours > 24 || (hours === 24 && minutes > 0)) {
    return null;
  }
  return { hours, minutes };
}

/**
 * The machine-readable form of a time for a `<time>` element, such as `08:00`.
 */
export function toDateTimeAttribute({ hours, minutes }: ClockTime): string {
  return `${String(hours % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function hourCycle(timeFormat: OpeningHoursProps.TimeFormat | undefined): Intl.DateTimeFormatOptions {
  switch (timeFormat) {
    case '12h':
      return { hour: 'numeric', hourCycle: 'h12' };
    case '24h':
      return { hour: '2-digit', hourCycle: 'h23' };
    default:
      return { hour: 'numeric' };
  }
}

export function formatClockTime(
  time: ClockTime,
  locale: string,
  timeFormat: OpeningHoursProps.TimeFormat | undefined
): string {
  // Any fixed day works; only the time of day is shown.
  const date = createDate(2023, 0, 2);
  date.setHours(time.hours % 24, time.minutes);
  return getDateFormatter(locale, { ...hourCycle(timeFormat), minute: '2-digit' }).format(date);
}

export function formatDayName(day: OpeningHoursProps.DayName, locale: string): string {
  // January 1, 2023 was a Sunday, so adding the day's index gives that weekday.
  return getDateFormatter(locale, { weekday: 'long' }).format(createDate(2023, 0, 1 + dayIndexes[day]));
}
