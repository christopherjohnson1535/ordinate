// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../container/styles.css.js';

export default class ContainerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.find(`:scope > .${styles.header}`);
  }

  /**
   * The plain text label drawn in the header when `header` is a string.
   */
  findHeaderLabel(): ElementWrapper | null {
    return this.find(`:scope > .${styles.header} > .${styles.label}`);
  }

  findContent(): ElementWrapper {
    return this.find(`:scope > .${styles.content}`)!;
  }

  findFooter(): ElementWrapper | null {
    return this.find(`:scope > .${styles.footer}`);
  }
}
