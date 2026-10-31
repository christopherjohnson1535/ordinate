// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import dropdownStyles from '../../../internal/components/dropdown/styles.css.js';
import selectStyles from '../../../select/styles.css.js';

export default class SelectWrapper extends ComponentWrapper {
  static rootSelector = `.${selectStyles.root}`;

  findTrigger(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(selectStyles.trigger)!;
  }

  findPlaceholder(): ElementWrapper | null {
    return this.findByClassName(selectStyles.placeholder);
  }

  /**
   * Returns the popup while the select is open.
   */
  findDropdown(): ElementWrapper | null {
    return this.findByClassName(dropdownStyles.popup);
  }

  findFilteringInput(): ElementWrapper<HTMLInputElement> | null {
    return this.findByClassName<HTMLInputElement>(selectStyles['filter-input']);
  }

  /**
   * Returns the options in the open list, in order, including disabled ones.
   */
  findOptions(): ElementWrapper[] {
    return this.findAllByClassName(selectStyles.option);
  }

  findSelectedOption(): ElementWrapper | null {
    return this.findByClassName(selectStyles['option-selected']);
  }

  findHighlightedOption(): ElementWrapper | null {
    return this.findByClassName(selectStyles['option-highlighted']);
  }

  findGroups(): ElementWrapper[] {
    return this.findAllByClassName(selectStyles['group-label']);
  }

  findStatus(): ElementWrapper | null {
    return this.findByClassName(selectStyles.status);
  }

  findErrorRecoveryButton(): ButtonWrapper | null {
    const element = this.findByClassName(selectStyles.recovery);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  isOpen(): boolean {
    return this.findTrigger().getElement().getAttribute('aria-expanded') === 'true';
  }

  isDisabled(): boolean {
    return this.findTrigger().getElement().disabled;
  }

  /**
   * Opens the list by clicking the trigger, unless it is already open.
   */
  openDropdown(): void {
    if (!this.isOpen()) {
      this.findTrigger().click();
    }
  }

  /**
   * Opens the list and clicks an option. A number picks the option at that index, counting
   * from 1 as a person would. A string picks the option with that value.
   */
  selectOption(indexOrValue: number | string): void {
    this.openDropdown();
    const option =
      typeof indexOrValue === 'number'
        ? this.findOptions()[indexOrValue - 1]
        : this.findOptions().find(item => item.getElement().getAttribute('data-value') === indexOrValue);
    if (!option) {
      throw new Error(`No option ${typeof indexOrValue === 'number' ? 'at index' : 'with value'} ${indexOrValue}.`);
    }
    option.click();
  }
}
