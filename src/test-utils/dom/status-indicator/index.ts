// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../status-indicator/styles.css.js';

export default class StatusIndicatorWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findStatusIcon(): ElementWrapper {
    return this.findByClassName(styles.icon)!;
  }

  findText(): ElementWrapper {
    return this.findByClassName(styles.text)!;
  }
}
