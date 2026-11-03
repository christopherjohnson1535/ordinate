// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@ordinate/collection-hooks';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator, { StatusIndicatorProps } from '@ordinate/components/status-indicator';
import Table, { TableProps } from '@ordinate/components/table';
import TextFilter from '@ordinate/components/text-filter';

type State = 'Running' | 'Starting' | 'Stopped';

interface Instance {
  id: string;
  name: string;
  zone: string;
  state: State;
  cpu: number;
}

const names = ['annex', 'archive', 'atrium', 'gallery', 'lobby', 'reading-room', 'vault'];
const zones = ['us-mountain-1a', 'us-mountain-1b', 'us-east-2a'];
const states: State[] = ['Running', 'Running', 'Stopped', 'Running', 'Starting'];

const instances: Instance[] = Array.from({ length: 23 }, (_, index) => ({
  id: `i-${(0x4f20 + index * 131).toString(16)}`,
  name: `${names[index % names.length]}-${String(Math.floor(index / names.length) + 1).padStart(2, '0')}`,
  zone: zones[(index * 2) % zones.length],
  state: states[index % states.length],
  cpu: (index * 37 + 9) % 100,
}));

const indicator: Record<State, StatusIndicatorProps.State> = {
  Running: 'complete',
  Starting: 'underway',
  Stopped: 'halted',
};

const columns: TableProps.ColumnDefinition<Instance>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name', isRowHeader: true },
  { id: 'id', header: 'ID', cell: item => item.id, contentType: 'identifier' },
  { id: 'zone', header: 'Zone', cell: item => item.zone, sortingField: 'zone' },
  {
    id: 'state',
    header: 'State',
    cell: item => <StatusIndicator state={indicator[item.state]}>{item.state}</StatusIndicator>,
    sortingField: 'state',
  },
  { id: 'cpu', header: 'CPU %', cell: item => item.cpu, sortingComparator: (a, b) => a.cpu - b.cpu, contentType: 'number' },
];

export default function Schedule() {
  const [message, setMessage] = useState('Select instances to stop them.');
  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(instances, {
    filtering: {
      fields: ['name', 'id', 'zone'],
      empty: <Box color="text-body-secondary">No instances in this project.</Box>,
      noMatch: <Box color="text-body-secondary">No instance matches the filter.</Box>,
    },
    sorting: { defaultState: { sortingColumn: columns[0] } },
    pagination: { pageSize: 5 },
    selection: { trackBy: 'id' },
  });
  const selected = collectionProps.selectedItems ?? [];

  return (
    <SpaceBetween size="m">
      <Table
        {...collectionProps}
        items={items}
        columnDefinitions={columns}
        selectionType="multi"
        variant="container"
        ariaLabels={{ tableLabel: 'Instances', itemSelectionLabel: (_, item) => `Select ${item.name}` }}
        header={
          <Header
            counter={selected.length > 0 ? `(${selected.length} of ${instances.length})` : `(${instances.length})`}
            actions={
              <Button
                disabled={selected.length === 0}
                onClick={() => setMessage(`Stopping ${selected.map(item => item.name).join(', ')}.`)}
              >
                Stop
              </Button>
            }
          >
            Instances
          </Header>
        }
        filter={
          <TextFilter
            {...filterProps}
            filteringPlaceholder="Find by name, ID or zone"
            filteringAriaLabel="Find instances"
            countText={`${filteredItemsCount} matches`}
          />
        }
        pagination={<Pagination {...paginationProps} />}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {message}
      </Box>
    </SpaceBetween>
  );
}
