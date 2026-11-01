// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../header/styles.css.js';

export default class HeaderWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the heading text, without the counter.
   */
  findHeadingText(): ElementWrapper {
    return this.findByClassName(styles['heading-text'])!;
  }

  /**
   * The sheet code shown above the heading.
   */
  findCode(): ElementWrapper | null {
    return this.findByClassName(styles.code);
  }

  findCounter(): ElementWrapper | null {
    return this.findByClassName(styles.counter);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }
}
