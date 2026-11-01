// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { linearTicks, logTicks, TimeInterval, timeTicks } from './ticks';

export type ScaleType = 'linear' | 'log' | 'time' | 'categorical';

/**
 * A value on an axis: a number, a date, or a category name.
 */
export type ChartValue = number | string | Date;

export type ContinuousScaleType = Exclude<ScaleType, 'categorical'>;

export interface ContinuousScale {
  type: ContinuousScaleType;
  domain: [number, number];
  range: [number, number];
  /**
   * The pixel position of a value. Values a log scale cannot show map to `NaN`.
   */
  map(value: ChartValue): number;
  /**
   * The value at a pixel position.
   */
  invert(position: number): number;
  ticks(count: number): number[];
  /**
   * The calendar interval of the last `ticks` call on a time scale, for formatting labels.
   */
  tickInterval(count: number): TimeInterval | null;
}

export interface BandScale {
  type: 'categorical';
  domain: ChartValue[];
  range: [number, number];
  /**
   * The width of one band, without the padding between bands.
   */
  bandwidth: number;
  /**
   * The distance between the centers of neighboring bands.
   */
  step: number;
  /**
   * The center of the value's band, or `NaN` when the value is not in the domain.
   */
  map(value: ChartValue): number;
  indexOf(value: ChartValue): number;
}

export type Scale = ContinuousScale | BandScale;

export function toNumber(value: ChartValue): number {
  if (value instanceof Date) {
    return value.getTime();
  }
  return typeof value === 'number' ? value : Number.NaN;
}

/**
 * A key that tells values apart and matches equal dates, for looking values up in maps.
 */
export function valueKey(value: ChartValue): string {
  if (value instanceof Date) {
    return `d${value.getTime()}`;
  }
  return typeof value === 'number' ? `n${value}` : `s${value}`;
}

export function createContinuousScale(
  type: ContinuousScaleType,
  domain: readonly [number, number],
  range: readonly [number, number]
): ContinuousScale {
  const log = type === 'log';
  const transform = (value: number) => (log ? (value > 0 ? Math.log10(value) : Number.NaN) : value);
  const [d0, d1] = [transform(domain[0]), transform(domain[1])];
  const [r0, r1] = range;
  const span = d1 - d0;

  const map = (value: ChartValue) => {
    const transformed = transform(toNumber(value));
    // A domain of a single value puts everything in the middle of the range.
    return span === 0 ? (r0 + r1) / 2 : r0 + ((transformed - d0) / span) * (r1 - r0);
  };
  const invert = (position: number) => {
    const transformed = r1 === r0 ? d0 : d0 + ((position - r0) / (r1 - r0)) * span;
    return log ? Math.pow(10, transformed) : transformed;
  };
  const ticks = (count: number) => {
    if (type === 'log') {
      return logTicks(domain[0], domain[1], count);
    }
    if (type === 'time') {
      return timeTicks(domain[0], domain[1], count).ticks;
    }
    return linearTicks(domain[0], domain[1], count);
  };
  const tickInterval = (count: number) => (type === 'time' ? timeTicks(domain[0], domain[1], count).interval : null);

  return { type, domain: [domain[0], domain[1]], range: [r0, r1], map, invert, ticks, tickInterval };
}

export interface BandOptions {
  /**
   * The share of each step left empty between bands, from 0 to 1.
   */
  paddingInner?: number;
  /**
   * Space before the first and after the last band, as a share of one step.
   */
  paddingOuter?: number;
}

/**
 * Splits the range into one band per category. The range may run backward, as it does on a
 * vertical axis or in right-to-left layout; bands then run backward too.
 */
export function createBandScale(
  domain: ReadonlyArray<ChartValue>,
  range: readonly [number, number],
  { paddingInner = 0, paddingOuter = 0 }: BandOptions = {}
): BandScale {
  const [r0, r1] = range;
  const length = Math.abs(r1 - r0);
  const direction = r1 >= r0 ? 1 : -1;
  const count = domain.length;
  const step = count === 0 ? 0 : length / Math.max(1, count - paddingInner + 2 * paddingOuter);
  const bandwidth = step * (1 - paddingInner);
  const indexes = new Map(domain.map((value, index) => [valueKey(value), index]));
  const indexOf = (value: ChartValue) => indexes.get(valueKey(value)) ?? -1;
  const map = (value: ChartValue) => {
    const index = indexOf(value);
    if (index < 0) {
      return Number.NaN;
    }
    const start = step * paddingOuter + index * step;
    return r0 + direction * (start + bandwidth / 2);
  };
  return { type: 'categorical', domain: [...domain], range: [r0, r1], bandwidth, step, map, indexOf };
}
