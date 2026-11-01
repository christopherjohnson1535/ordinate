// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { collectionReducer, CollectionState, createInitialState, emptyQuery } from '../state';

interface Item {
  id: string;
}

const selected: Item[] = [{ id: 'a' }];
const query = { tokens: [{ propertyKey: 'id', operator: '=' as const, value: 'a' }], operation: 'and' as const };
const sortingState = { sortingColumn: { sortingField: 'id' }, isDescending: true };

function stateOnPage3(): CollectionState<Item> {
  return { ...createInitialState<Item>({}), currentPageIndex: 3, selectedItems: selected };
}

describe('createInitialState', () => {
  test('starts empty without options', () => {
    expect(createInitialState({})).toEqual({
      filteringText: '',
      propertyFilteringQuery: emptyQuery,
      sortingState: undefined,
      currentPageIndex: 1,
      selectedItems: [],
    });
  });

  test('reads the defaults from the options', () => {
    expect(
      createInitialState<Item>({
        filtering: { defaultFilteringText: 'node' },
        propertyFiltering: { filteringProperties: [], defaultQuery: query },
        sorting: { defaultState: sortingState },
        pagination: { defaultPage: 4 },
        selection: { defaultSelectedItems: selected },
      })
    ).toEqual({
      filteringText: 'node',
      propertyFilteringQuery: query,
      sortingState,
      currentPageIndex: 4,
      selectedItems: selected,
    });
  });
});

describe('collectionReducer', () => {
  test.each([
    ['filtering', { type: 'filtering' as const, filteringText: 'x' }, { filteringText: 'x' }],
    ['property filtering', { type: 'property-filtering' as const, query }, { propertyFilteringQuery: query }],
    ['sorting', { type: 'sorting' as const, sortingState }, { sortingState }],
  ])('%s goes back to page 1', (_, change, expected) => {
    const next = collectionReducer(stateOnPage3(), { ...change, keepSelection: true });
    expect(next).toMatchObject({ ...expected, currentPageIndex: 1, selectedItems: selected });
  });

  test('pagination changes the page', () => {
    const next = collectionReducer(stateOnPage3(), { type: 'pagination', pageIndex: 5, keepSelection: true });
    expect(next.currentPageIndex).toBe(5);
  });

  test('selection keeps the page', () => {
    const next = collectionReducer(stateOnPage3(), { type: 'selection', selectedItems: [], keepSelection: false });
    expect(next).toMatchObject({ currentPageIndex: 3, selectedItems: [] });
  });

  test.each([
    { type: 'filtering' as const, filteringText: 'x' },
    { type: 'property-filtering' as const, query },
    { type: 'sorting' as const, sortingState },
    { type: 'pagination' as const, pageIndex: 2 },
  ])('$type clears the selection unless it is kept', change => {
    expect(collectionReducer(stateOnPage3(), { ...change, keepSelection: false }).selectedItems).toEqual([]);
    expect(collectionReducer(stateOnPage3(), { ...change, keepSelection: true }).selectedItems).toBe(selected);
  });

  test('does not change the previous state', () => {
    const state = stateOnPage3();
    collectionReducer(state, { type: 'filtering', filteringText: 'x', keepSelection: false });
    expect(state).toEqual(stateOnPage3());
  });
});
