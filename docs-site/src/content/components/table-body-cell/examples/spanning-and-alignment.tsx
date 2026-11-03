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

const items = [
  {
    clause: '4.2',
    title: 'Fire doors',
    text: 'Every door on an escape route closes on its own and is fitted with intumescent strips and smoke seals on three sides.',
  },
  { clause: '4.3', title: 'Signage', text: 'Exit signs above each final exit door.' },
];

export default function SpanningAndAlignment() {
  return (
    <TableRoot caption="Specification, section 4" wrapLines={true}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Clause</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell>Requirement</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.clause}>
            {/* Top alignment keeps short cells level with the first line of a long one. */}
            <TableBodyCell contentType="identifier" verticalAlign="top">
              {item.clause}
            </TableBodyCell>
            <TableBodyCell isRowHeader={true} verticalAlign="top">
              {item.title}
            </TableBodyCell>
            <TableBodyCell verticalAlign="top">{item.text}</TableBodyCell>
          </TableRow>
        ))}
        <TableRow>
          <TableBodyCell colSpan={3}>
            <Box color="text-body-secondary" fontSize="body-s">
              Clauses 4.4 to 4.9 are held until the fire strategy is agreed.
            </Box>
          </TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}
