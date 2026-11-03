// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Pagination from '@ordinate/components/pagination';
import SpaceBetween from '@ordinate/components/space-between';
import TableBody from '@ordinate/components/table-body';
import TableBodyCell from '@ordinate/components/table-body-cell';
import TableHead from '@ordinate/components/table-head';
import TableHeaderCell from '@ordinate/components/table-header-cell';
import TableRoot from '@ordinate/components/table-root';
import TableRow from '@ordinate/components/table-row';

const sheets = Array.from({ length: 23 }, (_, index) => ({
  number: `A-${String(index + 1).padStart(2, '0')}`,
  title: ['Plan', 'Section', 'Elevation', 'Detail'][index % 4] + `, level ${Math.floor(index / 4) + 1}`,
  revision: String.fromCharCode(65 + (index % 3)),
}));
const pageSize = 6;

export default function OnePageOfMany() {
  const [page, setPage] = useState(1);
  const first = (page - 1) * pageSize;
  const rows = sheets.slice(first, first + pageSize);

  return (
    <SpaceBetween size="s">
      <Pagination
        currentPageIndex={page}
        pagesCount={Math.ceil(sheets.length / pageSize)}
        onChange={event => setPage(event.detail.currentPageIndex)}
      />
      {/* The header row counts as row 1, so the data rows start at 2. */}
      <TableRoot caption="Drawing register" ariaRowcount={sheets.length + 1} layout="fixed">
        <TableHead>
          <TableRow ariaRowindex={1}>
            <TableHeaderCell width={120}>Sheet</TableHeaderCell>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell width={110}>Revision</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((sheet, index) => (
            <TableRow key={sheet.number} ariaRowindex={first + index + 2}>
              <TableBodyCell contentType="identifier">{sheet.number}</TableBodyCell>
              <TableBodyCell isRowHeader={true}>{sheet.title}</TableBodyCell>
              <TableBodyCell contentType="identifier">{sheet.revision}</TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </SpaceBetween>
  );
}
