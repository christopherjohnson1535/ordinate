// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import selectionStyles from '../../../internal/components/table-selection-control/styles.css.js';
import styles from '../../../table-row/styles.css.js';

export default class TableRowWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The cells of the row, header cells included.
   */
  findCells(): ElementWrapper<HTMLTableCellElement>[] {
    return this.findAll<HTMLTableCellElement>(':scope > td, :scope > th');
  }

  /**
   * The checkbox or radio button that selects the row.
   */
  findSelectionControl(): ElementWrapper<HTMLInputElement> | null {
    return this.find<HTMLInputElement>(`:scope > * > .${selectionStyles.root} input`);
  }

  isSelected(): boolean {
    return this.getElement().classList.contains(styles.selected);
  }
}
