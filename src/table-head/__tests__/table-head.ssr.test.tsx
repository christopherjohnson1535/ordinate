// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRow from '../../../lib/components/table-row';

test('renders on the server', () => {
  const html = renderToString(
    <table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Part</TableHeaderCell>
        </TableRow>
      </TableHead>
    </table>
  );
  expect(html).toContain('<thead');
  expect(html).toContain('Part');
});
