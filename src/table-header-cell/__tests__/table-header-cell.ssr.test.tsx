// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TableHeaderCell from '../../../lib/components/table-header-cell';

test('renders on the server', () => {
  const html = renderToString(
    <table>
      <thead>
        <tr>
          <TableHeaderCell selectionType="multi" />
          <TableHeaderCell sortingState="descending" resizable={true} width={120}>
            Quantity
          </TableHeaderCell>
        </tr>
      </thead>
    </table>
  );
  expect(html).toContain('aria-sort="descending"');
  expect(html).toContain('role="separator"');
  expect(html).toContain('type="checkbox"');
  expect(html).toContain('Quantity');
});
