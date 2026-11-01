// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Link from '~components/link';
import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';
import { TableProps } from '~components/table';

export interface Instance {
  id: string;
  name: string;
  state: 'running' | 'stopped' | 'pending' | 'error';
  type: string;
  zone: string;
  cpu: number;
  launched: string;
  notes: string;
}

const states: Instance['state'][] = ['running', 'running', 'stopped', 'running', 'pending', 'error'];
const types = ['m7g.large', 't4g.medium', 'c7g.xlarge', 'r7g.2xlarge'];
const zones = ['us-mountain-1a', 'us-mountain-1b', 'eu-west-1c'];
const names = [
  'annex',
  'boiler',
  'crane',
  'dynamo',
  'escapement',
  'flywheel',
  'governor',
  'hopper',
  'idler',
  'journal',
];

export function makeInstances(count: number): Instance[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `i-${(0x0a12 + index * 37).toString(16).padStart(4, '0')}`,
    name: `${names[index % names.length]}-${Math.floor(index / names.length) + 1}`,
    state: states[index % states.length],
    type: types[index % types.length],
    zone: zones[index % zones.length],
    cpu: Math.round(((index * 37) % 97) + ((index * 13) % 10) / 10),
    launched: `2026-${String((index % 9) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
    notes:
      index % 3 === 0 ? 'Serves the north annex drawing archive and the nightly export to the print room.' : 'Standby.',
  }));
}

const stateIndicator: Record<Instance['state'], StatusIndicatorProps.Type> = {
  running: 'success',
  stopped: 'stopped',
  pending: 'pending',
  error: 'error',
};

export const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: item => <Link href={`#${item.id}`}>{item.name}</Link>,
    sortingField: 'name',
    isRowHeader: true,
  },
  { id: 'id', header: 'Instance ID', cell: item => <Box variant="code">{item.id}</Box>, sortingField: 'id' },
  {
    id: 'state',
    header: 'State',
    cell: item => <StatusIndicator type={stateIndicator[item.state]}>{item.state}</StatusIndicator>,
    sortingField: 'state',
  },
  { id: 'type', header: 'Type', cell: item => item.type, sortingField: 'type' },
  { id: 'zone', header: 'Availability zone', cell: item => item.zone },
  {
    id: 'cpu',
    header: 'CPU (%)',
    cell: item => <Box variant="code">{item.cpu.toFixed(1)}</Box>,
    sortingComparator: (a, b) => a.cpu - b.cpu,
  },
  { id: 'launched', header: 'Launched', cell: item => item.launched, sortingField: 'launched' },
];

export const notesColumn: TableProps.ColumnDefinition<Instance> = {
  id: 'notes',
  header: 'Notes',
  cell: item => item.notes,
  verticalAlign: 'top',
};

export function sortItems<T>(
  items: ReadonlyArray<T>,
  column: TableProps.SortingColumn<T> | undefined,
  descending: boolean
): T[] {
  if (!column) {
    return [...items];
  }
  const compare =
    column.sortingComparator ??
    ((a: T, b: T) => {
      const field = column.sortingField as keyof T;
      return String(a[field]).localeCompare(String(b[field]));
    });
  const sorted = [...items].sort(compare);
  return descending ? sorted.reverse() : sorted;
}
