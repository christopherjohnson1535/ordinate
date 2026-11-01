// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import bodyCellStyles from '../../../lib/components/table-body-cell/styles.css.js';
import styles from '../../../lib/components/table-root/styles.css.js';
import rowStyles from '../../../lib/components/table-row/styles.css.js';

function Parts(props: Partial<TableRootProps>) {
  return (
    <TableRoot ariaLabel="Parts" {...props}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Part</TableHeaderCell>
          <TableHeaderCell sortingState="ascending">Quantity</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow ariaRowindex={2}>
          <TableBodyCell isRowHeader={true}>Base plate</TableBodyCell>
          <TableBodyCell>1</TableBodyCell>
        </TableRow>
        <TableRow ariaRowindex={3} selected={true}>
          <TableBodyCell isRowHeader={true}>Hex bolt</TableBodyCell>
          <TableBodyCell>12</TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

describe('TableRoot', () => {
  test('renders a named native table', () => {
    render(<Parts ariaRowcount={40} />);
    const table = screen.getByRole('table', { name: 'Parts' });
    expect(table.tagName).toBe('TABLE');
    expect(table).toHaveAttribute('aria-rowcount', '40');
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('rowheader').map(cell => cell.textContent)).toEqual(['Base plate', 'Hex bolt']);
  });

  test('caption renders a native caption that names the table', () => {
    render(<Parts ariaLabel={undefined} caption="Parts list" />);
    expect(screen.getByRole('table', { name: 'Parts list' })).toBeInTheDocument();
    expect(createWrapper().findTableRoot()!.findCaption()!.getText()).toBe('Parts list');
  });

  test('passes id and data attributes to the wrapper', () => {
    render(<Parts id="parts" data-testid="parts" />);
    expect(screen.getByTestId('parts')).toHaveAttribute('id', 'parts');
    expect(createWrapper().findTableRoot()!.getElement()).toBe(screen.getByTestId('parts'));
  });

  test('compact content density switches the density tokens of its subtree', () => {
    const { rerender } = render(<Parts />);
    const root = () => createWrapper().findTableRoot()!.getElement();
    expect(root()).not.toHaveClass('ord-compact-mode');
    rerender(<Parts contentDensity="compact" />);
    expect(root()).toHaveClass('ord-compact-mode');
  });

  test('the fixed layout reaches the table and makes cells truncate', () => {
    render(<Parts layout="fixed" />);
    const wrapper = createWrapper().findTableRoot()!;
    expect(wrapper.findTableElement().getElement()).toHaveClass(styles['layout-fixed']);
    expect(wrapper.findBodyCell(1, 2)!.getElement()).toHaveClass(bodyCellStyles.truncate);
  });

  test('rows and cells follow the striped and wrapping settings', () => {
    render(<Parts stripedRows={true} wrapLines={true} />);
    const wrapper = createWrapper().findTableRoot()!;
    wrapper.findRows().forEach(row => expect(row.getElement()).toHaveClass(rowStyles.striped));
    expect(wrapper.findBodyCell(1, 2)!.getElement()).toHaveClass(bodyCellStyles.wrap);
  });

  test('the sticky header stays in place when nothing scrolls', () => {
    render(<Parts stickyHeader={true} />);
    const head = createWrapper().findTableHead()!.getElement();
    expect(head.style.transform).toBe('');
    expect(head).not.toHaveClass(styles['head-stuck']);
  });
});

describe('TableRoot test utilities and accessibility', () => {
  test('the wrapper finds headers, rows, cells and selected rows', () => {
    render(<Parts />);
    const wrapper = createWrapper().findTableRoot()!;
    expect(wrapper.findColumnHeaders().map(header => header.getElement().textContent)).toEqual(['Part', 'Quantity']);
    expect(wrapper.findColumnSortingArea(1)).toBeNull();
    expect(wrapper.findColumnSortingArea(2)!.getElement().tagName).toBe('BUTTON');
    expect(wrapper.findRows()).toHaveLength(2);
    expect(wrapper.findBodyCell(2, 1)!.getText()).toBe('Hex bolt');
    expect(wrapper.findBodyCell(2, 1)!.isRowHeader()).toBe(true);
    expect(wrapper.findBodyCell(3, 1)).toBeNull();
    expect(wrapper.findSelectedRows().map(row => row.findCells()[0].getText())).toEqual(['Hex bolt']);
    expect(wrapper.findSelectAllTrigger()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Parts stickyHeader={true} />);
    await expectNoAxeViolations(container);
  });
});
