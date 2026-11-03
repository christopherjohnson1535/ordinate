// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';
import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const sheets = [
  { number: 'A-01', title: 'Site plan', scale: '1:500' },
  { number: 'A-02', title: 'Ground floor plan', scale: '1:100' },
  { number: 'A-03', title: 'First floor plan', scale: '1:100' },
  { number: 'A-10', title: 'Section A–A', scale: '1:50' },
];

export default function ClickableRows() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <SpaceBetween size="s">
      <TableRoot caption="Drawing register">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Sheet</TableHeaderCell>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Scale</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sheets.map(sheet => (
            <TableRow key={sheet.number} onClick={() => setOpened(sheet.number)}>
              <TableBodyCell contentType="identifier">{sheet.number}</TableBodyCell>
              <TableBodyCell isRowHeader={true}>
                {/* The link is the keyboard way in; the row click is a larger target for the pointer. */}
                <Link
                  href="#/components/table-row"
                  onFollow={event => {
                    event.preventDefault();
                    setOpened(sheet.number);
                  }}
                >
                  {sheet.title}
                </Link>
              </TableBodyCell>
              <TableBodyCell contentType="identifier">{sheet.scale}</TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
      <Box color="text-body-secondary" fontSize="body-s">
        {opened ? `Opened sheet ${opened}.` : 'Click a row to open its sheet.'}
      </Box>
    </SpaceBetween>
  );
}
