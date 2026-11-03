// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import StatusIndicator from '@ordinate/components/status-indicator';
import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const volumes = [
  { name: 'Drawing archive', id: 'vol-07c2', size: 2048, used: 71.4, ok: true },
  { name: 'Nightly export', id: 'vol-0a19', size: 512, used: 94.8, ok: false },
  { name: 'Print room spool', id: 'vol-0b33', size: 128, used: 12.0, ok: true },
];

export default function ContentTypes() {
  return (
    <TableRoot caption="Volumes, us-mountain-1">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Volume ID</TableHeaderCell>
          <TableHeaderCell contentType="number">Size (GiB)</TableHeaderCell>
          <TableHeaderCell contentType="number">Used (%)</TableHeaderCell>
          <TableHeaderCell>Health</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {volumes.map(volume => (
          <TableRow key={volume.id}>
            {/* text, the default: the body face. */}
            <TableBodyCell isRowHeader={true}>{volume.name}</TableBodyCell>
            {/* identifier: names and codes in mono. */}
            <TableBodyCell contentType="identifier">{volume.id}</TableBodyCell>
            {/* number: mono with even figures, aligned to the end. */}
            <TableBodyCell contentType="number">{volume.size.toLocaleString('en-US')}</TableBodyCell>
            <TableBodyCell contentType="number">{volume.used.toFixed(1)}</TableBodyCell>
            <TableBodyCell>
              <StatusIndicator state={volume.ok ? 'complete' : 'caution'}>
                {volume.ok ? 'Healthy' : 'Nearly full'}
              </StatusIndicator>
            </TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
