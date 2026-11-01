// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import {
  chooseTimeInterval,
  linearTicks,
  logTicks,
  niceDomain,
  niceLogDomain,
  tickStep,
  timeTicks,
} from '../../../../lib/charts/internal/utils/ticks';

describe('tickStep', () => {
  test('picks 1, 2 or 5 times a power of ten', () => {
    expect(tickStep(0, 10, 10)).toBe(1);
    expect(tickStep(0, 100, 5)).toBe(20);
    expect(tickStep(0, 1, 4)).toBe(0.2);
    expect(tickStep(0, 1400, 4)).toBe(500);
    expect(tickStep(0, 7, 2)).toBe(5);
  });

  test('falls back to 1 for an empty or invalid span', () => {
    expect(tickStep(5, 5, 4)).toBe(1);
    expect(tickStep(0, Infinity, 4)).toBe(1);
  });
});

describe('linearTicks', () => {
  test('returns round values inside the range', () => {
    expect(linearTicks(0, 100, 5)).toEqual([0, 20, 40, 60, 80, 100]);
    expect(linearTicks(3, 97, 5)).toEqual([20, 40, 60, 80]);
    expect(linearTicks(-12, 12, 4)).toEqual([-10, -5, 0, 5, 10]);
  });

  test('keeps decimals free of floating point noise', () => {
    expect(linearTicks(0, 1, 10)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
  });

  test('handles reversed, single-value and invalid ranges', () => {
    expect(linearTicks(10, 0, 2)).toEqual([0, 5, 10]);
    expect(linearTicks(4, 4, 5)).toEqual([4]);
    expect(linearTicks(Number.NaN, 4, 5)).toEqual([]);
  });
});

describe('niceDomain', () => {
  test('rounds the ends out to ticks', () => {
    expect(niceDomain([3, 97], 5)).toEqual([0, 100]);
    expect(niceDomain([-7, 13], 4)).toEqual([-10, 15]);
  });

  test('ends on the ticks linearTicks gives for the result', () => {
    const domain = niceDomain([196, 1220], 4);
    const ticks = linearTicks(domain[0], domain[1], 4);
    expect(ticks[0]).toBe(domain[0]);
    expect(ticks[ticks.length - 1]).toBe(domain[1]);
  });

  test('widens a single value', () => {
    expect(niceDomain([0, 0], 4)).toEqual([-1, 1]);
    const [low, high] = niceDomain([50, 50], 4);
    expect(low).toBeLessThan(50);
    expect(high).toBeGreaterThan(50);
  });
});

describe('log ticks', () => {
  test('niceLogDomain extends to whole powers of ten', () => {
    expect(niceLogDomain([3, 420])).toEqual([1, 1000]);
    expect(niceLogDomain([10, 10])).toEqual([10, 100]);
  });

  test('uses powers of ten across many decades', () => {
    expect(logTicks(1, 10000, 10)).toEqual([1, 10, 100, 1000, 10000]);
  });

  test('adds 2 and 5 multiples across few decades', () => {
    expect(logTicks(1, 100, 10)).toEqual([1, 2, 5, 10, 20, 50, 100]);
  });

  test('skips decades when there are too many for the space', () => {
    expect(logTicks(1, 1e8, 3)).toEqual([1, 1000, 1e6]);
  });

  test('returns nothing for non-positive domains', () => {
    expect(logTicks(0, 100, 5)).toEqual([]);
  });
});

describe('time ticks', () => {
  const hour = 3_600_000;

  test('chooses an interval for the span', () => {
    expect(chooseTimeInterval(0, 24 * hour, 5)).toEqual({ unit: 'hour', step: 6 });
    expect(chooseTimeInterval(0, 10 * 60_000, 5)).toEqual({ unit: 'minute', step: 5 });
    expect(chooseTimeInterval(0, 300 * 86_400_000, 4)).toEqual({ unit: 'month', step: 3 });
    expect(chooseTimeInterval(0, 40 * 365 * 86_400_000, 4).unit).toBe('year');
  });

  test('puts hour ticks on local hour boundaries', () => {
    const start = new Date(2026, 9, 30, 0, 20).getTime();
    const { ticks, interval } = timeTicks(start, start + 24 * hour, 5);
    expect(interval).toEqual({ unit: 'hour', step: 6 });
    expect(ticks.map(tick => new Date(tick).getHours())).toEqual([6, 12, 18, 0]);
    ticks.forEach(tick => expect(new Date(tick).getMinutes()).toBe(0));
  });

  test('puts month ticks on the first of the month', () => {
    const { ticks } = timeTicks(new Date(2026, 0, 15).getTime(), new Date(2026, 5, 15).getTime(), 6);
    expect(ticks.map(tick => new Date(tick).getDate())).toEqual([1, 1, 1, 1, 1]);
    expect(ticks.map(tick => new Date(tick).getMonth())).toEqual([1, 2, 3, 4, 5]);
  });

  test('puts week ticks on Mondays', () => {
    const { ticks, interval } = timeTicks(new Date(2026, 9, 1).getTime(), new Date(2026, 10, 1).getTime(), 5);
    expect(interval.unit).toBe('week');
    ticks.forEach(tick => expect(new Date(tick).getDay()).toBe(1));
  });
});
