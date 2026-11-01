// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';

import styles from '../../../toggle-button/styles.css.js';

export default class ToggleButtonWrapper extends ButtonWrapper {
  static rootSelector = `.${styles['toggle-button']}`;

  isPressed(): boolean {
    return this.getElement().getAttribute('aria-pressed') === 'true';
  }
}
