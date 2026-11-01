// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';
import TableBodyCellWrapper from '../table-body-cell';
import TableHeaderCellWrapper from '../table-header-cell';
import TableRowWrapper from '../table-row';

import rowStyles from '../../../table-row/styles.css.js';

/**
 * Finders shared by the table root and the configured table. Row and column indexes start at 1, and
 * the selection column, when there is one, counts as column 1.
 */
export abstract class TableGridWrapper extends ComponentWrapper {
  /**
   * The `<table>` element the finders search in.
   */
  protected abstract findNativeTable(): ElementWrapper<HTMLTableElement> | null;

  findColumnHeaders(): TableHeaderCellWrapper[] {
    return (this.findNativeTable()?.findAll(':scope > thead > tr > th') ?? []).map(
      cell => new TableHeaderCellWrapper(cell.getElement())
    );
  }

  /**
   * The sorting button of a column heading, or `null` when the column cannot be sorted.
   */
  findColumnSortingArea(columnIndex: number): ElementWrapper<HTMLButtonElement> | null {
    return this.findColumnHeaders()[columnIndex - 1]?.findSortingButton() ?? null;
  }

  /**
   * The resize handle of a column heading, or `null` when columns are not resizable.
   */
  findColumnResizer(columnIndex: number): ElementWrapper | null {
    return this.findColumnHeaders()[columnIndex - 1]?.findResizer() ?? null;
  }

  /**
   * The body rows that show items. Rows that hold the empty or loading message are left out.
   */
  findRows(): TableRowWrapper[] {
    return (this.findNativeTable()?.findAll(`:scope > tbody > tr:not(.${rowStyles.message})`) ?? []).map(
      row => new TableRowWrapper(row.getElement())
    );
  }

  findBodyCell(rowIndex: number, columnIndex: number): TableBodyCellWrapper | null {
    const cell = this.findRows()[rowIndex - 1]?.findCells()[columnIndex - 1];
    return cell ? new TableBodyCellWrapper(cell.getElement()) : null;
  }

  findSelectedRows(): TableRowWrapper[] {
    return this.findRows().filter(row => row.isSelected());
  }

  /**
   * The checkbox or radio button that selects a row.
   */
  findRowSelectionArea(rowIndex: number): ElementWrapper<HTMLInputElement> | null {
    return this.findRows()[rowIndex - 1]?.findSelectionControl() ?? null;
  }

  /**
   * The select-all checkbox, with multiple selection.
   */
  findSelectAllTrigger(): ElementWrapper<HTMLInputElement> | null {
    return this.findColumnHeaders()[0]?.findSelectionControl() ?? null;
  }
}
