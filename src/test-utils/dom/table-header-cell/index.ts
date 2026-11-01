// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../table-header-cell/styles.css.js';

export default class TableHeaderCellWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The button that sorts by this column, or `null` when the column cannot be sorted.
   */
  findSortingButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.find<HTMLButtonElement>(`.${styles['sorting-button']}`);
  }

  /**
   * The current order of a sortable column, from its `aria-sort` attribute: `ascending`, `descending`
   * or `none`. `null` when the column cannot be sorted.
   */
  getSortingState(): string | null {
    return this.getElement().getAttribute('aria-sort');
  }

  findResizer(): ElementWrapper | null {
    return this.find(`.${styles.resizer}`);
  }

  /**
   * The select-all checkbox of a selection column heading.
   */
  findSelectionControl(): ElementWrapper<HTMLInputElement> | null {
    return this.find<HTMLInputElement>(':scope input');
  }
}
