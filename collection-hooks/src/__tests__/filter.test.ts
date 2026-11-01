// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test, vi } from 'vitest';

import { defaultFilteringFunction, filterByText } from '../operations/filter';

const items = [
  { id: 'na-01', zone: 'us-mountain-1a', cpu: 42, healthy: true, tags: { team: 'core' } },
  { id: 'na-02', zone: 'us-coast-2b', cpu: 7, healthy: false, tags: { team: 'edge' } },
  { id: 'eu-01', zone: 'eu-north-1a', cpu: 88, healthy: true, tags: { team: 'core' } },
];

describe('defaultFilteringFunction', () => {
  test('matches any primitive property, ignoring case', () => {
    expect(defaultFilteringFunction(items[0], 'MOUNTAIN')).toBe(true);
    expect(defaultFilteringFunction(items[0], '42')).toBe(true);
    expect(defaultFilteringFunction(items[1], 'false')).toBe(true);
    expect(defaultFilteringFunction(items[0], 'coast')).toBe(false);
  });

  test('empty or blank text matches everything', () => {
    expect(defaultFilteringFunction(items[0], '')).toBe(true);
    expect(defaultFilteringFunction(items[0], '   ')).toBe(true);
  });

  test('ignores spaces around the text', () => {
    expect(defaultFilteringFunction(items[0], '  na-01 ')).toBe(true);
  });

  test('never matches nested objects as text', () => {
    expect(defaultFilteringFunction(items[0], 'object')).toBe(false);
    expect(defaultFilteringFunction(items[0], 'core')).toBe(false);
  });

  test('searches only the given fields', () => {
    expect(defaultFilteringFunction(items[0], 'na-01', ['zone'])).toBe(false);
    expect(defaultFilteringFunction(items[0], 'mountain', ['zone'])).toBe(true);
  });

  test('matches nothing for items that are not objects', () => {
    expect(defaultFilteringFunction('na-01', 'na')).toBe(false);
    expect(defaultFilteringFunction(null, 'na')).toBe(false);
  });
});

describe('filterByText', () => {
  test('keeps the matching items in order', () => {
    expect(filterByText(items, '-01', {}).map(item => item.id)).toEqual(['na-01', 'eu-01']);
  });

  test('passes the item, text and fields to a custom function', () => {
    const filteringFunction = vi.fn((item: (typeof items)[number]) => item.cpu > 40);
    const result = filterByText(items, 'busy', { filteringFunction, fields: ['cpu'] });
    expect(result.map(item => item.id)).toEqual(['na-01', 'eu-01']);
    expect(filteringFunction).toHaveBeenCalledWith(items[0], 'busy', ['cpu']);
  });
});
