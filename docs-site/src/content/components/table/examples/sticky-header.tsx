// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '@ordinate/components/header';
import Table, { TableProps } from '@ordinate/components/table';

interface Reading {
  hour: string;
  requests: number;
  errors: number;
  latency: number;
}

const readings: Reading[] = Array.from({ length: 24 }, (_, hour) => ({
  hour: `${String(hour).padStart(2, '0')}:00`,
  requests: 1200 + ((hour * 397) % 900),
  errors: (hour * 7) % 13,
  latency: 80 + ((hour * 31) % 60),
}));

const columnDefinitions: TableProps.ColumnDefinition<Reading>[] = [
  { id: 'hour', header: 'Hour', cell: item => item.hour, contentType: 'number', isRowHeader: true },
  { id: 'requests', header: 'Requests', cell: item => item.requests.toLocaleString('en-US'), contentType: 'number' },
  { id: 'errors', header: 'Errors', cell: item => item.errors, contentType: 'number' },
  { id: 'latency', header: 'p95 latency (ms)', cell: item => item.latency, contentType: 'number' },
];

export default function StickyHeader() {
  return (
    <Table
      items={readings}
      columnDefinitions={columnDefinitions}
      trackBy="hour"
      stickyHeader={true}
      stripedRows={true}
      contentDensity="compact"
      header={<Header description="Scroll the frame: the column headings stay in view.">atrium-api, 1 November</Header>}
    />
  );
}
