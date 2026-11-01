// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../control-group/styles.css.js';

export default class ControlGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the cells that hold the grouped controls, in order.
   */
  findItems(): ElementWrapper[] {
    return this.findAll(`:scope > .${styles.item}`);
  }

  /**
   * Returns the cell of the control at a position, counting from 1.
   */
  findItem(position: number): ElementWrapper | null {
    return this.findItems()[position - 1] ?? null;
  }
}
