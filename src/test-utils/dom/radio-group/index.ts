// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';
import RadioButtonWrapper from '../radio-button';

import styles from '../../../radio-group/styles.css.js';

export default class RadioGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findButtons(): RadioButtonWrapper[] {
    return this.findAllComponents(RadioButtonWrapper);
  }

  findInputByValue(value: string): ElementWrapper<HTMLInputElement> | null {
    const input = Array.from(this.getElement().querySelectorAll<HTMLInputElement>('input[type="radio"]')).find(
      element => element.value === value
    );
    return input ? new ElementWrapper(input) : null;
  }

  getSelectedValue(): string | null {
    return this.find<HTMLInputElement>('input[type="radio"]:checked')?.getElement().value ?? null;
  }
}
