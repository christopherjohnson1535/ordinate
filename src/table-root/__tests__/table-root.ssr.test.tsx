// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';

test('renders on the server', () => {
  const html = renderToString(
    <TableRoot ariaLabel="Parts" stickyHeader={true} contentDensity="compact" layout="fixed">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Part</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableBodyCell>Base plate</TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
  expect(html).toContain('<table');
  expect(html).toContain('aria-label="Parts"');
  expect(html).toContain('Base plate');
});
