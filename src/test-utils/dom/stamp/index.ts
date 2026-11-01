// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../stamp/styles.css.js';

type StampType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'draft';

const types: ReadonlyArray<StampType> = ['success', 'warning', 'error', 'info', 'neutral', 'draft'];

export default class StampWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.stamp}`;

  /**
   * The words on the stamp.
   */
  findText(): ElementWrapper {
    return this.findByClassName(styles.text)!;
  }

  getType(): StampType | null {
    return types.find(type => this.getElement().classList.contains(styles[`type-${type}`])) ?? null;
  }

  isRotated(): boolean {
    return this.getElement().classList.contains(styles['rotation-slight']);
  }
}
