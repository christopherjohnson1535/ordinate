// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { compareValues, sortItems } from '../operations/sort';

interface Node {
  name: string;
  cpu?: number | null;
  created?: Date;
}

const items: Node[] = [
  { name: 'node 10', cpu: 42, created: new Date('2026-03-01') },
  { name: 'node 2', cpu: null, created: new Date('2026-01-01') },
  { name: 'Node 1', cpu: 88 },
  { name: 'node 3', cpu: 7, created: new Date('2026-02-01') },
];

const names = (list: ReadonlyArray<Node>) => list.map(item => item.name);

describe('compareValues', () => {
  test('orders strings naturally', () => {
    expect(compareValues('node 2', 'node 10')).toBeLessThan(0);
    expect(compareValues('b', 'a')).toBeGreaterThan(0);
    expect(compareValues('a', 'a')).toBe(0);
  });

  test('orders numbers and dates', () => {
    expect(compareValues(2, 10)).toBe(-1);
    expect(compareValues(10, 2)).toBe(1);
    expect(compareValues(3, 3)).toBe(0);
    expect(compareValues(new Date('2026-01-01'), new Date('2026-02-01'))).toBeLessThan(0);
  });
});

describe('sortItems', () => {
  test('sorts by the sorting field, ascending and descending', () => {
    expect(names(sortItems(items, { sortingColumn: { sortingField: 'name' } }))).toEqual([
      'Node 1',
      'node 2',
      'node 3',
      'node 10',
    ]);
    expect(names(sortItems(items, { sortingColumn: { sortingField: 'name' }, isDescending: true }))).toEqual([
      'node 10',
      'node 3',
      'node 2',
      'Node 1',
    ]);
  });

  test('keeps items without a value at the end in both directions', () => {
    expect(names(sortItems(items, { sortingColumn: { sortingField: 'cpu' } }))).toEqual([
      'node 3',
      'node 10',
      'Node 1',
      'node 2',
    ]);
    expect(names(sortItems(items, { sortingColumn: { sortingField: 'cpu' }, isDescending: true }))).toEqual([
      'Node 1',
      'node 10',
      'node 3',
      'node 2',
    ]);
    expect(names(sortItems(items, { sortingColumn: { sortingField: 'created' } }))).toEqual([
      'node 2',
      'node 3',
      'node 10',
      'Node 1',
    ]);
  });

  test('a comparator wins over the sorting field', () => {
    const byLength = (a: Node, b: Node) => a.name.length - b.name.length;
    const sorted = sortItems(items, { sortingColumn: { sortingField: 'cpu', sortingComparator: byLength } });
    expect(names(sorted)).toEqual(['node 2', 'Node 1', 'node 3', 'node 10']);
    const descending = sortItems(items, { sortingColumn: { sortingComparator: byLength }, isDescending: true });
    expect(names(descending)[0]).toBe('node 10');
  });

  test('returns the items unchanged without a sortable column', () => {
    expect(sortItems(items, undefined)).toBe(items);
    expect(sortItems(items, { sortingColumn: {} })).toBe(items);
  });

  test('does not change the input', () => {
    const copy = items.slice();
    sortItems(items, { sortingColumn: { sortingField: 'name' } });
    expect(items).toEqual(copy);
  });

  test('keeps the original order of equal items', () => {
    const equal = [
      { name: 'a', cpu: 1 },
      { name: 'b', cpu: 1 },
      { name: 'c', cpu: 1 },
    ];
    expect(names(sortItems(equal, { sortingColumn: { sortingField: 'cpu' }, isDescending: true }))).toEqual([
      'a',
      'b',
      'c',
    ]);
  });
});
