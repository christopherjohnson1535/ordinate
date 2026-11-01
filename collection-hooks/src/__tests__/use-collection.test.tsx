// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { PropertyFilterQuery, SortingColumn, useCollection, UseCollectionOptions } from '../index';

interface Instance {
  id: string;
  zone: string;
  cpu: number;
}

const instances: Instance[] = Array.from({ length: 23 }, (_, index) => ({
  id: `i-${String(index + 1).padStart(2, '0')}`,
  zone: ['north', 'south', 'east'][index % 3],
  cpu: (index * 37) % 100,
}));

const cpuColumn: SortingColumn<Instance> = { sortingField: 'cpu' };

function detail<D>(value: D) {
  return { detail: value };
}

function ids(items: ReadonlyArray<Instance>) {
  return items.map(item => item.id);
}

describe('useCollection', () => {
  test('returns the first page and pagination props', () => {
    const { result } = renderHook(() => useCollection(instances, { pagination: { pageSize: 10 } }));
    expect(ids(result.current.items)).toEqual(ids(instances.slice(0, 10)));
    expect(result.current.paginationProps).toMatchObject({ currentPageIndex: 1, pagesCount: 3 });
    expect(result.current.filteredItemsCount).toBeUndefined();
  });

  test('changes page through the pagination props', () => {
    const { result } = renderHook(() => useCollection(instances, { pagination: { pageSize: 10 } }));
    act(() => result.current.paginationProps.onChange(detail({ currentPageIndex: 3 })));
    expect(ids(result.current.items)).toEqual(['i-21', 'i-22', 'i-23']);
    expect(result.current.paginationProps.currentPageIndex).toBe(3);
  });

  test('filters through the filter props and goes back to page 1', () => {
    const { result } = renderHook(() =>
      useCollection(instances, { filtering: {}, pagination: { pageSize: 3, defaultPage: 2 } })
    );
    expect(result.current.paginationProps.currentPageIndex).toBe(2);
    act(() => result.current.filterProps.onChange(detail({ filteringText: 'north' })));
    expect(result.current.filterProps.filteringText).toBe('north');
    expect(result.current.filteredItemsCount).toBe(8);
    expect(result.current.paginationProps).toMatchObject({ currentPageIndex: 1, pagesCount: 3 });
    expect(result.current.items.every(item => item.zone === 'north')).toBe(true);
  });

  test('sorts through the collection props and goes back to page 1', () => {
    const { result } = renderHook(() =>
      useCollection(instances, { sorting: {}, pagination: { pageSize: 5, defaultPage: 3 } })
    );
    act(() =>
      result.current.collectionProps.onSortingChange!(detail({ sortingColumn: cpuColumn, isDescending: true }))
    );
    expect(result.current.collectionProps.sortingColumn).toBe(cpuColumn);
    expect(result.current.collectionProps.sortingDescending).toBe(true);
    expect(result.current.paginationProps.currentPageIndex).toBe(1);
    const cpus = result.current.items.map(item => item.cpu);
    expect(cpus).toEqual([...cpus].sort((a, b) => b - a));
    expect(cpus[0]).toBe(Math.max(...instances.map(item => item.cpu)));
  });

  test('starts from the default sorting state', () => {
    const { result } = renderHook(() =>
      useCollection(instances, { sorting: { defaultState: { sortingColumn: cpuColumn } } })
    );
    expect(result.current.items[0].cpu).toBe(Math.min(...instances.map(item => item.cpu)));
    expect(result.current.collectionProps.sortingDescending).toBeUndefined();
  });

  test('hands the property filter plain operator names, keeping custom rules in the hook', () => {
    const { result } = renderHook(() =>
      useCollection(instances, {
        propertyFiltering: {
          filteringProperties: [
            {
              key: 'zone',
              propertyLabel: 'Zone',
              operators: ['=', { operator: '^', match: (value, text) => String(value).startsWith(String(text)) }],
            },
          ],
        },
      })
    );
    expect(result.current.propertyFilterProps.filteringProperties).toEqual([
      { key: 'zone', propertyLabel: 'Zone', operators: ['=', '^'] },
    ]);
  });

  test('filters by property and lists the filtering options', () => {
    const options: UseCollectionOptions<Instance> = {
      propertyFiltering: {
        filteringProperties: [
          { key: 'zone', propertyLabel: 'Zone', groupValuesLabel: 'Zones', operators: ['=', '!='] },
          { key: 'cpu', propertyLabel: 'CPU', groupValuesLabel: 'CPU', operators: ['>', '<'] },
        ],
      },
    };
    const { result } = renderHook(() => useCollection(instances, options));
    expect(result.current.propertyFilterProps.filteringProperties).toEqual(
      options.propertyFiltering!.filteringProperties
    );
    expect(
      result.current.propertyFilterProps.filteringOptions
        .filter(option => option.propertyKey === 'zone')
        .map(option => option.value)
    ).toEqual(['north', 'south', 'east']);

    const query: PropertyFilterQuery = {
      operation: 'and',
      tokens: [
        { propertyKey: 'zone', operator: '!=', value: 'east' },
        { propertyKey: 'cpu', operator: '>', value: '50' },
      ],
    };
    act(() => result.current.propertyFilterProps.onChange(detail(query)));
    expect(result.current.propertyFilterProps.query).toBe(query);
    expect(result.current.items.every(item => item.zone !== 'east' && item.cpu > 50)).toBe(true);
    expect(result.current.filteredItemsCount).toBe(result.current.items.length);
  });

  test('accepts a property filter event with the query under detail.query', () => {
    const { result } = renderHook(() =>
      useCollection(instances, {
        propertyFiltering: { filteringProperties: [{ key: 'zone', propertyLabel: 'Zone', groupValuesLabel: '' }] },
      })
    );
    const query: PropertyFilterQuery = {
      operation: 'or',
      tokens: [{ propertyKey: 'zone', operator: '=', value: 'east' }],
    };
    act(() => result.current.propertyFilterProps.onChange(detail({ query })));
    expect(result.current.propertyFilterProps.query).toBe(query);
    expect(result.current.items.every(item => item.zone === 'east')).toBe(true);
  });

  test('selection props hold the selection and trackBy', () => {
    const { result } = renderHook(() =>
      useCollection(instances, { selection: { defaultSelectedItems: [instances[0]], trackBy: 'id' } })
    );
    expect(result.current.collectionProps.selectedItems).toEqual([instances[0]]);
    expect(result.current.collectionProps.trackBy).toBe('id');
    act(() => result.current.collectionProps.onSelectionChange!(detail({ selectedItems: instances.slice(1, 3) })));
    expect(result.current.collectionProps.selectedItems).toEqual(instances.slice(1, 3));
  });

  test('other changes clear the selection unless keepSelection is set', () => {
    const { result } = renderHook(
      ({ keepSelection }) => useCollection(instances, { filtering: {}, pagination: {}, selection: { keepSelection } }),
      { initialProps: { keepSelection: false } }
    );
    act(() => result.current.actions.setSelectedItems([instances[0]]));
    act(() => result.current.actions.setCurrentPage(2));
    expect(result.current.collectionProps.selectedItems).toEqual([]);
  });

  test('keepSelection keeps the selection across filtering and paging', () => {
    const { result } = renderHook(() =>
      useCollection(instances, { filtering: {}, pagination: {}, selection: { keepSelection: true } })
    );
    act(() => result.current.actions.setSelectedItems([instances[0]]));
    act(() => result.current.actions.setFiltering('south'));
    act(() => result.current.actions.setCurrentPage(2));
    expect(result.current.collectionProps.selectedItems).toEqual([instances[0]]);
  });

  test('leaves out sorting and selection props that are not set up', () => {
    const { result } = renderHook(() => useCollection(instances, {}));
    expect(Object.keys(result.current.collectionProps)).toEqual(['empty']);
    expect(result.current.propertyFilterProps).toMatchObject({ filteringProperties: [], filteringOptions: [] });
  });

  test('chooses the empty or no-match content', () => {
    const empty = 'No instances';
    const noMatch = 'No matches';
    const { result, rerender } = renderHook(({ items }) => useCollection(items, { filtering: { empty, noMatch } }), {
      initialProps: { items: [] as Instance[] },
    });
    expect(result.current.collectionProps.empty).toBe(empty);
    rerender({ items: instances });
    act(() => result.current.actions.setFiltering('nothing like this'));
    expect(result.current.items).toEqual([]);
    expect(result.current.collectionProps.empty).toBe(noMatch);
  });

  test('takes the empty content from property filtering when there is no text filtering', () => {
    const { result } = renderHook(() =>
      useCollection([] as Instance[], {
        propertyFiltering: { filteringProperties: [], empty: 'Nothing yet', noMatch: 'No match' },
      })
    );
    expect(result.current.collectionProps.empty).toBe('Nothing yet');
  });

  test('applies a new page size and keeps the page inside the pages that exist', () => {
    const { result, rerender } = renderHook(({ pageSize }) => useCollection(instances, { pagination: { pageSize } }), {
      initialProps: { pageSize: 5 },
    });
    act(() => result.current.actions.setCurrentPage(5));
    expect(ids(result.current.items)).toEqual(['i-21', 'i-22', 'i-23']);
    rerender({ pageSize: 10 });
    expect(result.current.paginationProps).toMatchObject({ currentPageIndex: 3, pagesCount: 3 });
    expect(ids(result.current.items)).toEqual(['i-21', 'i-22', 'i-23']);
  });

  test('follows changes to the items', () => {
    const { result, rerender } = renderHook(({ items }) => useCollection(items, { pagination: { pageSize: 10 } }), {
      initialProps: { items: instances },
    });
    rerender({ items: instances.slice(0, 4) });
    expect(ids(result.current.items)).toEqual(['i-01', 'i-02', 'i-03', 'i-04']);
    expect(result.current.paginationProps.pagesCount).toBe(1);
  });

  test('keeps the same actions between renders', () => {
    const { result, rerender } = renderHook(() => useCollection(instances, {}));
    const actions = result.current.actions;
    rerender();
    expect(result.current.actions).toBe(actions);
  });
});

function InstanceList() {
  const { items, filterProps, paginationProps, filteredItemsCount } = useCollection(instances, {
    filtering: { fields: ['id', 'zone'] },
    pagination: { pageSize: 4 },
  });
  return (
    <div>
      <input
        aria-label="Find instances"
        value={filterProps.filteringText}
        onChange={event => filterProps.onChange(detail({ filteringText: event.target.value }))}
      />
      <p>{filteredItemsCount} matches</p>
      <ul aria-label="Instances">
        {items.map(item => (
          <li key={item.id}>{item.id}</li>
        ))}
      </ul>
      <button
        onClick={() => paginationProps.onChange(detail({ currentPageIndex: paginationProps.currentPageIndex + 1 }))}
      >
        Next page
      </button>
      <span>
        Page {paginationProps.currentPageIndex} of {paginationProps.pagesCount}
      </span>
    </div>
  );
}

describe('useCollection in a component', () => {
  test('drives a filtered, paginated list', () => {
    render(<InstanceList />);
    const list = () => screen.getAllByRole('listitem').map(item => item.textContent);
    expect(list()).toEqual(['i-01', 'i-02', 'i-03', 'i-04']);
    expect(screen.getByText('Page 1 of 6')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(list()).toEqual(['i-05', 'i-06', 'i-07', 'i-08']);

    fireEvent.change(screen.getByRole('textbox', { name: 'Find instances' }), { target: { value: 'east' } });
    expect(screen.getByText('7 matches')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(list()).toEqual(['i-03', 'i-06', 'i-09', 'i-12']);
  });
});
