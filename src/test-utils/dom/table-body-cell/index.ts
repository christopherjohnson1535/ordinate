// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import selectionStyles from '../../../internal/components/table-selection-control/styles.css.js';
import styles from '../../../table-body-cell/styles.css.js';

export default class TableBodyCellWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The checkbox or radio button of a selection cell.
   */
  findSelectionControl(): ElementWrapper<HTMLInputElement> | null {
    return this.find<HTMLInputElement>(`:scope > .${selectionStyles.root} input`);
  }

  /**
   * The circled tag of a row tag cell.
   */
  findRowTag(): ElementWrapper | null {
    return this.find(`:scope > .${styles.tag}`);
  }

  /**
   * Whether the cell is the header of its row.
   */
  isRowHeader(): boolean {
    return this.getElement().tagName === 'TH';
  }
}
