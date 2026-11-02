// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../drawer/styles.css.js';

export default class DrawerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  /**
   * The reference above the title, set with `reference`.
   */
  findReference(): ElementWrapper | null {
    return this.findByClassName(styles.reference);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }

  /**
   * The loading indicator and its text, shown while `loading` is set.
   */
  findLoadingStatus(): ElementWrapper | null {
    return this.findByClassName(styles.loading);
  }
}
