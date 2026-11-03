// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell, { TableHeaderCellProps } from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

interface Room {
  number: string;
  name: string;
  area: number;
}

const rooms: Room[] = [
  { number: '0.01', name: 'Entrance hall', area: 18.4 },
  { number: '0.02', name: 'Reading room', area: 64.2 },
  { number: '0.03', name: 'Map store', area: 22.9 },
  { number: '0.04', name: 'Plant room', area: 9.6 },
];

type Key = 'number' | 'name' | 'area';

export default function Sorting() {
  const [sortKey, setSortKey] = useState<Key>('area');
  const [descending, setDescending] = useState(true);

  const sorted = [...rooms].sort((a, b) => {
    const order = sortKey === 'area' ? a.area - b.area : a[sortKey].localeCompare(b[sortKey]);
    return descending ? -order : order;
  });

  // Every sortable column gets a state: the one in use is ascending or descending, the rest unsorted.
  const headingProps = (key: Key) => {
    const direction: TableHeaderCellProps.SortingState = descending ? 'descending' : 'ascending';
    return {
      sortingState: key === sortKey ? direction : ('unsorted' as const),
      onSortingChange: (event: { detail: TableHeaderCellProps.SortingChangeDetail }) => {
        setSortKey(key);
        setDescending(event.detail.descending);
      },
    };
  };

  return (
    <TableRoot caption="Room schedule, ground floor">
      <TableHead>
        <TableRow>
          <TableHeaderCell {...headingProps('number')}>Room</TableHeaderCell>
          <TableHeaderCell {...headingProps('name')}>Name</TableHeaderCell>
          <TableHeaderCell {...headingProps('area')} contentType="number">
            Area (m²)
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map(room => (
          <TableRow key={room.number}>
            <TableBodyCell contentType="identifier">{room.number}</TableBodyCell>
            <TableBodyCell isRowHeader={true}>{room.name}</TableBodyCell>
            <TableBodyCell contentType="number">{room.area.toFixed(1)}</TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
