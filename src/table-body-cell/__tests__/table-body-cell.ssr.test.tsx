// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TableBodyCell from '../../../lib/components/table-body-cell';

test('renders on the server', () => {
  const html = renderToString(
    <table>
      <tbody>
        <tr>
          <TableBodyCell selectionType="single" selectionName="parts" />
          <TableBodyCell isRowHeader={true}>Base plate</TableBodyCell>
        </tr>
      </tbody>
    </table>
  );
  expect(html).toContain('type="radio"');
  expect(html).toContain('scope="row"');
  expect(html).toContain('Base plate');
});
