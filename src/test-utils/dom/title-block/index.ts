// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../title-block/styles.css.js';

export class TitleBlockItemWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.cell}`;

  findLabel(): ElementWrapper {
    return this.findByClassName(styles.label)!;
  }

  findValue(): ElementWrapper {
    return this.findByClassName(styles.value)!;
  }
}

export default class TitleBlockWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The cells of the block, in order.
   */
  findItems(): TitleBlockItemWrapper[] {
    return this.findAllComponents(TitleBlockItemWrapper);
  }

  /**
   * The cell with this label, or `null` when there is none.
   */
  findItemByLabel(label: string): TitleBlockItemWrapper | null {
    return this.findItems().find(item => item.findLabel().getText() === label) ?? null;
  }
}
