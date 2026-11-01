// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { UseCollectionOptions } from '../interfaces';
import { getField, isPrimitive, toSearchText } from './values';

/**
 * Matches an item when any of `fields`, or any of its own primitive properties, contains the text.
 * Case is ignored, and surrounding spaces in the text are too.
 */
export function defaultFilteringFunction<T>(item: T, filteringText: string, fields?: ReadonlyArray<string>): boolean {
  const text = filteringText.trim().toLowerCase();
  if (!text) {
    return true;
  }
  const keys = fields ?? (item !== null && typeof item === 'object' ? Object.keys(item) : []);
  return keys.some(key => {
    const value = getField(item, key);
    return isPrimitive(value) && toSearchText(value).includes(text);
  });
}

export function filterByText<T>(
  items: ReadonlyArray<T>,
  filteringText: string,
  { filteringFunction = defaultFilteringFunction, fields }: NonNullable<UseCollectionOptions<T>['filtering']>
): ReadonlyArray<T> {
  return items.filter(item => filteringFunction(item, filteringText, fields));
}
