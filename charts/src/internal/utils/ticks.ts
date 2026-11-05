// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * A step close to `(stop - start) / count` that is 1, 2 or 5 times a power of ten, so tick
 * labels stay round.
 */
export function tickStep(start: number, stop: number, count: number): number {
  const span = Math.abs(stop - start);
  if (span === 0 || !Number.isFinite(span) || count <= 0) {
    return 1;
  }
  const raw = span / count;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const error = raw / power;
  // The thresholds sit halfway between the candidates on a log scale.
  const factor = error >= Math.sqrt(50) ? 10 : error >= Math.sqrt(10) ? 5 : error >= Math.sqrt(2) ? 2 : 1;
  return factor * power;
}

// Removes floating point noise such as 0.30000000000000004 from multiples of `step`.
function roundToStep(value: number, step: number): number {
  const decimals = Math.max(0, -Math.floor(Math.log10(step)) + 1);
  return Number(value.toFixed(Math.min(decimals, 20)));
}

/**
 * Round tick values from `min` to `max`, about `count` of them, all inside the range.
 */
export function linearTicks(min: number, max: number, count: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [];
  }
  if (min === max) {
    return [min];
  }
  const [low, high] = min < max ? [min, max] : [max, min];
  const step = tickStep(low, high, count);
  const first = Math.ceil(low / step);
  const last = Math.floor(high / step);
  const ticks: number[] = [];
  for (let index = first; index <= last; index++) {
    ticks.push(roundToStep(index * step, step));
  }
  return ticks;
}

/**
 * Extends a domain outward to round values, so the first and last ticks sit on its ends.
 * A domain of one value is widened around it.
 */
export function niceDomain(domain: readonly [number, number], count: number): [number, number] {
  let [min, max] = domain;
  if (min === max) {
    const pad = min === 0 ? 1 : Math.abs(min) * 0.1;
    min -= pad;
    max += pad;
  }
  // Rounding out widens the domain, which can make the tick step coarser; repeat until the ends
  // sit on the same ticks `linearTicks` will produce for the result.
  for (let pass = 0; pass < 4; pass++) {
    const step = tickStep(min, max, count);
    const next: [number, number] = [
      roundToStep(Math.floor(min / step) * step, step),
      roundToStep(Math.ceil(max / step) * step, step),
    ];
    if (next[0] === min && next[1] === max) {
      break;
    }
    [min, max] = next;
  }
  return [min, max];
}

/**
 * Extends a positive domain to whole powers of ten.
 */
export function niceLogDomain(domain: readonly [number, number]): [number, number] {
  const [min, max] = domain;
  const low = Math.pow(10, Math.floor(Math.log10(min)));
  const high = Math.pow(10, Math.ceil(Math.log10(max)));
  return low === high ? [low, high * 10] : [low, high];
}

function powerTicks(low: number, high: number, multiples: readonly number[], every: number): number[] {
  const first = Math.floor(Math.log10(low));
  const last = Math.ceil(Math.log10(high));
  const ticks: number[] = [];
  for (let exponent = first; exponent <= last; exponent++) {
    if ((exponent - first) % every !== 0) {
      continue;
    }
    for (const multiple of multiples) {
      const value = Number((multiple * Math.pow(10, exponent)).toPrecision(12));
      if (value >= low * (1 - 1e-12) && value <= high * (1 + 1e-12)) {
        ticks.push(value);
      }
    }
  }
  return ticks;
}

/**
 * Ticks for a logarithmic axis, at most `count` of them where possible: 1, 2 and 5 times each
 * power of ten when they fit, else the powers of ten, else every second or third power. A domain
 * too narrow to hold two of those gets evenly spaced ticks.
 */
export function logTicks(min: number, max: number, count: number): number[] {
  if (!(min > 0) || !(max > 0)) {
    return [];
  }
  const [low, high] = min < max ? [min, max] : [max, min];
  const limit = Math.max(count, 2);
  // Only the ticks inside the domain count, so a domain that starts or ends between powers of
  // ten, such as 1,024 to 1,048,576, still gets the 2 and 5 multiples when they fit.
  const ticks = powerTicks(low, high, [1, 2, 5], 1);
  if (ticks.length < 2) {
    return linearTicks(low, high, limit);
  }
  if (ticks.length <= limit) {
    return ticks;
  }
  for (let every = 1; ; every++) {
    const powers = powerTicks(low, high, [1], every);
    if (powers.length <= limit || every > 308) {
      return powers;
    }
  }
}

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimeInterval {
  unit: TimeUnit;
  step: number;
}

const unitLength: Record<TimeUnit, number> = {
  second: 1000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30 * 86_400_000,
  year: 365 * 86_400_000,
};

const intervals: TimeInterval[] = [
  { unit: 'second', step: 1 },
  { unit: 'second', step: 5 },
  { unit: 'second', step: 15 },
  { unit: 'second', step: 30 },
  { unit: 'minute', step: 1 },
  { unit: 'minute', step: 5 },
  { unit: 'minute', step: 15 },
  { unit: 'minute', step: 30 },
  { unit: 'hour', step: 1 },
  { unit: 'hour', step: 3 },
  { unit: 'hour', step: 6 },
  { unit: 'hour', step: 12 },
  { unit: 'day', step: 1 },
  { unit: 'day', step: 2 },
  { unit: 'week', step: 1 },
  { unit: 'month', step: 1 },
  { unit: 'month', step: 3 },
  { unit: 'year', step: 1 },
];

/**
 * The calendar interval that gives about `count` ticks between `min` and `max`, in milliseconds.
 */
export function chooseTimeInterval(min: number, max: number, count: number): TimeInterval {
  const span = Math.abs(max - min);
  const found = intervals.find(interval => span / (unitLength[interval.unit] * interval.step) <= count);
  if (found) {
    return found;
  }
  return { unit: 'year', step: Math.max(1, tickStep(0, span / unitLength.year, count)) };
}

// The first boundary of `interval` at or after `time`, in local time.
function ceilToInterval(time: number, { unit, step }: TimeInterval): Date {
  const date = new Date(time);
  switch (unit) {
    case 'second':
    case 'minute':
    case 'hour': {
      // Aligning to the local day keeps hours like 00, 06, 12, 18 across time zones with odd offsets.
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const size = unitLength[unit] * step;
      return new Date(dayStart + Math.ceil((time - dayStart) / size) * size);
    }
    case 'day': {
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (day.getTime() < time) {
        day.setDate(day.getDate() + 1);
      }
      return day;
    }
    case 'week': {
      // Weeks start on Monday.
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (day.getTime() < time) {
        day.setDate(day.getDate() + 1);
      }
      day.setDate(day.getDate() + ((8 - day.getDay()) % 7));
      return day;
    }
    case 'month': {
      const month = new Date(date.getFullYear(), date.getMonth(), 1);
      if (month.getTime() < time) {
        month.setMonth(month.getMonth() + 1);
      }
      while (month.getMonth() % step !== 0) {
        month.setMonth(month.getMonth() + 1);
      }
      return month;
    }
    case 'year': {
      const year = new Date(date.getFullYear(), 0, 1);
      if (year.getTime() < time) {
        year.setFullYear(year.getFullYear() + 1);
      }
      while (year.getFullYear() % step !== 0) {
        year.setFullYear(year.getFullYear() + 1);
      }
      return year;
    }
  }
}

function advance(date: Date, { unit, step }: TimeInterval): Date {
  const next = new Date(date.getTime());
  switch (unit) {
    case 'day':
      next.setDate(next.getDate() + step);
      return next;
    case 'week':
      next.setDate(next.getDate() + 7 * step);
      return next;
    case 'month':
      next.setMonth(next.getMonth() + step);
      return next;
    case 'year':
      next.setFullYear(next.getFullYear() + step);
      return next;
    default:
      return new Date(date.getTime() + unitLength[unit] * step);
  }
}

/**
 * Ticks on calendar boundaries between `min` and `max` (milliseconds since the epoch), about
 * `count` of them, with the interval that produced them so labels can be formatted to match.
 */
export function timeTicks(min: number, max: number, count: number): { ticks: number[]; interval: TimeInterval } {
  const [low, high] = min < max ? [min, max] : [max, min];
  const interval = chooseTimeInterval(low, high, count);
  const ticks: number[] = [];
  if (!Number.isFinite(low) || !Number.isFinite(high)) {
    return { ticks, interval };
  }
  for (let date = ceilToInterval(low, interval); date.getTime() <= high && ticks.length < 1000;) {
    ticks.push(date.getTime());
    date = advance(date, interval);
  }
  return { ticks, interval };
}
