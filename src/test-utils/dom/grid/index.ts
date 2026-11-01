// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../grid/styles.css.js';

export default class GridWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the cells, one per child, in the order of the children.
   */
  findColumns(): ElementWrapper[] {
    return this.findAll(`:scope > .${styles.grid} > .${styles.column}`);
  }
}
