// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const parts = [
  { number: 'A-101', name: 'Base plate', material: 'Cast iron', quantity: 1 },
  { number: 'A-102', name: 'Bearing housing', material: 'Bronze', quantity: 2 },
  { number: 'A-103', name: 'Main shaft', material: 'Steel, turned', quantity: 1 },
  { number: 'A-104', name: 'Flywheel', material: 'Cast iron', quantity: 1 },
  { number: 'A-105', name: 'Hex bolt, 3/4 in.', material: 'Steel', quantity: 12 },
];

export default function PartsList() {
  return (
    <TableRoot caption="Parts list, drawing A-1">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Part no.</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Material</TableHeaderCell>
          <TableHeaderCell contentType="number">Qty</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map(part => (
          <TableRow key={part.number}>
            <TableBodyCell contentType="identifier">{part.number}</TableBodyCell>
            <TableBodyCell isRowHeader={true}>{part.name}</TableBodyCell>
            <TableBodyCell>{part.material}</TableBodyCell>
            <TableBodyCell contentType="number">{part.quantity}</TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
