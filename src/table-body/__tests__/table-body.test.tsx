// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import rowStyles from '../../../lib/components/table-row/styles.css.js';

function Example() {
  return (
    <TableRoot ariaLabel="Parts">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Part</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody data-testid="body">
        <TableRow>
          <TableBodyCell>Base plate</TableBodyCell>
        </TableRow>
        <TableRow>
          <TableBodyCell>Flywheel</TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

describe('TableBody', () => {
  test('renders a tbody with data attributes', () => {
    render(<Example />);
    const body = screen.getByTestId('body');
    expect(body.tagName).toBe('TBODY');
    expect(createWrapper().findTableBody()!.getElement()).toBe(body);
  });

  test('rows in the body are item rows', () => {
    render(<Example />);
    const rows = createWrapper().findTableBody()!.findRows();
    expect(rows).toHaveLength(2);
    rows.forEach(row => expect(row.getElement()).toHaveClass(rowStyles.item));
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Example />);
    await expectNoAxeViolations(container);
  });
});
