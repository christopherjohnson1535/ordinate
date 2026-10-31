// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../internal/components/abstract-switch/styles.css.js';

/**
 * Parts shared by the checkbox, radio button and toggle wrappers.
 */
export class AbstractSwitchWrapper extends ComponentWrapper {
  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName<HTMLInputElement>(styles['native-input'])!;
  }

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  isChecked(): boolean {
    return this.findNativeInput().getElement().checked;
  }

  isDisabled(): boolean {
    return this.findNativeInput().getElement().disabled;
  }
}
