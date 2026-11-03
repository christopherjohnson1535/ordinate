// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Header from '@ordinate/components/header';
import Table, { TableProps } from '@ordinate/components/table';

interface Deployment {
  id: string;
  service: string;
  author: string;
  started: string;
  minutes: number;
}

const deployments: Deployment[] = [
  { id: 'd-4107', service: 'atrium-api', author: 'Dana Ruiz', started: '2026-10-28 09:14', minutes: 6 },
  { id: 'd-4108', service: 'north-annex-web', author: 'Omar Haddad', started: '2026-10-28 11:02', minutes: 12 },
  { id: 'd-4110', service: 'vault-store', author: 'Dana Ruiz', started: '2026-10-29 16:40', minutes: 31 },
  { id: 'd-4111', service: 'gallery-east', author: 'Mei Tanaka', started: '2026-10-30 08:55', minutes: 4 },
  { id: 'd-4113', service: 'archive-batch', author: 'Omar Haddad', started: '2026-10-31 22:10', minutes: 18 },
];

const columnDefinitions: TableProps.ColumnDefinition<Deployment>[] = [
  { id: 'id', header: 'Deployment', cell: item => item.id, sortingField: 'id', contentType: 'identifier' },
  { id: 'service', header: 'Service', cell: item => item.service, sortingField: 'service', isRowHeader: true },
  // No sorting field: this column cannot be sorted.
  { id: 'author', header: 'Author', cell: item => item.author },
  { id: 'started', header: 'Started', cell: item => item.started, sortingField: 'started', contentType: 'number' },
  {
    id: 'minutes',
    header: 'Duration (min)',
    cell: item => item.minutes,
    sortingComparator: (a, b) => a.minutes - b.minutes,
    contentType: 'number',
  },
];

function sortItems(items: Deployment[], state: TableProps.SortingState<Deployment>) {
  const { sortingField, sortingComparator } = state.sortingColumn;
  const compare =
    sortingComparator ??
    ((a: Deployment, b: Deployment) =>
      String(a[sortingField as keyof Deployment]).localeCompare(String(b[sortingField as keyof Deployment])));
  const sorted = [...items].sort(compare);
  return state.isDescending ? sorted.reverse() : sorted;
}

export default function Sorting() {
  const [sorting, setSorting] = useState<TableProps.SortingState<Deployment>>({
    sortingColumn: columnDefinitions[3],
    isDescending: true,
  });

  return (
    <Table
      items={sortItems(deployments, sorting)}
      columnDefinitions={columnDefinitions}
      trackBy="id"
      sortingColumn={sorting.sortingColumn}
      sortingDescending={sorting.isDescending}
      onSortingChange={event => setSorting(event.detail)}
      header={<Header counter={`(${deployments.length})`}>Recent deployments</Header>}
    />
  );
}
