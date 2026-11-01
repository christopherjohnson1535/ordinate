// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell, { TableBodyCellProps } from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/table-body-cell/styles.css.js';

function Example(props: Partial<TableBodyCellProps>) {
  return (
    <TableRoot ariaLabel="Parts">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Part</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableBodyCell data-testid="cell" {...props}>
            Base plate
          </TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

const cell = () => createWrapper().findTableBodyCell()!;

describe('TableBodyCell', () => {
  test('renders a data cell by default', () => {
    render(<Example />);
    expect(screen.getByRole('cell', { name: 'Base plate' })).toBe(screen.getByTestId('cell'));
    expect(cell().isRowHeader()).toBe(false);
    expect(cell().getElement()).toHaveClass(styles['no-wrap'], styles['align-middle']);
  });

  test('isRowHeader renders a row header', () => {
    render(<Example isRowHeader={true} />);
    const header = screen.getByRole('rowheader', { name: 'Base plate' });
    expect(header).toHaveAttribute('scope', 'row');
    expect(cell().isRowHeader()).toBe(true);
  });

  test('applies the vertical alignment and column span', () => {
    render(<Example verticalAlign="top" colSpan={3} />);
    expect(cell().getElement()).toHaveClass(styles['align-top']);
    expect(cell().getElement()).toHaveAttribute('colspan', '3');
  });

  test('a multi selection cell holds a labelled checkbox instead of its content', () => {
    const onSelectionChange = vi.fn();
    render(
      <Example
        selectionType="multi"
        selected={true}
        selectionAriaLabel="Select base plate"
        onSelectionChange={event => onSelectionChange(event.detail)}
      />
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Select base plate' });
    expect(checkbox).toBeChecked();
    expect(screen.queryByText('Base plate')).toBeNull();
    expect(cell().findSelectionControl()!.getElement()).toBe(checkbox);
    checkbox.click();
    expect(onSelectionChange).toHaveBeenCalledWith({ selected: false, shiftKey: false });
  });

  test('passes on Shift for range selection, from the mouse and from the keyboard', () => {
    const onSelectionChange = vi.fn();
    render(<Example selectionType="multi" onSelectionChange={event => onSelectionChange(event.detail)} />);
    const control = cell().findSelectionControl()!;
    control.click({ shiftKey: true, detail: 1 });
    expect(onSelectionChange).toHaveBeenLastCalledWith({ selected: true, shiftKey: true });
    control.keydown(' ', { shiftKey: true });
    control.click({ detail: 0 });
    expect(onSelectionChange).toHaveBeenLastCalledWith({ selected: true, shiftKey: true });
    control.keydown(' ');
    control.click({ detail: 0 });
    expect(onSelectionChange).toHaveBeenLastCalledWith({ selected: true, shiftKey: false });
  });

  test('a click in the padding of a selection cell toggles it too', () => {
    const onSelectionChange = vi.fn();
    render(<Example selectionType="multi" onSelectionChange={event => onSelectionChange(event.detail)} />);
    const area = cell().getElement().firstElementChild as HTMLElement;
    area.click();
    expect(onSelectionChange).toHaveBeenCalledWith({ selected: true, shiftKey: false });
  });

  test('a single selection cell holds a radio button that only selects', () => {
    const onSelectionChange = vi.fn();
    render(
      <Example
        selectionType="single"
        selectionName="parts"
        onSelectionChange={event => onSelectionChange(event.detail)}
      />
    );
    const radio = screen.getByRole('radio', { name: 'Select row' });
    expect(radio).toHaveAttribute('name', 'parts');
    radio.click();
    expect(onSelectionChange).toHaveBeenCalledWith({ selected: true, shiftKey: false });
  });

  test('selectionDisabled disables the control and ignores clicks in the cell', () => {
    const onSelectionChange = vi.fn();
    render(<Example selectionType="multi" selectionDisabled={true} onSelectionChange={onSelectionChange} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    (cell().getElement().firstElementChild as HTMLElement).click();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Example isRowHeader={true} />);
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations as a selection cell', async () => {
    const { container } = render(<Example selectionType="multi" />);
    await expectNoAxeViolations(container);
  });
});
