// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableRow from '../../../lib/components/table-row';

test('renders on the server', () => {
  const html = renderToString(
    <table>
      <TableBody>
        <TableRow>
          <TableBodyCell>Base plate</TableBodyCell>
        </TableRow>
      </TableBody>
    </table>
  );
  expect(html).toContain('<tbody');
  expect(html).toContain('Base plate');
});
