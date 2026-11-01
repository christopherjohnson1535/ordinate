// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { compareDays, compareMonths } from './arithmetic';
import { DateGranularity } from './iso';

export interface DateConstraints {
  /**
   * The earliest selectable day or month.
   */
  min?: Date | null;
  /**
   * The latest selectable day or month.
   */
  max?: Date | null;
  /**
   * Called for every day or month that is not ruled out by `min` and `max`. Returns `false` to disable it.
   */
  isDateEnabled?: (date: Date) => boolean;
}

/**
 * Whether `date` lies within `min` and `max`, compared by day or by month.
 */
export function isWithinBounds(
  date: Date,
  { min, max }: DateConstraints,
  granularity: DateGranularity = 'day'
): boolean {
  const compare = granularity === 'month' ? compareMonths : compareDays;
  return (!min || compare(date, min) >= 0) && (!max || compare(date, max) <= 0);
}

/**
 * Whether the user may choose `date`: inside the bounds and not ruled out by `isDateEnabled`.
 */
export function isDateSelectable(
  date: Date,
  constraints: DateConstraints,
  granularity: DateGranularity = 'day'
): boolean {
  return isWithinBounds(date, constraints, granularity) && (constraints.isDateEnabled?.(date) ?? true);
}
