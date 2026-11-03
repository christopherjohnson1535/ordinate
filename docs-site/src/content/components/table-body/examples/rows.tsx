// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const revisions = [
  { rev: 'C', date: '2026-10-28', by: 'Dana Ruiz', change: 'Stair core moved 600 mm east.' },
  { rev: 'B', date: '2026-09-14', by: 'Omar Haddad', change: 'Plant room door widened to 926 mm.' },
  { rev: 'A', date: '2026-08-02', by: 'Dana Ruiz', change: 'First issue for planning.' },
];

export default function Rows() {
  return (
    <TableRoot caption="Revisions, sheet A-02">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Rev</TableHeaderCell>
          <TableHeaderCell contentType="number">Date</TableHeaderCell>
          <TableHeaderCell>By</TableHeaderCell>
          <TableHeaderCell>Change</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {revisions.map(revision => (
          <TableRow key={revision.rev}>
            <TableBodyCell contentType="identifier" isRowHeader={true}>
              {revision.rev}
            </TableBodyCell>
            <TableBodyCell contentType="number">{revision.date}</TableBodyCell>
            <TableBodyCell>{revision.by}</TableBodyCell>
            <TableBodyCell>{revision.change}</TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
