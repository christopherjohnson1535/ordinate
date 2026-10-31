// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../alert/styles.css.js';

export default class AlertWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.alert}`;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findActionSlot(): ElementWrapper | null {
    return this.findByClassName(styles['action-slot']);
  }

  /**
   * Returns the close button, which is only rendered when the alert is `dismissible`.
   */
  findDismissButton(): ButtonWrapper | null {
    return this.findByClassName(styles.dismiss)?.findComponent(ButtonWrapper) ?? null;
  }
}
