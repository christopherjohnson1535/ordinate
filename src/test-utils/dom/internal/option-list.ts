// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import dropdownStyles from '../../../internal/components/dropdown/styles.css.js';
import optionListStyles from '../../../internal/components/option-list/styles.css.js';
import selectBaseStyles from '../../../internal/components/select-base/styles.css.js';

/**
 * Parts shared by the components that show a list of options in a popup: select, multiselect and autosuggest.
 */
export class OptionListWrapper extends ComponentWrapper {
  /**
   * Returns the popup while the list is open.
   */
  findDropdown(): ElementWrapper | null {
    return this.findByClassName(dropdownStyles.popup);
  }

  /**
   * Returns the options in the open list, in order, including disabled ones.
   */
  findOptions(): ElementWrapper[] {
    return this.findAllByClassName(optionListStyles.option);
  }

  findHighlightedOption(): ElementWrapper | null {
    return this.findByClassName(optionListStyles['option-highlighted']);
  }

  findGroups(): ElementWrapper[] {
    return this.findAllByClassName(optionListStyles['group-label']);
  }

  findStatus(): ElementWrapper | null {
    return this.findByClassName(optionListStyles.status);
  }

  findErrorRecoveryButton(): ButtonWrapper | null {
    const element = this.findByClassName(optionListStyles.recovery);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  protected findOption(indexOrValue: number | string): ElementWrapper {
    const options = this.findOptions();
    const option =
      typeof indexOrValue === 'number'
        ? options[indexOrValue - 1]
        : options.find(item => item.getElement().getAttribute('data-value') === indexOrValue);
    if (!option) {
      throw new Error(`No option ${typeof indexOrValue === 'number' ? 'at index' : 'with value'} ${indexOrValue}.`);
    }
    return option;
  }
}

/**
 * Parts shared by select and multiselect: a trigger button and an optional filter input.
 */
export class SelectBaseWrapper extends OptionListWrapper {
  findTrigger(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(selectBaseStyles.trigger)!;
  }

  findPlaceholder(): ElementWrapper | null {
    return this.findByClassName(selectBaseStyles.placeholder);
  }

  findFilteringInput(): ElementWrapper<HTMLInputElement> | null {
    return this.findByClassName<HTMLInputElement>(selectBaseStyles['filter-input']);
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
    this.findOption(indexOrValue).click();
  }
}
