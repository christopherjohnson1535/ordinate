// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@ordinate/collection-hooks';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import CollectionPreferences, { CollectionPreferencesProps } from '@ordinate/components/collection-preferences';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import Table, { TableProps } from '@ordinate/components/table';
import TextFilter from '@ordinate/components/text-filter';

interface Instance {
  id: string;
  name: string;
  type: string;
  zone: string;
  cpu: number;
}

const names = ['annex', 'boiler', 'crane', 'dynamo', 'flywheel', 'governor', 'hopper', 'journal'];
const types = ['m7g.large', 't4g.medium', 'c7g.xlarge'];
const allItems: Instance[] = Array.from({ length: 38 }, (_, index) => ({
  id: `i-${(0x0a12 + index * 37).toString(16)}`,
  name: `${names[index % names.length]}-${Math.floor(index / names.length) + 1}`,
  type: types[index % types.length],
  zone: index % 3 === 2 ? 'eu-west-1c' : `us-mountain-1${index % 2 ? 'b' : 'a'}`,
  cpu: (index * 37) % 97,
}));

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name', isRowHeader: true },
  { id: 'id', header: 'Instance ID', cell: item => item.id, sortingField: 'id', contentType: 'identifier' },
  { id: 'type', header: 'Type', cell: item => item.type, sortingField: 'type', contentType: 'identifier' },
  { id: 'zone', header: 'Zone', cell: item => item.zone, sortingField: 'zone', contentType: 'identifier' },
  { id: 'cpu', header: 'CPU (%)', cell: item => item.cpu, sortingField: 'cpu', contentType: 'number' },
];

const columnOptions = columnDefinitions.map(({ id, header }) => ({
  id: id!,
  label: String(header),
  alwaysVisible: id === 'name',
}));

function Message({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <Box textAlign="center">
      <Box variant="strong">{title}</Box>
      {action && <Box padding={{ top: 'xs' }}>{action}</Box>}
    </Box>
  );
}

export default function Collection() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 8,
    stripedRows: false,
    contentDisplay: columnOptions.map(({ id }) => ({ id, visible: true })),
  });
  const { items, filteredItemsCount, actions, collectionProps, filterProps, paginationProps } = useCollection(
    allItems,
    {
      filtering: {
        fields: ['name', 'id', 'type', 'zone'],
        empty: <Message title="No instances" />,
        noMatch: (
          <Message
            title="No instances match the filter"
            action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
          />
        ),
      },
      sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
      pagination: { pageSize: preferences.pageSize },
      selection: { trackBy: 'id' },
    }
  );
  const picked = collectionProps.selectedItems?.length ?? 0;

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columnDefinitions}
      columnDisplay={preferences.contentDisplay}
      stripedRows={preferences.stripedRows}
      kind="resource"
      reference="R3"
      selectionType="multi"
      ariaLabels={{ itemSelectionLabel: (_, item) => `Select ${item.name}` }}
      header={
        <Header
          counter={picked > 0 ? `(${picked} of ${allItems.length})` : `(${allItems.length})`}
          actions={<Button disabled={picked === 0}>Restart</Button>}
        >
          Instances
        </Header>
      }
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder="Find instances"
          filteringAriaLabel="Find instances"
          countText={filterProps.filteringText ? `${filteredItemsCount} matches` : undefined}
        />
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Apply"
          cancelLabel="Cancel"
          preferences={preferences}
          onConfirm={event => setPreferences(event.detail)}
          pageSizePreference={{
            title: 'Rows per page',
            options: [
              { value: 8, label: '8 instances' },
              { value: 20, label: '20 instances' },
            ],
          }}
          stripedRowsPreference={{}}
          contentDisplayPreference={{ title: 'Columns', options: columnOptions }}
        />
      }
    />
  );
}
