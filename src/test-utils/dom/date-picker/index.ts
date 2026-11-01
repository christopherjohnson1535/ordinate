// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import CalendarWrapper from '../calendar';
import { ComponentWrapper, ElementWrapper } from '../core';
import DateInputWrapper from '../date-input';

import styles from '../../../date-picker/styles.css.js';
import dropdownStyles from '../../../internal/components/dropdown/styles.css.js';

export default class DatePickerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findDateInput(): DateInputWrapper {
    return this.findComponent(DateInputWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findDateInput().findNativeInput();
  }

  findOpenCalendarButton(): ButtonWrapper {
    return new ButtonWrapper(this.findByClassName(styles['open-button'])!.getElement());
  }

  /**
   * Returns the popup while the calendar is open.
   */
  findDropdown(): ElementWrapper | null {
    return this.findByClassName(dropdownStyles.popup);
  }

  /**
   * Returns the calendar while it is open.
   */
  findCalendar(): CalendarWrapper | null {
    return this.findComponent(CalendarWrapper);
  }

  /**
   * Types a date into the input, firing `onChange`.
   */
  setInputValue(value: string): void {
    this.findDateInput().setInputValue(value);
  }

  getInputValue(): string {
    return this.findDateInput().getInputValue();
  }

  openCalendar(): void {
    this.findOpenCalendarButton().click();
  }
}
