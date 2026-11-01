// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartValue } from './scales';
import { TimeInterval } from './ticks';

function locale(): string {
  return (typeof document !== 'undefined' && document.documentElement.lang) || 'en';
}

/**
 * Formats a number for a tooltip or a label, with at most two decimals.
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }
  return new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(value);
}

/**
 * Formats a tick on a numeric axis with as many decimals as the step between ticks needs, and
 * with short suffixes for large values (12K, 3.5M).
 */
export function formatTickNumber(value: number, step: number): string {
  const magnitude = Math.abs(value);
  if (magnitude >= 10_000) {
    return new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  }
  // As many decimals as the step has, so 0.05 steps read 0.10, 0.15 and 0.20.
  const decimals =
    step > 0 && step < 1 ? Math.min(6, (String(Number(step.toPrecision(6))).split('.')[1] ?? '').length) : 0;
  return new Intl.NumberFormat(locale(), { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(
    value
  );
}

/**
 * Formats a tick on a time axis so that it shows what changes at the interval between ticks.
 */
export function formatTimeTick(time: number, interval: TimeInterval | null): string {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = (() => {
    switch (interval?.unit) {
      case 'second':
        return { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' };
      case 'minute':
      case 'hour':
        return { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
      case 'month':
        return { month: 'short', year: 'numeric' };
      case 'year':
        return { year: 'numeric' };
      default:
        return { month: 'short', day: 'numeric' };
    }
  })();
  return new Intl.DateTimeFormat(locale(), options).format(date);
}

/**
 * Formats a full date and time, for the header of a detail popover on a time axis.
 */
export function formatDateTime(time: number): string {
  return new Intl.DateTimeFormat(locale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(time));
}

/**
 * Formats an x value the way it appears when no formatter is given.
 */
export function formatValue(value: ChartValue): string {
  if (value instanceof Date) {
    return formatDateTime(value.getTime());
  }
  return typeof value === 'number' ? formatNumber(value) : value;
}

/**
 * Formats a share of a whole, such as 0.253, as a percentage with up to one decimal.
 */
export function formatPercentage(fraction: number): string {
  return new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: 1 }).format(fraction);
}
