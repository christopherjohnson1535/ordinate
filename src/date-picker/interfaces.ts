// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CalendarProps } from '../calendar/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface DatePickerProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The date as `YYYY-MM-DD`, or `YYYY-MM` with month granularity. While the user types, the value
   * can be partial, so check that it is complete before using it.
   * The picker is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called when the user types in the input or picks a date in the calendar, with the new value
   * in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<DatePickerProps.ChangeDetail>;
  /**
   * Called for each day, or each month with month granularity, shown in the calendar. Return
   * `false` to disable it. Typed values are not checked, so validate them as well.
   */
  isDateEnabled?: (date: Date) => boolean;
  /**
   * Explains why a disabled date is disabled, shown in the calendar.
   */
  dateDisabledReason?: (date: Date) => string;
  /**
   * Whether the user picks a day or a month.
   */
  granularity?: DatePickerProps.Granularity;
  /**
   * Hint text shown while the input is empty, usually the expected format such as `YYYY/MM/DD`.
   */
  placeholder?: string;
  /**
   * Accessible name of the button that opens the calendar. By default it names the selected date too.
   */
  openCalendarAriaLabel?: string;
  /**
   * The locale for the calendar's month and weekday names. Defaults to the page's `lang`.
   */
  locale?: string;
  /**
   * The first day of the week in the calendar, from 0 for Sunday to 6 for Saturday.
   * Defaults to the locale's usual first day.
   */
  startOfWeek?: number;
  /**
   * Positions the calendar against the viewport, so a container with hidden overflow, such as a
   * table or a modal, cannot clip it.
   */
  expandToViewport?: boolean;
  /**
   * Prevents changes and removes the picker from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the value focusable and selectable. The calendar cannot be opened.
   */
  readOnly?: boolean;
  /**
   * Focuses the input when it first renders.
   */
  autoFocus?: boolean;
  /**
   * Accessible name of the input, for pickers without a visible label.
   */
  ariaLabel?: string;
  /**
   * Marks the input as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * The native `name` attribute of the input.
   */
  name?: string;
  /**
   * Called when the input gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the input loses focus.
   */
  onBlur?: NonCancelableEventHandler;
  /**
   * Built-in labels of the calendar, to replace the English defaults.
   */
  i18nStrings?: CalendarProps.I18nStrings;
}

export namespace DatePickerProps {
  export type Granularity = 'day' | 'month';

  export interface ChangeDetail {
    value: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the input.
     */
    focus(): void;
  }
}
