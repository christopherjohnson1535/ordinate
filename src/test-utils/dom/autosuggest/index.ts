// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '../core';
import { OptionListWrapper } from '../internal/option-list';

import styles from '../../../autosuggest/styles.css.js';
import inputStyles from '../../../input/styles.css.js';
import optionListStyles from '../../../internal/components/option-list/styles.css.js';

export default class AutosuggestWrapper extends OptionListWrapper {
  static rootSelector = `.${styles.root}`;

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName<HTMLInputElement>(inputStyles.input)!;
  }

  /**
   * Returns the option that uses the text as typed, while the list is open.
   */
  findEnteredTextOption(): ElementWrapper | null {
    return this.findByClassName(optionListStyles['option-extra']);
  }

  isOpen(): boolean {
    return this.findNativeInput().getElement().getAttribute('aria-expanded') === 'true';
  }

  /**
   * Types a new value into the input, firing `onChange` and opening the list.
   */
  setInputValue(value: string): void {
    this.findNativeInput().setNativeValue(value);
  }

  focus(): void {
    this.findNativeInput().focus();
  }

  /**
   * Clicks a suggestion in the open list. A number picks the option at that index, counting from 1 and
   * including the entered text option. A string picks the suggestion with that value.
   */
  selectSuggestion(indexOrValue: number | string): void {
    this.findOption(indexOrValue).click();
  }
}
