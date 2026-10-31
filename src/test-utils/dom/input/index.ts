// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../input/styles.css.js';

export default class InputWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName<HTMLInputElement>(styles.input)!;
  }

  /**
   * Types a new value into the input, firing `onChange`.
   */
  setInputValue(value: string): void {
    this.findNativeInput().setNativeValue(value);
  }

  getInputValue(): string {
    return this.findNativeInput().getElement().value;
  }
}
