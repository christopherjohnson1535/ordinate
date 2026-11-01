// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Header from '../../../lib/components/header';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { ContainerWrapper } from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import rowStyles from '../../../lib/components/table-row/styles.css.js';

interface Part {
  number: string;
  name: string;
  quantity: number;
}

const parts: Part[] = [
  { number: 'A-101', name: 'Base plate', quantity: 1 },
  { number: 'A-102', name: 'Bearing housing', quantity: 2 },
  { number: 'A-103', name: 'Main shaft', quantity: 1 },
  { number: 'A-104', name: 'Flywheel', quantity: 1 },
  { number: 'A-105', name: 'Hex bolt', quantity: 12 },
];

const byQuantity = (a: Part, b: Part) => a.quantity - b.quantity;

const columns: TableProps.ColumnDefinition<Part>[] = [
  { id: 'number', header: 'Part no.', cell: item => item.number, sortingField: 'number' },
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true, width: 200 },
  {
    id: 'quantity',
    header: 'Quantity',
    cell: item => item.quantity,
    sortingComparator: byQuantity,
    verticalAlign: 'top',
  },
];

function Parts(props: Partial<TableProps<Part>>) {
  return <Table items={parts} columnDefinitions={columns} trackBy="number" {...props} />;
}

function SelectableParts(props: Partial<TableProps<Part>> & { onChange?: (items: Part[]) => void }) {
  const { onChange, ...rest } = props;
  const [selectedItems, setSelectedItems] = useState<Part[]>(props.selectedItems ? [...props.selectedItems] : []);
  return (
    <Parts
      selectionType="multi"
      {...rest}
      selectedItems={selectedItems}
      onSelectionChange={event => {
        onChange?.(event.detail.selectedItems);
        setSelectedItems(event.detail.selectedItems);
      }}
    />
  );
}

const table = () => createWrapper().findTable()!;
const selectedNumbers = () =>
  table()
    .findSelectedRows()
    .map(row => row.findCells()[1].getText());

describe('Table rendering', () => {
  test('renders a row per item and a cell per column', () => {
    render(<Parts />);
    expect(
      table()
        .findColumnHeaders()
        .map(header => header.getElement().textContent)
    ).toEqual(['Part no.', 'Name', 'Quantity']);
    expect(table().findRows()).toHaveLength(5);
    expect(table().findBodyCell(2, 2)!.getText()).toBe('Bearing housing');
    expect(table().findBodyCell(2, 2)!.isRowHeader()).toBe(true);
    expect(screen.getAllByRole('rowheader')).toHaveLength(5);
  });

  test('uses the container look by default and puts the slots in it', () => {
    render(
      <Parts
        header={<Header counter="(5)">Parts</Header>}
        filter={<input aria-label="Find parts" />}
        pagination={<span>Page 1</span>}
        preferences={<button>Preferences</button>}
        footer="Updated hourly."
      />
    );
    const container = createWrapper().findComponent(ContainerWrapper)!;
    expect(container.getElement()).toBe(table().getElement());
    expect(container.findHeader()!.getElement()).toContainElement(table().findHeaderSlot()!.getElement());
    expect(table().findHeaderSlot()!.getText()).toBe('Parts (5)');
    expect(table().findTextFilter()!.find('input')).not.toBeNull();
    expect(table().findPagination()!.getText()).toBe('Page 1');
    expect(table().findCollectionPreferences()!.getText()).toBe('Preferences');
    expect(table().findFooterSlot()!.getText()).toBe('Updated hourly.');
  });

  test.each(['embedded', 'borderless', 'full-page'] as const)('the %s variant keeps every slot', variant => {
    render(<Parts variant={variant} header="Parts" footer="Updated hourly." />);
    expect(table().findHeaderSlot()!.getText()).toBe('Parts');
    expect(table().findFooterSlot()!.getText()).toBe('Updated hourly.');
    expect(table().findRows()).toHaveLength(5);
  });

  test('columnDisplay sets the order and visibility of columns', () => {
    render(
      <Parts
        columnDisplay={[
          { id: 'quantity', visible: true },
          { id: 'number', visible: false },
          { id: 'name', visible: true },
        ]}
      />
    );
    expect(
      table()
        .findColumnHeaders()
        .map(header => header.getElement().textContent)
    ).toEqual(['Quantity', 'Name']);
    expect(table().findBodyCell(1, 2)!.getText()).toBe('Base plate');
  });

  test('shows the loading message instead of rows', () => {
    render(<Parts loading={true} empty="No parts" />);
    expect(table().findRows()).toHaveLength(0);
    expect(table().findLoadingText()!.getText()).toBe('Loading');
    expect(table().findEmptySlot()).toBeNull();
  });

  test('uses the given loading text', () => {
    render(<Parts loading={true} loadingText="Loading parts" />);
    expect(table().findLoadingText()!.getText()).toBe('Loading parts');
  });

  test('shows the empty slot across every column when there are no items', () => {
    render(<Parts items={[]} empty="No parts" selectionType="multi" />);
    expect(table().findRows()).toHaveLength(0);
    expect(table().findEmptySlot()!.getText()).toBe('No parts');
    expect(table().findEmptySlot()!.getElement().closest('td')).toHaveAttribute('colspan', '4');
    expect(table().findEmptySlot()!.getElement().closest('tr')).toHaveClass(rowStyles.message);
  });

  test('applies column widths and vertical alignment', () => {
    render(<Parts />);
    expect(table().findColumnHeaders()[1].getElement().style.width).toBe('200px');
    expect(table().findBodyCell(1, 3)!.getElement().className).toContain('align-top');
  });

  test('sets row positions for a page of a longer list', () => {
    render(<Parts firstIndex={11} totalItemsCount={54} />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '55');
    const rows = screen.getAllByRole('row');
    expect(rows[0]).toHaveAttribute('aria-rowindex', '1');
    expect(rows[1]).toHaveAttribute('aria-rowindex', '12');
    expect(rows[5]).toHaveAttribute('aria-rowindex', '16');
  });

  test('names the table', () => {
    render(<Parts ariaLabels={{ tableLabel: 'Parts list' }} />);
    expect(screen.getByRole('table', { name: 'Parts list' })).toBeInTheDocument();
  });

  test('announces the shown items', async () => {
    vi.useFakeTimers();
    try {
      render(
        <Parts
          firstIndex={11}
          totalItemsCount={54}
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Showing parts ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
          }
        />
      );
      await act(async () => {
        vi.runAllTimers();
      });
      expect(table().findLiveRegion()!.getElement().textContent).toContain('Showing parts 11 to 15 of 54');
    } finally {
      vi.useRealTimers();
    }
  });

  test('fires onRowClick with the item and its index', () => {
    const onRowClick = vi.fn();
    render(<Parts onRowClick={event => onRowClick(event.detail)} />);
    table().findBodyCell(3, 1)!.click();
    expect(onRowClick).toHaveBeenCalledWith({ rowIndex: 2, item: parts[2] });
  });
});

describe('Table sorting', () => {
  test('marks the sorting column and leaves others unsorted', () => {
    render(<Parts sortingColumn={{ sortingField: 'number' }} sortingDescending={true} />);
    const headers = table().findColumnHeaders();
    expect(headers.map(header => header.getSortingState())).toEqual(['descending', null, 'none']);
    expect(table().findColumnSortingArea(2)).toBeNull();
  });

  test('matches the sorting column by comparator', () => {
    render(<Parts sortingColumn={{ sortingComparator: byQuantity }} />);
    expect(table().findColumnHeaders()[2].getSortingState()).toBe('ascending');
  });

  test('requests ascending order for a new column, then the reverse', () => {
    const onSortingChange = vi.fn();
    const { rerender } = render(<Parts onSortingChange={event => onSortingChange(event.detail)} />);
    table().findColumnSortingArea(3)!.click();
    expect(onSortingChange).toHaveBeenLastCalledWith({ sortingColumn: columns[2], isDescending: false });
    rerender(<Parts sortingColumn={columns[2]} onSortingChange={event => onSortingChange(event.detail)} />);
    table().findColumnSortingArea(3)!.click();
    expect(onSortingChange).toHaveBeenLastCalledWith({ sortingColumn: columns[2], isDescending: true });
  });

  test('does not sort the items itself', () => {
    render(<Parts sortingColumn={columns[2]} sortingDescending={true} />);
    expect(table().findBodyCell(1, 1)!.getText()).toBe('A-101');
  });

  test('sortingDisabled on the table or on a column', () => {
    const { rerender } = render(<Parts sortingDisabled={true} />);
    expect(table().findColumnSortingArea(1)!.getElement()).toBeDisabled();
    rerender(<Parts columnDefinitions={[{ ...columns[0], sortingDisabled: true }]} />);
    expect(table().findColumnSortingArea(1)).toBeNull();
  });
});

describe('Table selection', () => {
  test('multi selection shows the selected rows and labels each control', () => {
    render(<Parts selectionType="multi" selectedItems={[{ ...parts[1] }]} />);
    expect(selectedNumbers()).toEqual(['A-102']);
    expect(screen.getByRole('checkbox', { name: 'Select row 1' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Select row 2' })).toBeChecked();
    expect(table().findSelectAllTrigger()!.getElement().indeterminate).toBe(true);
  });

  test('row numbers in the default labels follow firstIndex', () => {
    render(<Parts selectionType="multi" firstIndex={21} />);
    expect(screen.getByRole('checkbox', { name: 'Select row 21' })).toBeInTheDocument();
  });

  test('uses the given selection labels', () => {
    render(
      <Parts
        selectionType="multi"
        ariaLabels={{
          itemSelectionLabel: (_, item) => `Select ${item.name}`,
          allItemsSelectionLabel: ({ selectedItems }) => `Select all parts, ${selectedItems.length} selected`,
        }}
      />
    );
    expect(screen.getByRole('checkbox', { name: 'Select Flywheel' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select all parts, 0 selected' })).toBeInTheDocument();
  });

  test('checking a row adds it to the selection', () => {
    const onChange = vi.fn();
    render(<SelectableParts onChange={onChange} />);
    table().findRowSelectionArea(2)!.click();
    expect(onChange).toHaveBeenLastCalledWith([parts[1]]);
    table().findRowSelectionArea(4)!.click();
    expect(selectedNumbers()).toEqual(['A-102', 'A-104']);
    table().findRowSelectionArea(2)!.click();
    expect(selectedNumbers()).toEqual(['A-104']);
  });

  test('Shift-click selects or clears the range since the last row changed', () => {
    render(<SelectableParts isItemDisabled={item => item.number === 'A-103'} />);
    table().findRowSelectionArea(1)!.click();
    table().findRowSelectionArea(4)!.click({ shiftKey: true });
    expect(selectedNumbers()).toEqual(['A-101', 'A-102', 'A-104']);
    table().findRowSelectionArea(2)!.click({ shiftKey: true });
    expect(selectedNumbers()).toEqual(['A-101']);
  });

  test('select all selects every enabled item on the page, then clears them', () => {
    const offPage = { number: 'Z-900', name: 'Governor', quantity: 1 };
    render(<SelectableParts selectedItems={[offPage]} isItemDisabled={item => item.number === 'A-105'} />);
    const selectAll = () => table().findSelectAllTrigger()!;
    selectAll().click();
    expect(selectedNumbers()).toEqual(['A-101', 'A-102', 'A-103', 'A-104']);
    expect(selectAll().getElement()).toBeChecked();
    selectAll().click();
    expect(selectedNumbers()).toEqual([]);
  });

  test('keeps selected items from other pages', () => {
    const onChange = vi.fn();
    const offPage = { number: 'Z-900', name: 'Governor', quantity: 1 };
    render(<SelectableParts selectedItems={[offPage]} onChange={onChange} />);
    table().findRowSelectionArea(1)!.click();
    expect(onChange).toHaveBeenLastCalledWith([offPage, parts[0]]);
  });

  test('disabled items cannot be selected', () => {
    const onChange = vi.fn();
    render(<SelectableParts onChange={onChange} isItemDisabled={item => item.number === 'A-101'} />);
    expect(table().findRowSelectionArea(1)!.getElement()).toBeDisabled();
    table().findRowSelectionArea(1)!.click();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('single selection uses one radio group and replaces the selection', () => {
    const onChange = vi.fn();
    render(<SelectableParts selectionType="single" selectedItems={[parts[0]]} onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    expect(new Set(radios.map(radio => radio.getAttribute('name'))).size).toBe(1);
    expect(table().findSelectAllTrigger()).toBeNull();
    table().findRowSelectionArea(3)!.click();
    expect(onChange).toHaveBeenLastCalledWith([parts[2]]);
    expect(selectedNumbers()).toEqual(['A-103']);
  });

  test('selection controls are normal tab stops', () => {
    render(<Parts selectionType="multi" />);
    screen.getAllByRole('checkbox').forEach(checkbox => expect(checkbox.tabIndex).toBe(0));
  });
});

describe('Table resizable columns', () => {
  test('switches to a fixed layout and leaves the last column flexible', () => {
    render(<Parts resizableColumns={true} />);
    const headers = table().findColumnHeaders();
    expect(screen.getByRole('table').className).toContain('layout-fixed');
    expect(headers[1].getElement().style.width).toBe('200px');
    expect(headers[2].getElement().style.width).toBe('');
    expect(screen.getAllByRole('separator')).toHaveLength(3);
  });

  test('reports every column width after a resize, in definition order', () => {
    const onColumnWidthsChange = vi.fn();
    render(
      <Parts
        resizableColumns={true}
        columnDisplay={[
          { id: 'name', visible: true },
          { id: 'quantity', visible: true },
        ]}
        onColumnWidthsChange={event => onColumnWidthsChange(event.detail.widths)}
      />
    );
    table().findColumnResizer(1)!.keydown('ArrowRight');
    expect(onColumnWidthsChange).toHaveBeenCalledWith([120, 210, 120]);
    expect(table().findColumnHeaders()[0].getElement().style.width).toBe('210px');
  });
});

describe('Table schedule', () => {
  const tagOf = (item: Part) => `S${parts.indexOf(item) + 1}`;

  test('shows the caption above the columns and names the table with it', () => {
    render(<Parts caption="Schedule of parts" />);
    expect(table().findCaption()!.getText()).toBe('Schedule of parts');
    expect(screen.getByRole('table', { name: 'Schedule of parts' })).toBeInTheDocument();
  });

  test('the table label wins over the caption as the name', () => {
    render(<Parts caption="Schedule of parts" ariaLabels={{ tableLabel: 'Parts' }} />);
    expect(screen.getByRole('table', { name: 'Parts' })).toBeInTheDocument();
  });

  test('rowTag adds a first column of tags, each read once', () => {
    const rowTag = vi.fn(tagOf);
    render(<Parts rowTag={rowTag} sortingColumn={columns[0]} />);
    expect(rowTag).toHaveBeenCalledWith(parts[1], 1);
    expect(
      table()
        .findColumnHeaders()
        .map(header => header.getElement().textContent)
    ).toEqual(['Tag', 'Part no.', 'Name', 'Quantity']);
    expect(table().findRowTag(2)!.getText()).toBe('S2');
    expect(table().findBodyCell(2, 1)!.findRowTag()!.getText()).toBe('S2');
    expect(table().findBodyCell(2, 1)!.isRowHeader()).toBe(false);
    const row = screen.getAllByRole('row')[2];
    expect(row.textContent!.match(/S2/g)).toHaveLength(1);
    expect(screen.getByRole('cell', { name: 'S2' })).toBeInTheDocument();
    expect(screen.getAllByRole('rowheader').map(cell => cell.textContent)).toEqual(parts.map(part => part.name));
  });

  test('without rowTag there is no tag column', () => {
    render(<Parts />);
    expect(table().findRowTag(1)).toBeNull();
    expect(screen.queryByRole('columnheader', { name: 'Tag' })).toBeNull();
  });

  test('keeps selection working next to the tag column', () => {
    const onChange = vi.fn();
    render(<SelectableParts rowTag={tagOf} onChange={onChange} />);
    expect(table().findBodyCell(1, 2)!.findSelectionControl()).not.toBeNull();
    table().findRowSelectionArea(3)!.click();
    expect(onChange).toHaveBeenLastCalledWith([parts[2]]);
    expect(table().findSelectedRows()).toHaveLength(1);
    expect(table().findSelectedRows()[0].findRowTag()!.getText()).toBe('S3');
    table().findSelectAllTrigger()!.click();
    expect(table().findSelectedRows()).toHaveLength(parts.length);
  });

  test('the empty message spans the tag column too', () => {
    render(<Parts items={[]} empty="No parts" rowTag={tagOf} selectionType="multi" />);
    expect(screen.getByText('No parts').closest('td')).toHaveAttribute('colspan', '5');
  });
});

describe('Table accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <Parts
        header={<Header counter="(5)">Parts</Header>}
        selectionType="multi"
        selectedItems={[parts[0]]}
        sortingColumn={columns[0]}
        resizableColumns={true}
        footer="Updated hourly."
      />
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations as a schedule with a caption and row tags', async () => {
    const { container } = render(
      <Parts
        caption="Schedule of parts"
        rowTag={item => `S${parts.indexOf(item) + 1}`}
        selectionType="single"
        selectedItems={[parts[2]]}
        sortingColumn={columns[0]}
      />
    );
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations when empty or loading', async () => {
    const { container, rerender } = render(<Parts items={[]} empty="No parts" selectionType="single" />);
    await expectNoAxeViolations(container);
    rerender(<Parts loading={true} variant="embedded" />);
    await expectNoAxeViolations(container);
  });
});
