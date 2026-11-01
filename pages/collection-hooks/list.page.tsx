// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { FilteringProperty, PropertyFilterQuery, SortingColumn, useCollection } from '~collection-hooks';
import Checkbox from '~components/checkbox';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Input from '~components/input';
import Pagination from '~components/pagination';
import SegmentedControl from '~components/segmented-control';

import styles from './styles.module.scss';

interface Instance {
  id: string;
  name: string;
  zone: string;
  status: 'running' | 'stopped' | 'pending';
  cpu: number;
}

const zones = ['north-1a', 'north-1b', 'south-2a', 'east-3c'];
const statuses: Instance['status'][] = ['running', 'running', 'stopped', 'pending', 'running'];
const names = ['annex', 'archive', 'beacon', 'cistern', 'depot', 'foundry', 'gantry', 'harbor', 'kiln', 'lantern'];

const instances: Instance[] = Array.from({ length: 57 }, (_, index) => ({
  id: `i-${(0x3a00 + index * 97).toString(16)}`,
  name: `${names[index % names.length]}-${String(Math.floor(index / names.length) + 1).padStart(2, '0')}`,
  zone: zones[(index * 7) % zones.length],
  status: statuses[index % statuses.length],
  cpu: (index * 37 + 11) % 100,
}));

const columns: Record<'name' | 'zone' | 'cpu', SortingColumn<Instance>> = {
  name: { sortingField: 'name' },
  zone: { sortingField: 'zone' },
  cpu: { sortingComparator: (a, b) => a.cpu - b.cpu },
};

const filteringProperties: FilteringProperty[] = [
  { key: 'status', propertyLabel: 'Status', groupValuesLabel: 'Statuses', operators: ['=', '!='] },
  { key: 'zone', propertyLabel: 'Zone', groupValuesLabel: 'Zones', operators: ['=', '^'] },
  { key: 'cpu', propertyLabel: 'CPU', groupValuesLabel: 'CPU values', operators: ['>', '<'] },
];

const queries: Record<string, PropertyFilterQuery> = {
  all: { operation: 'and', tokens: [] },
  'running-north': {
    operation: 'and',
    tokens: [
      { propertyKey: 'status', operator: '=', value: 'running' },
      { propertyKey: 'zone', operator: '^', value: 'north' },
    ],
  },
  'busy-or-stopped': {
    operation: 'or',
    tokens: [
      { propertyKey: 'cpu', operator: '>', value: '80' },
      { propertyKey: 'status', operator: '=', value: 'stopped' },
    ],
  },
};

const pageSizePreference: CollectionPreferencesProps.PageSizePreference = {
  options: [
    { value: 5, label: '5 instances' },
    { value: 10, label: '10 instances' },
    { value: 20, label: '20 instances' },
  ],
};

export default function CollectionHooksList() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({ pageSize: 10 });
  const [queryId, setQueryId] = useState('all');
  const { items, filteredItemsCount, actions, collectionProps, filterProps, propertyFilterProps, paginationProps } =
    useCollection(instances, {
      filtering: { fields: ['id', 'name', 'zone'], noMatch: 'No instances match the filters.' },
      propertyFiltering: { filteringProperties },
      sorting: { defaultState: { sortingColumn: columns.name } },
      pagination: { pageSize: preferences.pageSize },
      selection: { trackBy: 'id', keepSelection: true },
    });

  const sortingKey = (Object.keys(columns) as (keyof typeof columns)[]).find(
    key => columns[key] === collectionProps.sortingColumn
  );
  const selected = new Set(collectionProps.selectedItems ?? []);
  const toggleSelected = (item: Instance, checked: boolean) =>
    actions.setSelectedItems(
      checked ? [...selected, item] : (collectionProps.selectedItems ?? []).filter(other => other !== item)
    );

  return (
    <article className={styles.page}>
      <h1>Collection hooks</h1>
      <p className={styles.lede}>
        One <code>useCollection</code> call drives the text filter, the preset property filters, sorting, selection and
        pagination below. The page size comes from the collection preferences.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.filter}>
          <Input
            type="search"
            placeholder="Find by name, ID or zone"
            ariaLabel="Find instances"
            value={filterProps.filteringText}
            onChange={event => filterProps.onChange({ detail: { filteringText: event.detail.value } })}
          />
        </div>
        <SegmentedControl
          label="Property filter"
          selectedId={queryId}
          options={[
            { id: 'all', text: 'All' },
            { id: 'running-north', text: 'Running in north' },
            { id: 'busy-or-stopped', text: 'CPU > 80 or stopped' },
          ]}
          onChange={event => {
            setQueryId(event.detail.selectedId);
            propertyFilterProps.onChange({ detail: queries[event.detail.selectedId] });
          }}
        />
        <CollectionPreferences
          pageSizePreference={pageSizePreference}
          preferences={preferences}
          onConfirm={event => setPreferences(event.detail)}
        />
      </div>

      <div className={styles.toolbar}>
        <SegmentedControl
          label="Sort by"
          selectedId={sortingKey ?? null}
          options={[
            { id: 'name', text: 'Name' },
            { id: 'zone', text: 'Zone' },
            { id: 'cpu', text: 'CPU' },
          ]}
          onChange={event =>
            collectionProps.onSortingChange?.({
              detail: {
                sortingColumn: columns[event.detail.selectedId as keyof typeof columns],
                isDescending: collectionProps.sortingDescending,
              },
            })
          }
        />
        <Checkbox
          checked={collectionProps.sortingDescending ?? false}
          onChange={event =>
            collectionProps.onSortingChange?.({
              detail: { sortingColumn: collectionProps.sortingColumn!, isDescending: event.detail.checked },
            })
          }
        >
          Descending
        </Checkbox>
      </div>

      <p className={styles.counter} aria-live="polite">
        {filteredItemsCount} of {instances.length} instances match, {selected.size} selected
      </p>

      {items.length === 0 ? (
        <p className={styles.empty}>{collectionProps.empty}</p>
      ) : (
        <ul className={styles.list} aria-label="Instances">
          {items.map(item => (
            <li key={item.id} className={styles.row}>
              <Checkbox
                checked={selected.has(item)}
                ariaLabel={`Select ${item.name}`}
                onChange={event => toggleSelected(item, event.detail.checked)}
              />
              <span className={styles.name}>{item.name}</span>
              <code className={styles.id}>{item.id}</code>
              <span>{item.zone}</span>
              <span>{item.status}</span>
              <span className={styles.cpu}>{item.cpu}%</span>
            </li>
          ))}
        </ul>
      )}

      <Pagination {...paginationProps} />
    </article>
  );
}
