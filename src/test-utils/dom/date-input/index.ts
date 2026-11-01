// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../date-input/styles.css.js';
import inputStyles from '../../../input/styles.css.js';

export default class DateInputWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName<HTMLInputElement>(inputStyles.input)!;
  }

  /**
   * Enters text as autofill or a paste would, firing `onChange` with the text brought into the
   * `YYYY-MM-DD` form. Separators may be `-` or `/`.
   */
  setInputValue(value: string): void {
    this.findNativeInput().setNativeValue(value);
  }

  /**
   * Types characters one by one at the end of the current text, as a user would.
   */
  typeText(text: string): void {
    const input = this.findNativeInput();
    const element = input.getElement();
    for (const key of Array.from(text)) {
      element.setSelectionRange(element.value.length, element.value.length);
      input.keydown(key);
    }
  }

  getInputValue(): string {
    return this.findNativeInput().getElement().value;
  }

  isDisabled(): boolean {
    return this.findNativeInput().getElement().disabled;
  }

  isReadOnly(): boolean {
    return this.findNativeInput().getElement().readOnly;
  }

  focus(): void {
    this.findNativeInput().focus();
  }

  blur(): void {
    this.findNativeInput().blur();
  }
}
