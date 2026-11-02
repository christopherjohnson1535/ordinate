// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { CalendarGridWrapper } from '../calendar';
import { ComponentWrapper, ElementWrapper } from '../core';
import DateInputWrapper from '../date-input';
import RadioGroupWrapper from '../radio-group';
import SegmentedControlWrapper from '../segmented-control';
import TimeInputWrapper from '../time-input';

import styles from '../../../date-range-picker/styles.css.js';
import dropdownStyles from '../../../internal/components/dropdown/styles.css.js';

export default class DateRangePickerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findTrigger(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles.trigger)!;
  }

  /**
   * Returns the text shown in the trigger: the formatted range or the placeholder.
   */
  getTriggerText(): string {
    return this.findTrigger().getText();
  }

  openDropdown(): void {
    this.findTrigger().click();
  }

  /**
   * Returns the popup while it is open.
   */
  findDropdown(): ElementWrapper | null {
    return this.findByClassName(dropdownStyles.popup);
  }

  findModeSwitch(): SegmentedControlWrapper | null {
    return this.findDropdown()?.findComponent(SegmentedControlWrapper) ?? null;
  }

  /**
   * Returns the month grids of absolute mode, with finders for days and the paging buttons.
   */
  findCalendar(): CalendarGridWrapper | null {
    const months = this.findByClassName(styles.months);
    return months ? new CalendarGridWrapper(months.getElement()) : null;
  }

  /**
   * Returns the length of the chosen or previewed range lettered under the months, such as "5 days".
   */
  findRangeLength(): ElementWrapper | null {
    return this.findByClassName(styles['range-length']);
  }

  findStartDateInput(): DateInputWrapper | null {
    return this.findPart(DateInputWrapper, styles['start-date']);
  }

  findStartTimeInput(): TimeInputWrapper | null {
    return this.findPart(TimeInputWrapper, styles['start-time']);
  }

  findEndDateInput(): DateInputWrapper | null {
    return this.findPart(DateInputWrapper, styles['end-date']);
  }

  findEndTimeInput(): TimeInputWrapper | null {
    return this.findPart(TimeInputWrapper, styles['end-time']);
  }

  /**
   * Returns the list of relative ranges in relative mode.
   */
  findRelativeRanges(): RadioGroupWrapper | null {
    const relative = this.findByClassName(styles.relative);
    return relative?.findComponent(RadioGroupWrapper) ?? null;
  }

  /**
   * Returns the custom duration's amount and unit fields while the custom range is chosen.
   */
  findCustomRange(): ElementWrapper | null {
    return this.findByClassName(styles.custom);
  }

  findValidationError(): ElementWrapper | null {
    return this.findByClassName(styles.error);
  }

  findApplyButton(): ButtonWrapper | null {
    return this.findAction(1);
  }

  findCancelButton(): ButtonWrapper | null {
    return this.findAction(2);
  }

  findClearButton(): ButtonWrapper | null {
    const element = this.findByClassName(styles.clear);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  private findPart<W extends ComponentWrapper>(
    Wrapper: { new (element: HTMLElement): W },
    className: string
  ): W | null {
    const element = this.findByClassName(className);
    return element ? new Wrapper(element.getElement()) : null;
  }

  // The actions are counted from the end, Apply last and Cancel before it, since the clear button is optional.
  private findAction(fromEnd: 1 | 2): ButtonWrapper | null {
    const actions = this.findByClassName(styles.actions);
    const buttons = actions ? actions.getElement().querySelectorAll<HTMLElement>(':scope > button') : [];
    const button = buttons[buttons.length - fromEnd];
    return button ? new ButtonWrapper(button) : null;
  }
}
