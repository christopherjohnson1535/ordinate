// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell, { TableHeaderCellProps } from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Example({
  selection,
  ...props
}: Partial<TableHeaderCellProps> & { selection?: Partial<TableHeaderCellProps> }) {
  return (
    <TableRoot ariaLabel="Parts" layout="fixed">
      <TableHead>
        <TableRow>
          {selection && <TableHeaderCell {...selection} />}
          <TableHeaderCell data-testid="cell" {...props}>
            Quantity
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {selection && <TableBodyCell selectionType={selection.selectionType} />}
          <TableBodyCell>12</TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

const cell = () => createWrapper().findTableHeaderCell('[data-testid="cell"]')!;

describe('TableHeaderCell sorting', () => {
  test('a column without a sorting state has no button and no aria-sort', () => {
    render(<Example />);
    expect(screen.getByRole('columnheader', { name: 'Quantity' })).toHaveAttribute('scope', 'col');
    expect(cell().findSortingButton()).toBeNull();
    expect(cell().getSortingState()).toBeNull();
  });

  test.each([
    ['unsorted', 'none', false],
    ['ascending', 'ascending', true],
    ['descending', 'descending', false],
  ] as const)('a %s column has aria-sort %s and requests descending: %s', (state, ariaSort, descending) => {
    const onSortingChange = vi.fn();
    render(<Example sortingState={state} onSortingChange={event => onSortingChange(event.detail)} />);
    expect(cell().getSortingState()).toBe(ariaSort);
    const button = screen.getByRole('button', { name: 'Quantity' });
    button.click();
    expect(onSortingChange).toHaveBeenCalledWith({ descending });
  });

  test('the sorting button is a normal tab stop that works with the keyboard', () => {
    render(<Example sortingState="unsorted" />);
    const button = cell().findSortingButton()!.getElement();
    expect(button).toHaveAttribute('type', 'button');
    expect(button.tabIndex).toBe(0);
  });

  test('sortingDisabled keeps the indicator but disables the button', () => {
    const onSortingChange = vi.fn();
    render(<Example sortingState="ascending" sortingDisabled={true} onSortingChange={onSortingChange} />);
    expect(cell().getSortingState()).toBe('ascending');
    expect(cell().findSortingButton()!.getElement()).toBeDisabled();
    cell().findSortingButton()!.click();
    expect(onSortingChange).not.toHaveBeenCalled();
  });
});

describe('TableHeaderCell widths and resizing', () => {
  test('applies width, minWidth and maxWidth', () => {
    render(<Example width={140} minWidth="6rem" maxWidth={300} />);
    const style = screen.getByTestId('cell').style;
    expect(style.width).toBe('140px');
    expect(style.minWidth).toBe('6rem');
    expect(style.maxWidth).toBe('300px');
  });

  test('the resize handle is a named, focusable separator', () => {
    render(<Example resizable={true} width={140} minWidth={100} />);
    const separator = screen.getByRole('separator', { name: 'Quantity' });
    expect(separator).toHaveAttribute('tabindex', '0');
    expect(separator).toHaveAttribute('aria-valuenow', '140');
    expect(separator).toHaveAttribute('aria-valuemin', '100');
    expect(separator).toHaveAttribute('aria-roledescription', 'resize handle');
    expect(cell().findResizer()!.getElement()).toBe(separator);
  });

  test('arrow keys resize along the reading direction and stop at the bounds', () => {
    const onResize = vi.fn();
    const onResizeEnd = vi.fn();
    const { rerender } = render(
      <Example
        resizable={true}
        width={140}
        maxWidth={145}
        onResize={event => onResize(event.detail.width)}
        onResizeEnd={event => onResizeEnd(event.detail.width)}
      />
    );
    const resizer = cell().findResizer()!;
    resizer.keydown('ArrowRight');
    expect(onResize).toHaveBeenLastCalledWith(145);
    expect(onResizeEnd).toHaveBeenLastCalledWith(145);
    resizer.keydown('ArrowLeft');
    expect(onResize).toHaveBeenLastCalledWith(130);
    resizer.keydown('ArrowUp');
    expect(onResize).toHaveBeenCalledTimes(2);

    rerender(
      <div style={{ direction: 'rtl' }}>
        <Example resizable={true} width={140} onResize={event => onResize(event.detail.width)} />
      </div>
    );
    cell().findResizer()!.keydown('ArrowLeft');
    expect(onResize).toHaveBeenLastCalledWith(150);
  });

  test('dragging the handle reports the new width while dragging and at the end', () => {
    const onResize = vi.fn();
    const onResizeEnd = vi.fn();
    render(
      <Example
        resizable={true}
        onResize={event => onResize(event.detail.width)}
        onResizeEnd={event => onResizeEnd(event.detail.width)}
      />
    );
    const th = screen.getByTestId('cell');
    th.getBoundingClientRect = () => ({ width: 150 }) as DOMRect;
    const handle = cell().findResizer()!.getElement();
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientX: 300 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 340 });
    expect(onResize).toHaveBeenLastCalledWith(190);
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 100 });
    expect(onResize).toHaveBeenLastCalledWith(80);
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 100 });
    expect(onResizeEnd).toHaveBeenCalledWith(80);
  });
});

describe('TableHeaderCell selection', () => {
  test('multi selection shows a select-all checkbox', () => {
    const onSelectionChange = vi.fn();
    render(
      <Example
        selection={{
          selectionType: 'multi',
          indeterminate: true,
          onSelectionChange: event => onSelectionChange(event.detail),
        }}
      />
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(createWrapper().findTableRoot()!.findSelectAllTrigger()!.getElement()).toBe(checkbox);
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
    checkbox.click();
    expect(onSelectionChange).toHaveBeenCalledWith({ selected: true });
  });

  test('single selection names the column for screen readers', () => {
    render(<Example selection={{ selectionType: 'single', selectionAriaLabel: 'Choose a part' }} />);
    expect(screen.getByRole('columnheader', { name: 'Choose a part' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  test('selectionDisabled disables the select-all checkbox', () => {
    render(<Example selection={{ selectionType: 'multi', selectionDisabled: true }} />);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeDisabled();
  });
});

describe('TableHeaderCell accessibility', () => {
  test('rowTagColumn heads the tag column with "Tag", or with the given heading', () => {
    const TagTable = ({ heading }: { heading?: string }) => (
      <TableRoot ariaLabel="Parts">
        <TableHead>
          <TableRow>
            <TableHeaderCell data-testid="tag" rowTagColumn={true} sortingState="ascending" resizable={true}>
              {heading}
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableBodyCell rowTag="S1" />
          </TableRow>
        </TableBody>
      </TableRoot>
    );
    const { rerender } = render(<TagTable />);
    const header = screen.getByRole('columnheader', { name: 'Tag' });
    expect(header).toBe(screen.getByTestId('tag'));
    expect(header).not.toHaveAttribute('aria-sort');
    const wrapper = createWrapper().findTableHeaderCell()!;
    expect(wrapper.findSortingButton()).toBeNull();
    expect(wrapper.findResizer()).toBeNull();
    rerender(<TagTable heading="Ref." />);
    expect(screen.getByRole('columnheader', { name: 'Ref.' })).toBeInTheDocument();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Example sortingState="ascending" resizable={true} width={120} selection={{ selectionType: 'multi' }} />
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations with single selection', async () => {
    const { container } = render(<Example selection={{ selectionType: 'single' }} />);
    await expectNoAxeViolations(container);
  });
});
