// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { FilteringProperty, useCollection } from '@ordinate/collection-hooks';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import PropertyFilter from '@ordinate/components/property-filter';
import StatusIndicator, { StatusIndicatorProps } from '@ordinate/components/status-indicator';
import Table, { TableProps } from '@ordinate/components/table';

interface Instance {
  name: string;
  status: 'Running' | 'Stopped' | 'Pending';
  type: string;
  zone: string;
  cpus: number;
}

const names = ['annex-web', 'atrium-api', 'archive-batch', 'vault-store', 'lobby-cache', 'reading-room'];
const types = ['standard.large', 'compute.xlarge', 'memory.large', 'standard.small'];
const zones = ['us-mountain-1a', 'us-mountain-1b', 'us-coastal-2a'];
const statuses: Instance['status'][] = ['Running', 'Running', 'Stopped', 'Running', 'Pending'];

const instances: Instance[] = Array.from({ length: 30 }, (_, index) => ({
  name: `${names[index % names.length]}-${String(Math.floor(index / names.length) + 1).padStart(2, '0')}`,
  status: statuses[index % statuses.length],
  type: types[(index * 3) % types.length],
  zone: zones[(index * 7) % zones.length],
  cpus: [1, 2, 4, 8, 16][(index * 3) % 5],
}));

const statusStates: Record<Instance['status'], StatusIndicatorProps.State> = {
  Running: 'complete',
  Stopped: 'halted',
  Pending: 'waiting',
};

const filteringProperties: FilteringProperty[] = [
  { key: 'name', propertyLabel: 'Name', defaultOperator: ':', operators: ['!:', '^', '='] },
  { key: 'status', propertyLabel: 'Status', groupValuesLabel: 'Status values', operators: ['!='] },
  { key: 'type', propertyLabel: 'Instance type', operators: ['!=', '^'] },
  { key: 'zone', propertyLabel: 'Zone', operators: ['!='], group: 'Placement' },
  { key: 'cpus', propertyLabel: 'vCPUs', operators: ['!=', '>', '<', '>=', '<='], group: 'Capacity' },
];

const columns: TableProps.ColumnDefinition<Instance>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
  {
    id: 'status',
    header: 'Status',
    cell: item => <StatusIndicator state={statusStates[item.status]}>{item.status}</StatusIndicator>,
  },
  { id: 'type', header: 'Type', cell: item => item.type, contentType: 'identifier' },
  { id: 'zone', header: 'Zone', cell: item => item.zone },
  { id: 'cpus', header: 'vCPUs', cell: item => item.cpus, contentType: 'number' },
];

export default function Collection() {
  const { items, filteredItemsCount, collectionProps, propertyFilterProps, paginationProps } = useCollection(
    instances,
    {
      propertyFiltering: {
        filteringProperties,
        defaultQuery: {
          operation: 'and',
          tokens: [
            { propertyKey: 'status', operator: '=', value: 'Running' },
            { propertyKey: 'cpus', operator: '>=', value: '4' },
          ],
        },
        noMatch: 'No instances match the filters.',
      },
      pagination: { pageSize: 8 },
    }
  );

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columns}
      header={<Header counter={`(${instances.length})`}>Instances</Header>}
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringPlaceholder="Find instances"
          filteringAriaLabel="Find instances"
          countText={`${filteredItemsCount} ${filteredItemsCount === 1 ? 'match' : 'matches'}`}
          expandToViewport={true}
        />
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
}
