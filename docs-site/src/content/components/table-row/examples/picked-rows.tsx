// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const issues = [
  { id: 'RFI-12', title: 'Lintel size over door D02', to: 'Structural engineer' },
  { id: 'RFI-13', title: 'Finish to reading room floor', to: 'Client' },
  { id: 'RFI-14', title: 'Route of the sprinkler main', to: 'Services engineer' },
];

export default function PickedRows() {
  const [picked, setPicked] = useState('RFI-13');

  return (
    <TableRoot caption="Requests for information">
      <TableHead>
        <TableRow>
          <TableHeaderCell selectionType="single" selectionAriaLabel="Request to answer" />
          <TableHeaderCell>Request</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell>Sent to</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {issues.map(issue => (
          // A selected row is raised and carries an ink rule on its leading edge.
          <TableRow key={issue.id} selected={issue.id === picked}>
            <TableBodyCell
              selectionType="single"
              selectionName="request"
              selected={issue.id === picked}
              selectionAriaLabel={`Select ${issue.id}`}
              onSelectionChange={() => setPicked(issue.id)}
            />
            <TableBodyCell contentType="identifier">{issue.id}</TableBodyCell>
            <TableBodyCell isRowHeader={true}>{issue.title}</TableBodyCell>
            <TableBodyCell>{issue.to}</TableBodyCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}
