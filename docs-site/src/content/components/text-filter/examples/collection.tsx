// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useCollection } from '@ordinate/collection-hooks';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import Table, { TableProps } from '@ordinate/components/table';
import TextFilter from '@ordinate/components/text-filter';

interface Instance {
  id: string;
  name: string;
  zone: string;
}

const names = ['annex', 'archive', 'beacon', 'cistern', 'depot', 'foundry', 'gantry', 'harbor'];
const zones = ['us-mountain-1a', 'us-mountain-1b', 'us-coastal-2a'];

const instances: Instance[] = Array.from({ length: 24 }, (_, index) => ({
  id: `i-${(0x3a00 + index * 97).toString(16)}`,
  name: `${names[index % names.length]}-${String(Math.floor(index / names.length) + 1).padStart(2, '0')}`,
  zone: zones[index % zones.length],
}));

const columns: TableProps.ColumnDefinition<Instance>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
  { id: 'id', header: 'ID', cell: item => item.id, contentType: 'identifier' },
  { id: 'zone', header: 'Zone', cell: item => item.zone },
];

export default function Collection() {
  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(instances, {
    filtering: { fields: ['name', 'id', 'zone'], noMatch: 'No instances match the filter.' },
    pagination: { pageSize: 6 },
  });

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columns}
      header={<Header counter={`(${instances.length})`}>Instances</Header>}
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder="Find instances"
          filteringAriaLabel="Find instances by name, ID or zone"
          countText={`${filteredItemsCount} ${filteredItemsCount === 1 ? 'match' : 'matches'}`}
        />
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
}
