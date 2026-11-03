// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const parts = [
  { tag: 'P1', number: 'A-101', name: 'Base plate' },
  { tag: 'P2', number: 'A-102', name: 'Bearing housing' },
  { tag: 'P3', number: 'A-103', name: 'Main shaft' },
  { tag: 'P4', number: 'A-104', name: 'Flywheel' },
];

export default function RowTagsAndSelection() {
  const [picked, setPicked] = useState<string[]>(['P2']);
  const all = picked.length === parts.length;

  return (
    <TableRoot caption="Parts to reorder">
      <TableHead>
        <TableRow>
          <TableHeaderCell rowTagColumn={true} />
          <TableHeaderCell
            selectionType="multi"
            selected={all}
            indeterminate={picked.length > 0 && !all}
            onSelectionChange={event => setPicked(event.detail.selected ? parts.map(part => part.tag) : [])}
          />
          <TableHeaderCell>Part no.</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map(part => {
          const selected = picked.includes(part.tag);
          return (
            <TableRow key={part.tag} selected={selected}>
              {/* A circled reference other parts of the page can point to. */}
              <TableBodyCell rowTag={part.tag} />
              {/* The whole cell is a target, not only the checkbox. */}
              <TableBodyCell
                selectionType="multi"
                selected={selected}
                selectionAriaLabel={`Select ${part.name}`}
                onSelectionChange={event =>
                  setPicked(event.detail.selected ? [...picked, part.tag] : picked.filter(tag => tag !== part.tag))
                }
              />
              <TableBodyCell contentType="identifier">{part.number}</TableBodyCell>
              <TableBodyCell isRowHeader={true}>{part.name}</TableBodyCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableRoot>
  );
}
