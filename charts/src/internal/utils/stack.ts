// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * The bottom and top of one stacked value.
 */
export type StackedValue = readonly [number, number];

/**
 * Stacks the values of several series, position by position. `values[series][position]` is
 * a number, or `undefined` where the series has no value. Positive values stack upward from
 * zero and negative values downward, so a stack never overlaps itself. A missing value gets
 * no height at the top of its stack.
 */
export function stackValues(values: ReadonlyArray<ReadonlyArray<number | undefined>>): StackedValue[][] {
  const positions = Math.max(0, ...values.map(row => row.length));
  const positive = new Array<number>(positions).fill(0);
  const negative = new Array<number>(positions).fill(0);
  return values.map(row =>
    Array.from({ length: positions }, (_, position): StackedValue => {
      const value = row[position];
      if (value === undefined || !Number.isFinite(value)) {
        return [positive[position], positive[position]];
      }
      const totals = value >= 0 ? positive : negative;
      const bottom = totals[position];
      totals[position] = bottom + value;
      return [bottom, totals[position]];
    })
  );
}

/**
 * The lowest and highest values in a stack, including zero.
 */
export function stackExtent(stacks: ReadonlyArray<ReadonlyArray<StackedValue>>): [number, number] {
  let min = 0;
  let max = 0;
  for (const row of stacks) {
    for (const [bottom, top] of row) {
      min = Math.min(min, bottom, top);
      max = Math.max(max, bottom, top);
    }
  }
  return [min, max];
}
