// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import iconStyles from '../../../icon/styles.css.js';
import styles from '../../../link/styles.css.js';

export default class LinkWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.link}`;

  findExternalIcon(): ElementWrapper | null {
    return this.findByClassName(iconStyles.icon);
  }

  getHref(): string | null {
    return this.getElement().getAttribute('href');
  }
}
