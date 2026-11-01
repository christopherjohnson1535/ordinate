// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TableBodyCell from '../../../lib/components/table-body-cell';
import TableRow from '../../../lib/components/table-row';

test('renders on the server', () => {
  const html = renderToString(
    <table>
      <tbody>
        <TableRow selected={true} ariaRowindex={2}>
          <TableBodyCell>Base plate</TableBodyCell>
        </TableRow>
      </tbody>
    </table>
  );
  expect(html).toContain('aria-rowindex="2"');
  expect(html).toContain('Base plate');
});
