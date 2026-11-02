// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../link/styles.css.js';

export default class LinkWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.link}`;

  /**
   * The diagonal leader of an external link, which carries the "opens in a new tab" label.
   */
  findExternalIcon(): ElementWrapper | null {
    return this.findByClassName(styles['external-leader']);
  }

  getHref(): string | null {
    return this.getElement().getAttribute('href');
  }
}
