// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SortingColumn, SortingState } from '../interfaces';
import { getField } from './values';

function isMissing(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Orders two field values ascending. Strings compare in natural order, so "item 2" comes before "item 10".
 */
export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, { numeric: true });
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  if ((a as number) < (b as number)) {
    return -1;
  }
  return (a as number) > (b as number) ? 1 : 0;
}

/**
 * Sorts a copy of the items. A column's own comparator wins over its sorting field. Items with no value
 * in the sorting field stay at the end in both directions, so the data comes first.
 */
export function sortItems<T>(items: ReadonlyArray<T>, state: SortingState<T> | undefined): ReadonlyArray<T> {
  const column: SortingColumn<T> = state?.sortingColumn ?? {};
  const { sortingComparator, sortingField } = column;
  const direction = state?.isDescending ? -1 : 1;
  if (sortingComparator) {
    return items.slice().sort((a, b) => sortingComparator(a, b) * direction);
  }
  if (!sortingField) {
    return items;
  }
  return items.slice().sort((a, b) => {
    const first = getField(a, sortingField);
    const second = getField(b, sortingField);
    if (isMissing(first) || isMissing(second)) {
      return Number(isMissing(first)) - Number(isMissing(second));
    }
    return compareValues(first, second) * direction;
  });
}
