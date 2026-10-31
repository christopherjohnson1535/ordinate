// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../space-between/styles.css.js';

export default class SpaceBetweenWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the slot around each item, in order.
   */
  findItems(): ElementWrapper[] {
    return this.findAll(`:scope > .${styles.child}`);
  }
}
