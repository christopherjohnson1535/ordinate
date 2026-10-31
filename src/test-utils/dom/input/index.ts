// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../input/styles.css.js';

export default class InputWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName<HTMLInputElement>(styles.input)!;
  }

  /**
   * The clear button of a `search` input. It is only there while the input has a value.
   */
  findClearButton(): ButtonWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(`.${styles['clear-button']}`);
    return element ? new ButtonWrapper(element) : null;
  }

  findSearchIcon(): ElementWrapper | null {
    return this.findByClassName(styles['search-icon']);
  }

  findInlineLabel(): ElementWrapper<HTMLLabelElement> | null {
    return this.findByClassName<HTMLLabelElement>(styles['inline-label']);
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
