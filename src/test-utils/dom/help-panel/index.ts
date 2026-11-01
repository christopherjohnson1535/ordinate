// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../help-panel/styles.css.js';

export default class HelpPanelWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
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
