// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../divider/styles.css.js';

export default class DividerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.divider}`;

  /**
   * Returns the label, or `null` when the divider has none.
   */
  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }
}
