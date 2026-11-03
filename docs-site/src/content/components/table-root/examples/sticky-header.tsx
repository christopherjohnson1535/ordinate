// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

// A survey of levels taken every 5 metres along the north wall of the annex.
const stations = Array.from({ length: 30 }, (_, index) => ({
  chainage: index * 5,
  level: 102.4 + Math.sin(index / 4) * 0.35,
}));

export default function StickyHeader() {
  return (
    <TableRoot caption="Levels along the north wall" stickyHeader={true} contentDensity="compact">
      <TableHead>
        <TableRow>
          <TableHeaderCell contentType="number">Chainage (m)</TableHeaderCell>
          <TableHeaderCell contentType="number">Level (m)</TableHeaderCell>
          <TableHeaderCell contentType="number">Change (mm)</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {stations.map((station, index) => (
          <TableRow key={station.chainage}>
            <TableBodyCell contentType="number" isRowHeader={true}>
              {station.chainage}
            </TableBodyCell>
            <TableBodyCell contentType="number">{station.level.toFixed(3)}</TableBodyCell>
            <TableBodyCell contentType="number">
              {index === 0 ? '' : Math.round((station.level - stations[index - 1].level) * 1000)}
            </TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
