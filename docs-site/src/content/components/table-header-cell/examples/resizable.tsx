// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const notes = [
  { ref: 'N1', text: 'All dimensions in millimetres unless noted otherwise.' },
  { ref: 'N2', text: 'Do not scale from this drawing. Report discrepancies to Dana Ruiz before work starts.' },
  { ref: 'N3', text: 'Fire stopping to every service penetration through a compartment wall.' },
];

export default function Resizable() {
  const [refWidth, setRefWidth] = useState(140);
  const [saved, setSaved] = useState<number | null>(null);

  return (
    <SpaceBetween size="s">
      {/* A fixed layout gives each column the width set on its header cell; the last one takes the rest. */}
      <TableRoot caption="General notes" layout="fixed" wrapLines={true}>
        <TableHead>
          <TableRow>
            <TableHeaderCell
              resizable={true}
              width={refWidth}
              minWidth={90}
              maxWidth={320}
              onResize={event => setRefWidth(event.detail.width)}
              onResizeEnd={event => setSaved(event.detail.width)}
            >
              Note
            </TableHeaderCell>
            <TableHeaderCell>Text</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.ref}>
              <TableBodyCell contentType="identifier">{note.ref}</TableBodyCell>
              <TableBodyCell>{note.text}</TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
      <Box color="text-body-secondary" fontSize="body-s">
        {saved === null ? 'Drag the end of the Note heading.' : `Saved width: ${saved} px`}
      </Box>
    </SpaceBetween>
  );
}
