// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface Tick {
  /**
   * Distance from the start of the ruler, from 0 to 100.
   */
  position: number;
  major: boolean;
}

// About ten numbered divisions read well at the widths a measure is shown at.
const targetMajorCount = 10;
// Beyond this many marks the minor ticks run together, so each division is halved instead.
const maxTickCount = 50;

function niceStep(max: number): number {
  const rough = max / targetMajorCount;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map(factor => factor * magnitude).find(candidate => candidate >= rough);
  return step ?? 10 * magnitude;
}

/**
 * The tick marks of a ruler from zero to `max`: major ticks at round numbers, minor ticks between.
 */
export function getTicks(max: number): Tick[] {
  if (!(max > 0) || !Number.isFinite(max)) {
    return [];
  }
  const step = niceStep(max);
  const divisions = (max / step) * 5 <= maxTickCount ? 5 : 2;
  const minorStep = step / divisions;
  const ticks: Tick[] = [];
  for (let index = 0; index * minorStep <= max * (1 + 1e-9); index++) {
    ticks.push({ position: Math.min(100, ((index * minorStep) / max) * 100), major: index % divisions === 0 });
  }
  return ticks;
}

/**
 * Where a value falls on a ruler from zero to `max`, from 0 to 100.
 */
export function toPosition(value: number, max: number): number {
  if (!(max > 0) || !Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, (value / max) * 100));
}
