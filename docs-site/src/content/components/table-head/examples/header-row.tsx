// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const doors = [
  { mark: 'D01', location: 'Main entrance', width: 1010, height: 2100, fire: 'FD60' },
  { mark: 'D02', location: 'Reading room', width: 926, height: 2040, fire: 'FD30' },
  { mark: 'D03', location: 'Plant room', width: 826, height: 2040, fire: 'FD60' },
];

export default function HeaderRow() {
  return (
    <TableRoot caption="Door schedule">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Mark</TableHeaderCell>
          <TableHeaderCell>Location</TableHeaderCell>
          <TableHeaderCell contentType="number">Width (mm)</TableHeaderCell>
          <TableHeaderCell contentType="number">Height (mm)</TableHeaderCell>
          <TableHeaderCell>Fire rating</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {doors.map(door => (
          <TableRow key={door.mark}>
            <TableBodyCell contentType="identifier">{door.mark}</TableBodyCell>
            <TableBodyCell isRowHeader={true}>{door.location}</TableBodyCell>
            <TableBodyCell contentType="number">{door.width}</TableBodyCell>
            <TableBodyCell contentType="number">{door.height}</TableBodyCell>
            <TableBodyCell contentType="identifier">{door.fire}</TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
