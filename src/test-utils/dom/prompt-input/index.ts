// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../prompt-input/styles.css.js';

export default class PromptInputWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findNativeTextarea(): ElementWrapper<HTMLTextAreaElement> {
    return this.findByClassName<HTMLTextAreaElement>(styles.textarea)!;
  }

  /**
   * The button that sends the prompt.
   */
  findActionButton(): ButtonWrapper {
    return new ButtonWrapper(this.getElement().querySelector<HTMLElement>(`.${styles['action-button']}`)!);
  }

  /**
   * The slot above the text, set with `secondaryContent`.
   */
  findSecondaryContent(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-content']);
  }

  /**
   * The slot below the text, set with `secondaryActions`.
   */
  findSecondaryActions(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-actions']);
  }

  /**
   * Types a new value into the prompt, firing `onChange`.
   */
  setTextareaValue(value: string): void {
    this.findNativeTextarea().setNativeValue(value);
  }

  getTextareaValue(): string {
    return this.findNativeTextarea().getElement().value;
  }

  /**
   * Presses Enter in the prompt, which sends it unless `shiftKey` is set.
   */
  pressEnter(init: KeyboardEventInit = {}): void {
    this.findNativeTextarea().keydown('Enter', init);
  }

  isDisabled(): boolean {
    return this.findNativeTextarea().getElement().disabled;
  }

  isReadOnly(): boolean {
    return this.findNativeTextarea().getElement().readOnly;
  }

  focus(): void {
    this.findNativeTextarea().focus();
  }
}
