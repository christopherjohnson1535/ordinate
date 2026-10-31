// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '../core';

import styles from '../../../button/styles.css.js';

export default class ButtonWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.button}`;

  isDisabled(): boolean {
    const element = this.getElement();
    return element instanceof HTMLButtonElement ? element.disabled : element.getAttribute('aria-disabled') === 'true';
  }
}
