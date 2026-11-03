// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { FilteringProperty, useCollection } from '@ordinate/collection-hooks';
import Box from '@ordinate/components/box';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import PropertyFilter from '@ordinate/components/property-filter';
import Table, { TableProps } from '@ordinate/components/table';

interface Service {
  name: string;
  status: string;
  image: string;
  nodes: number;
  owners: string[];
}

const services: Service[] = [
  { name: 'north-annex-web', status: 'Running', image: 'web:v2', nodes: 8, owners: ['Platform'] },
  { name: 'gallery-east', status: 'Starting', image: 'web:v2', nodes: 4, owners: ['Visitor services'] },
  { name: 'atrium-api', status: 'Running', image: 'api:v7', nodes: 6, owners: ['Platform', 'Archives'] },
  { name: 'archive-batch', status: 'Stopped', image: 'batch:v3', nodes: 0, owners: ['Archives'] },
  { name: 'vault-store', status: 'Failed', image: 'store:v12', nodes: 2, owners: ['Archives'] },
  { name: 'lobby-cache', status: 'Running', image: 'cache:v4', nodes: 2, owners: ['Platform'] },
  { name: 'reading-room', status: 'Running', image: 'web:v2', nodes: 3, owners: ['Visitor services'] },
];

// `owners` holds a list: `Owner = Archives` matches every service that Archives is one of the owners of.
const filteringProperties: FilteringProperty[] = [
  { key: 'name', propertyLabel: 'Name', groupValuesLabel: 'Names', operators: [':', '!:', '^'] },
  { key: 'status', propertyLabel: 'Status', groupValuesLabel: 'Statuses', operators: ['!='] },
  { key: 'image', propertyLabel: 'Image', groupValuesLabel: 'Images', operators: ['^'] },
  { key: 'nodes', propertyLabel: 'Nodes', groupValuesLabel: 'Node counts', operators: ['>', '<', '>=', '<='] },
  { key: 'owners', propertyLabel: 'Owner', groupValuesLabel: 'Owners', operators: ['!='] },
];

const columns: TableProps.ColumnDefinition<Service>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name', isRowHeader: true },
  { id: 'status', header: 'Status', cell: item => item.status, sortingField: 'status' },
  { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
  { id: 'nodes', header: 'Nodes', cell: item => item.nodes, sortingField: 'nodes', contentType: 'number' },
  { id: 'owners', header: 'Owners', cell: item => item.owners.join(', ') },
];

export default function PropertyFiltering() {
  const { items, filteredItemsCount, collectionProps, propertyFilterProps, paginationProps } = useCollection(services, {
    propertyFiltering: {
      filteringProperties,
      defaultQuery: { operation: 'and', tokens: [{ propertyKey: 'status', operator: '=', value: 'Running' }] },
      noMatch: <Box color="text-body-secondary">No service matches the filters.</Box>,
    },
    sorting: { defaultState: { sortingColumn: columns[0] } },
    pagination: { pageSize: 5 },
  });

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columns}
      variant="container"
      ariaLabels={{ tableLabel: 'Services' }}
      header={<Header counter={`(${services.length})`}>Services</Header>}
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringPlaceholder="Find services"
          filteringAriaLabel="Find services"
          countText={`${filteredItemsCount} of ${services.length}`}
        />
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
}
