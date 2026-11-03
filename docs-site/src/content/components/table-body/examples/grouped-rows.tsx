// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const floors = [
  {
    name: 'Ground floor',
    rooms: [
      { number: '0.01', name: 'Entrance hall', area: 18.4 },
      { number: '0.02', name: 'Reading room', area: 64.2 },
    ],
  },
  {
    name: 'First floor',
    rooms: [
      { number: '1.01', name: 'Map store', area: 22.9 },
      { number: '1.02', name: 'Study carrels', area: 31.5 },
      { number: '1.03', name: 'Staff room', area: 14.0 },
    ],
  },
];

export default function GroupedRows() {
  return (
    <TableRoot caption="Room schedule" stripedRows={true}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Room</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell contentType="number">Area (m²)</TableHeaderCell>
        </TableRow>
      </TableHead>
      {/* One body per floor: each starts with a row that names the group across every column. */}
      {floors.map(floor => (
        <TableBody key={floor.name}>
          <TableRow>
            <TableBodyCell colSpan={3}>
              <Box variant="strong">{floor.name}</Box>
            </TableBodyCell>
          </TableRow>
          {floor.rooms.map(room => (
            <TableRow key={room.number}>
              <TableBodyCell contentType="identifier">{room.number}</TableBodyCell>
              <TableBodyCell isRowHeader={true}>{room.name}</TableBodyCell>
              <TableBodyCell contentType="number">{room.area.toFixed(1)}</TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      ))}
    </TableRoot>
  );
}
