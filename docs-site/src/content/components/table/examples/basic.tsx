// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '@ordinate/components/header';
import Link from '@ordinate/components/link';
import StatusIndicator, { StatusIndicatorProps } from '@ordinate/components/status-indicator';
import Table, { TableProps } from '@ordinate/components/table';

interface Service {
  name: string;
  status: 'Running' | 'Starting' | 'Stopped' | 'Failed';
  image: string;
  region: string;
  nodes: number;
}

const services: Service[] = [
  { name: 'north-annex-web', status: 'Running', image: 'web:v2', region: 'us-mountain-1', nodes: 8 },
  { name: 'gallery-east', status: 'Starting', image: 'web:v2', region: 'us-mountain-1', nodes: 4 },
  { name: 'atrium-api', status: 'Running', image: 'api:v7', region: 'us-mountain-1', nodes: 6 },
  { name: 'archive-batch', status: 'Stopped', image: 'batch:v3', region: 'eu-west-1', nodes: 0 },
  { name: 'vault-store', status: 'Failed', image: 'store:v12', region: 'eu-west-1', nodes: 2 },
];

const states: Record<Service['status'], StatusIndicatorProps.State> = {
  Running: 'complete',
  Starting: 'underway',
  Stopped: 'halted',
  Failed: 'fault',
};

const columnDefinitions: TableProps.ColumnDefinition<Service>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: item => <Link href="#/components/table">{item.name}</Link>,
    isRowHeader: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: item => <StatusIndicator state={states[item.status]}>{item.status}</StatusIndicator>,
  },
  { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
  { id: 'region', header: 'Region', cell: item => item.region, contentType: 'identifier' },
  { id: 'nodes', header: 'Nodes', cell: item => item.nodes, contentType: 'number' },
];

export default function Basic() {
  return (
    <Table
      items={services}
      columnDefinitions={columnDefinitions}
      trackBy="name"
      kind="resource"
      reference="R2"
      caption="Schedule of services"
      header={
        <Header counter={`(${services.length})`} description="Services of the North Annex project.">
          Services
        </Header>
      }
    />
  );
}
