// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { processItems } from '../operations';
import { CollectionState, createInitialState } from '../state';

interface Item {
  id: number;
  zone: string;
}

const items: Item[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  zone: index % 2 === 0 ? 'east' : 'west',
}));

function state(changes: Partial<CollectionState<Item>> = {}): CollectionState<Item> {
  return { ...createInitialState<Item>({}), ...changes };
}

describe('processItems', () => {
  test('returns every item without options', () => {
    expect(processItems(items, state(), {})).toEqual({
      items,
      filteredItemsCount: undefined,
      pagesCount: 1,
      currentPageIndex: 1,
    });
  });

  test('filters by text and counts the matches', () => {
    const result = processItems(items, state({ filteringText: 'west' }), { filtering: {} });
    expect(result.filteredItemsCount).toBe(12);
    expect(result.items.every(item => item.zone === 'west')).toBe(true);
  });

  test('applies the property filter after the text filter', () => {
    const result = processItems(
      items,
      state({
        filteringText: 'east',
        propertyFilteringQuery: { operation: 'and', tokens: [{ propertyKey: 'id', operator: '>', value: '20' }] },
      }),
      {
        filtering: {},
        propertyFiltering: {
          filteringProperties: [{ key: 'id', propertyLabel: 'ID', groupValuesLabel: 'IDs', operators: ['>'] }],
        },
      }
    );
    expect(result.items.map(item => item.id)).toEqual([21, 23, 25]);
    expect(result.filteredItemsCount).toBe(3);
  });

  test('sorts before cutting the page', () => {
    const result = processItems(
      items,
      state({ sortingState: { sortingColumn: { sortingField: 'id' }, isDescending: true } }),
      { sorting: {}, pagination: { pageSize: 5 } }
    );
    expect(result.items.map(item => item.id)).toEqual([25, 24, 23, 22, 21]);
    expect(result.pagesCount).toBe(5);
  });

  test('uses ten items per page by default', () => {
    const result = processItems(items, state({ currentPageIndex: 3 }), { pagination: {} });
    expect(result.items.map(item => item.id)).toEqual([21, 22, 23, 24, 25]);
    expect(result.pagesCount).toBe(3);
  });

  test('moves to the last page when the current page no longer exists', () => {
    const result = processItems(items, state({ currentPageIndex: 9, filteringText: 'east' }), {
      filtering: {},
      pagination: { pageSize: 5 },
    });
    expect(result.currentPageIndex).toBe(3);
    expect(result.items.map(item => item.id)).toEqual([21, 23, 25]);
  });

  test('ignores filter state for filters that are not set up', () => {
    const result = processItems(items, state({ filteringText: 'west' }), {});
    expect(result.items).toHaveLength(25);
  });
});
