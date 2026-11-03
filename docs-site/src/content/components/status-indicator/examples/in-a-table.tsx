// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';
import StatusIndicator, { StatusIndicatorProps } from '@ordinate/components/status-indicator';
import Table, { TableProps } from '@ordinate/components/table';

type State = 'Running' | 'Starting' | 'Stopping' | 'Stopped' | 'Failed';

interface Service {
  name: string;
  state: State;
  region: string;
}

const marks: Record<State, StatusIndicatorProps.State> = {
  Running: 'complete',
  Starting: 'underway',
  Stopping: 'underway',
  Stopped: 'halted',
  Failed: 'fault',
};

const initial: Service[] = [
  { name: 'north-annex-web', state: 'Running', region: 'us-mountain-1' },
  { name: 'gallery-east', state: 'Stopped', region: 'us-mountain-1' },
  { name: 'atrium-api', state: 'Running', region: 'us-mountain-1' },
  { name: 'vault-store', state: 'Failed', region: 'eu-west-1' },
];

export default function InATable() {
  const [services, setServices] = useState(initial);

  const toggle = (name: string) => {
    const set = (state: State) =>
      setServices(current => current.map(service => (service.name === name ? { ...service, state } : service)));
    const service = services.find(item => item.name === name)!;
    const running = service.state === 'Running';
    set(running ? 'Stopping' : 'Starting');
    window.setTimeout(() => set(running ? 'Stopped' : 'Running'), 1500);
  };

  const columnDefinitions: TableProps.ColumnDefinition<Service>[] = [
    { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
    {
      id: 'state',
      header: 'State',
      cell: item => <StatusIndicator state={marks[item.state]}>{item.state}</StatusIndicator>,
    },
    { id: 'region', header: 'Region', cell: item => item.region, contentType: 'identifier' },
    {
      id: 'action',
      header: 'Action',
      cell: item =>
        item.state === 'Running' || item.state === 'Stopped' || item.state === 'Failed' ? (
          <Button variant="link" onClick={() => toggle(item.name)}>
            {item.state === 'Running' ? 'Stop' : 'Start'}
          </Button>
        ) : null,
    },
  ];

  return (
    <Table
      items={services}
      columnDefinitions={columnDefinitions}
      trackBy="name"
      kind="resource"
      caption="Services"
      header={<Header counter={`(${services.length})`}>Services</Header>}
    />
  );
}
