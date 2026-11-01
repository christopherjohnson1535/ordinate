// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import InputWrapper from '../input';

import styles from '../../../text-filter/styles.css.js';

export default class TextFilterWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private get input(): InputWrapper {
    return this.findComponent(InputWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.input.findNativeInput();
  }

  /**
   * The clear button. It is only there while the filter has text.
   */
  findClearButton(): ButtonWrapper | null {
    return this.input.findClearButton();
  }

  /**
   * The result count, while the filter has text and `countText` is set.
   */
  findResultsCount(): ElementWrapper | null {
    const count = this.findByClassName(styles.count);
    return count && count.getText() !== '' ? count : null;
  }

  /**
   * Types new text into the filter, firing `onChange` and, after a pause, `onDelayedChange`.
   */
  setInputValue(value: string): void {
    this.input.setInputValue(value);
  }

  focus(): void {
    this.input.focus();
  }
}
