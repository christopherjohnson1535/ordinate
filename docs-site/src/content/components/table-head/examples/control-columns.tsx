// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const windows = [
  { mark: 'W01', location: 'Reading room, north', glazing: 'Double, low-e' },
  { mark: 'W02', location: 'Reading room, east', glazing: 'Double, low-e' },
  { mark: 'W03', location: 'Stair', glazing: 'Single, wired' },
];

export default function ControlColumns() {
  const [picked, setPicked] = useState<string[]>([]);
  const all = picked.length === windows.length;

  return (
    <TableRoot caption="Window schedule">
      <TableHead>
        {/* The head row holds a heading for every column, including the tag and selection columns. */}
        <TableRow>
          <TableHeaderCell rowTagColumn={true} />
          <TableHeaderCell
            selectionType="multi"
            selected={all}
            indeterminate={picked.length > 0 && !all}
            selectionAriaLabel="Select all windows"
            onSelectionChange={event => setPicked(event.detail.selected ? windows.map(w => w.mark) : [])}
          />
          <TableHeaderCell>Location</TableHeaderCell>
          <TableHeaderCell>Glazing</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {windows.map(item => {
          const selected = picked.includes(item.mark);
          return (
            <TableRow key={item.mark} selected={selected}>
              <TableBodyCell rowTag={item.mark} />
              <TableBodyCell
                selectionType="multi"
                selected={selected}
                selectionAriaLabel={`Select ${item.mark}`}
                onSelectionChange={event =>
                  setPicked(event.detail.selected ? [...picked, item.mark] : picked.filter(m => m !== item.mark))
                }
              />
              <TableBodyCell isRowHeader={true}>{item.location}</TableBodyCell>
              <TableBodyCell>{item.glazing}</TableBodyCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableRoot>
  );
}
