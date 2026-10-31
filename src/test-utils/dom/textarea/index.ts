// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../textarea/styles.css.js';

export default class TextareaWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findNativeTextarea(): ElementWrapper<HTMLTextAreaElement> {
    return this.findByClassName<HTMLTextAreaElement>(styles.textarea)!;
  }

  /**
   * Types a new value into the textarea, firing `onChange`.
   */
  setTextareaValue(value: string): void {
    this.findNativeTextarea().setNativeValue(value);
  }

  getTextareaValue(): string {
    return this.findNativeTextarea().getElement().value;
  }
}
