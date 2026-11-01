// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../column-layout/styles.css.js';

export default class ColumnLayoutWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the cells, one per child, in reading order.
   */
  findItems(): ElementWrapper[] {
    return this.findAll(`:scope > .${styles.item}`);
  }

  /**
   * Returns how many columns the layout currently shows.
   */
  getColumnCount(): number {
    return Number(this.getElement().dataset.columnCount);
  }
}
