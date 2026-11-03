// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';
import Table, { TableProps } from '@ordinate/components/table';

interface Instance {
  id: string;
  name: string;
  state: 'running' | 'stopped' | 'locked';
  zone: string;
}

const instances: Instance[] = [
  { id: 'i-0a12', name: 'annex-1', state: 'running', zone: 'us-mountain-1a' },
  { id: 'i-0a37', name: 'boiler-1', state: 'running', zone: 'us-mountain-1b' },
  { id: 'i-0a5c', name: 'crane-1', state: 'stopped', zone: 'us-mountain-1a' },
  { id: 'i-0a81', name: 'dynamo-1', state: 'locked', zone: 'us-mountain-1b' },
  { id: 'i-0aa6', name: 'flywheel-1', state: 'running', zone: 'us-mountain-1a' },
  { id: 'i-0acb', name: 'governor-1', state: 'running', zone: 'us-mountain-1b' },
];

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
  { id: 'id', header: 'Instance ID', cell: item => item.id, contentType: 'identifier' },
  {
    id: 'state',
    header: 'State',
    cell: item =>
      item.state === 'locked' ? (
        <StatusIndicator state="halted">Locked by a change freeze</StatusIndicator>
      ) : (
        <StatusIndicator state={item.state === 'running' ? 'complete' : 'halted'}>{item.state}</StatusIndicator>
      ),
  },
  { id: 'zone', header: 'Zone', cell: item => item.zone, contentType: 'identifier' },
];

export default function MultiSelection() {
  const [selectedItems, setSelectedItems] = useState<Instance[]>([instances[1], instances[4]]);
  const count = selectedItems.length;

  return (
    <Table
      items={instances}
      columnDefinitions={columnDefinitions}
      trackBy="id"
      kind="resource"
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
      isItemDisabled={item => item.state === 'locked'}
      ariaLabels={{
        allItemsSelectionLabel: () => 'Select all instances',
        itemSelectionLabel: (_, item) => `Select ${item.name}`,
      }}
      header={
        <Header
          counter={count > 0 ? `(${count} of ${instances.length})` : `(${instances.length})`}
          description="Shift-click a second box to pick every row between."
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button disabled={count === 0} onClick={() => setSelectedItems([])}>
                Clear
              </Button>
              <Button variant="destructive" disabled={count === 0}>
                {count > 1 ? `Stop ${count} instances` : 'Stop instance'}
              </Button>
            </SpaceBetween>
          }
        >
          Instances
        </Header>
      }
    />
  );
}
