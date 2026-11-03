// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import Table, { TableProps } from '@ordinate/components/table';

interface LogLine {
  id: string;
  time: string;
  service: string;
  message: string;
}

const lines: LogLine[] = [
  { id: '1', time: '09:14:02', service: 'atrium-api', message: 'Deployment d-4107 started by Dana Ruiz.' },
  { id: '2', time: '09:14:40', service: 'atrium-api', message: 'Health check passed on 6 of 6 nodes.' },
  { id: '3', time: '09:20:11', service: 'vault-store', message: 'Disk on node vs-2 is 91 % full; compaction queued.' },
  { id: '4', time: '09:21:55', service: 'gallery-east', message: 'Scaled from 2 to 4 nodes after a traffic rise.' },
];

const baseColumns: TableProps.ColumnDefinition<LogLine>[] = [
  { id: 'time', header: 'Time', cell: item => item.time, contentType: 'number', width: 110, minWidth: 90 },
  { id: 'service', header: 'Service', cell: item => item.service, contentType: 'identifier', width: 160 },
  { id: 'message', header: 'Message', cell: item => item.message },
];

export default function ResizableColumns() {
  const [widths, setWidths] = useState<ReadonlyArray<number>>([]);
  // Keep the widths in the column definitions, so they survive the next render.
  const columnDefinitions = baseColumns.map((column, index) => ({ ...column, width: widths[index] ?? column.width }));

  return (
    <SpaceBetween size="s">
      <Table
        items={lines}
        columnDefinitions={columnDefinitions}
        trackBy="id"
        resizableColumns={true}
        onColumnWidthsChange={event => setWidths(event.detail.widths)}
        header={<Header description="Drag the end of a heading, or focus it and press the arrow keys.">Log</Header>}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {widths.length ? `Saved widths: ${widths.join(', ')} px` : 'No widths saved yet.'}
      </Box>
    </SpaceBetween>
  );
}
