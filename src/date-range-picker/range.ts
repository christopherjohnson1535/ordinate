// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { compareDays } from '../internal/dates/arithmetic';
import { formatIsoDate, joinIsoDateTime, parseIsoDate, splitIsoDateTime } from '../internal/dates/iso';
import { getDateFormatter } from '../internal/dates/locale';
import { formatTime, isCompleteTime, parseTime, toFullTime } from '../internal/dates/time';
import { DateRangePickerProps } from './interfaces';

export type Mode = 'absolute' | 'relative';

/**
 * The value of the custom duration option in the list of relative ranges.
 */
export const customOptionKey = 'ord-custom-range';

export const allUnits: ReadonlyArray<DateRangePickerProps.TimeUnit> = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
];

export function getUnits(dateOnly: boolean): ReadonlyArray<DateRangePickerProps.TimeUnit> {
  return dateOnly ? allUnits.slice(allUnits.indexOf('day')) : allUnits;
}

/**
 * The range being edited in the popup. Dates and times are the text of the inputs, so they can be partial.
 */
export interface AbsoluteDraft {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface RelativeDraft {
  selectedKey: string | null;
  amount: string;
  unit: DateRangePickerProps.TimeUnit;
}

export interface Draft {
  mode: Mode;
  absolute: AbsoluteDraft;
  relative: RelativeDraft;
}

export type ErrorKey =
  'noRangeSelectedErrorText' | 'incompleteRangeErrorText' | 'endBeforeStartErrorText' | 'customDurationErrorText';

export type ApplyResult = { value: DateRangePickerProps.Value } | { error: ErrorKey };

interface DraftOptions {
  rangeSelectorMode: DateRangePickerProps.RangeSelectorMode;
  relativeOptions: ReadonlyArray<DateRangePickerProps.RelativeOption>;
  timeInputFormat: DateRangePickerProps.TimeInputFormat;
  dateOnly: boolean;
}

function getInitialMode(value: DateRangePickerProps.Value | null, options: DraftOptions): Mode {
  if (options.rangeSelectorMode === 'absolute-only') {
    return 'absolute';
  }
  if (options.rangeSelectorMode === 'relative-only') {
    return 'relative';
  }
  return value?.type ?? (options.relativeOptions.length > 0 ? 'relative' : 'absolute');
}

function toInputTime(time: string, format: DateRangePickerProps.TimeInputFormat): string {
  const parts = parseTime(time);
  return parts ? formatTime(parts, format) : '';
}

/**
 * The popup's starting state for the current value.
 */
export function createDraft(value: DateRangePickerProps.Value | null, options: DraftOptions): Draft {
  const absolute: AbsoluteDraft = { startDate: '', startTime: '', endDate: '', endTime: '' };
  const relative: RelativeDraft = { selectedKey: null, amount: '', unit: options.dateOnly ? 'day' : 'minute' };
  if (value?.type === 'absolute') {
    const start = splitIsoDateTime(value.startDate);
    const end = splitIsoDateTime(value.endDate);
    Object.assign(absolute, {
      startDate: start.date,
      startTime: toInputTime(start.time, options.timeInputFormat),
      endDate: end.date,
      endTime: toInputTime(end.time, options.timeInputFormat),
    });
  } else if (value?.type === 'relative') {
    const option = options.relativeOptions.find(
      item =>
        (value.key !== undefined && item.key === value.key) ||
        (item.amount === value.amount && item.unit === value.unit)
    );
    relative.selectedKey = option ? option.key : customOptionKey;
    if (!option) {
      relative.amount = String(value.amount);
      relative.unit = value.unit;
    }
  }
  return { mode: getInitialMode(value, options), absolute, relative };
}

function defaultTimes(format: DateRangePickerProps.TimeInputFormat) {
  return {
    start: formatTime({ hours: 0, minutes: 0, seconds: 0 }, format),
    end: formatTime({ hours: 23, minutes: 59, seconds: 59 }, format),
  };
}

/**
 * Picks a day in the calendar. The first pick starts a new range; the second ends it, and the two
 * swap when the second comes first. Empty times get the start and end of the day.
 */
export function pickDay(draft: AbsoluteDraft, date: Date, format: DateRangePickerProps.TimeInputFormat): AbsoluteDraft {
  const times = defaultTimes(format);
  const start = parseIsoDate(draft.startDate);
  const day = formatIsoDate(date);
  if (!start || parseIsoDate(draft.endDate)) {
    return {
      startDate: day,
      startTime: draft.startTime || times.start,
      endDate: '',
      endTime: draft.endTime || times.end,
    };
  }
  if (compareDays(date, start) < 0) {
    return { ...draft, startDate: day, endDate: draft.startDate, endTime: draft.endTime || times.end };
  }
  return { ...draft, endDate: day, endTime: draft.endTime || times.end };
}

function completeTime(time: string, fallback: string, format: DateRangePickerProps.TimeInputFormat): string | null {
  if (time === '') {
    return toFullTime(fallback);
  }
  return isCompleteTime(time, format) ? toFullTime(time) : null;
}

function applyAbsolute(draft: AbsoluteDraft, options: DraftOptions): ApplyResult {
  const start = parseIsoDate(draft.startDate);
  const end = parseIsoDate(draft.endDate);
  if (!draft.startDate && !draft.endDate) {
    return { error: 'noRangeSelectedErrorText' };
  }
  if (!start || !end) {
    return { error: 'incompleteRangeErrorText' };
  }
  if (options.dateOnly) {
    return compareDays(start, end) > 0
      ? { error: 'endBeforeStartErrorText' }
      : { value: { type: 'absolute', startDate: draft.startDate, endDate: draft.endDate } };
  }
  const times = defaultTimes(options.timeInputFormat);
  const startTime = completeTime(draft.startTime, times.start, options.timeInputFormat);
  const endTime = completeTime(draft.endTime, times.end, options.timeInputFormat);
  if (!startTime || !endTime) {
    return { error: 'incompleteRangeErrorText' };
  }
  const startDate = joinIsoDateTime(draft.startDate, startTime);
  const endDate = joinIsoDateTime(draft.endDate, endTime);
  // Complete ISO strings of the same shape sort as text in time order.
  if (startDate > endDate) {
    return { error: 'endBeforeStartErrorText' };
  }
  return { value: { type: 'absolute', startDate, endDate } };
}

function applyRelative(draft: RelativeDraft, options: DraftOptions): ApplyResult {
  if (draft.selectedKey === null) {
    return { error: 'noRangeSelectedErrorText' };
  }
  if (draft.selectedKey === customOptionKey) {
    const amount = Number(draft.amount);
    if (!/^\d+$/.test(draft.amount.trim()) || amount < 1) {
      return { error: 'customDurationErrorText' };
    }
    return { value: { type: 'relative', amount, unit: draft.unit } };
  }
  const option = options.relativeOptions.find(item => item.key === draft.selectedKey);
  if (!option) {
    return { error: 'noRangeSelectedErrorText' };
  }
  return { value: { type: 'relative', amount: option.amount, unit: option.unit, key: option.key } };
}

/**
 * Turns the popup's state into a value, or names the built-in error that stops it.
 */
export function applyDraft(draft: Draft, options: DraftOptions): ApplyResult {
  return draft.mode === 'absolute' ? applyAbsolute(draft.absolute, options) : applyRelative(draft.relative, options);
}

function parseIsoDateTime(value: string): Date | null {
  const { date, time } = splitIsoDateTime(value);
  const day = parseIsoDate(date);
  const parts = parseTime(time || '00');
  if (!day || !parts) {
    return null;
  }
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), parts.hours, parts.minutes, parts.seconds);
}

/**
 * Writes an absolute range for the trigger, using the locale's own way of joining two dates where
 * the browser provides it, such as "Mar 5 – 10, 2026".
 */
export function formatAbsoluteRange(
  value: DateRangePickerProps.AbsoluteValue,
  locale: string,
  dateOnly: boolean,
  timeInputFormat: DateRangePickerProps.TimeInputFormat
): string {
  const start = parseIsoDateTime(value.startDate);
  const end = parseIsoDateTime(value.endDate);
  if (!start || !end) {
    return `${value.startDate} – ${value.endDate}`;
  }
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  if (!dateOnly) {
    options.hour = 'numeric';
    options.minute = timeInputFormat === 'hh' ? undefined : '2-digit';
    options.second = timeInputFormat === 'hh:mm:ss' ? '2-digit' : undefined;
    options.hourCycle = 'h23';
  }
  const formatter = getDateFormatter(locale, options);
  // Older browsers lack formatRange, so they get the two dates joined with a dash.
  return typeof formatter.formatRange === 'function'
    ? formatter.formatRange(start, end)
    : `${formatter.format(start)} – ${formatter.format(end)}`;
}
