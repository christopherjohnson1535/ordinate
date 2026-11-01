// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow, { TableRowProps } from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/table-row/styles.css.js';

function Example(props: Partial<TableRowProps>) {
  return (
    <TableRoot ariaLabel="Parts">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Part</TableHeaderCell>
          <TableHeaderCell>Quantity</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow data-testid="row" {...props}>
          <TableBodyCell isRowHeader={true}>Base plate</TableBodyCell>
          <TableBodyCell>1</TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

describe('TableRow', () => {
  test('renders a row with its position', () => {
    render(<Example ariaRowindex={12} />);
    const row = screen.getByTestId('row');
    expect(row.tagName).toBe('TR');
    expect(row).toHaveAttribute('aria-rowindex', '12');
  });

  test('shows the selected state', () => {
    const { rerender } = render(<Example />);
    const wrapper = () => createWrapper().findTableBody()!.findTableRow()!;
    expect(wrapper().isSelected()).toBe(false);
    rerender(<Example selected={true} />);
    expect(wrapper().isSelected()).toBe(true);
    expect(wrapper().getElement()).toHaveClass(styles.selected);
  });

  test('fires onClick for clicks anywhere in the row', () => {
    const onClick = vi.fn();
    render(<Example onClick={onClick} />);
    const row = createWrapper().findTableBody()!.findTableRow()!;
    expect(row.getElement()).toHaveClass(styles.clickable);
    row.findCells()[1].click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('the wrapper lists the cells, header cells included', () => {
    render(<Example />);
    const row = createWrapper().findTableBody()!.findTableRow()!;
    expect(row.findCells().map(cell => cell.getText())).toEqual(['Base plate', '1']);
    expect(row.findSelectionControl()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Example selected={true} onClick={() => {}} />);
    await expectNoAxeViolations(container);
  });
});
