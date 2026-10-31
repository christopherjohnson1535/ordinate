// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AbstractSwitchWrapper } from '../internal/abstract-switch';

import styles from '../../../checkbox/styles.css.js';

export default class CheckboxWrapper extends AbstractSwitchWrapper {
  static rootSelector = `.${styles.root}`;

  isIndeterminate(): boolean {
    return this.findNativeInput().getElement().indeterminate;
  }
}
