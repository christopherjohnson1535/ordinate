// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface CalendarProps extends BaseComponentProps {
  /**
   * The selected date as `YYYY-MM-DD`, or `YYYY-MM` with month granularity. An empty or partial
   * value selects nothing. The calendar is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called when the user picks a date, with the new value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<CalendarProps.ChangeDetail>;
  /**
   * Called for each day, or each month with month granularity. Return `false` to disable it.
   * Disabled dates can still take focus, so the user can read why they are disabled.
   */
  isDateEnabled?: (date: Date) => boolean;
  /**
   * Explains why a disabled date is disabled. The text is shown under the grid while the date has
   * focus or is under the pointer, and is read with the date by screen readers.
   */
  dateDisabledReason?: (date: Date) => string;
  /**
   * The locale for month and weekday names, such as `de-DE`. Defaults to the page's `lang`, then
   * the browser's language.
   */
  locale?: string;
  /**
   * The first day of the week, from 0 for Sunday to 6 for Saturday. Defaults to the locale's usual first day.
   */
  startOfWeek?: number;
  /**
   * Whether the user picks a day or a month.
   */
  granularity?: CalendarProps.Granularity;
  /**
   * IDs of the elements that label the calendar.
   */
  ariaLabelledby?: string;
  /**
   * IDs of the elements that describe the calendar.
   */
  ariaDescribedby?: string;
  /**
   * Accessible name, for calendars without a visible label.
   */
  ariaLabel?: string;
  /**
   * Built-in labels, to replace the English defaults.
   */
  i18nStrings?: CalendarProps.I18nStrings;
}

export namespace CalendarProps {
  export type Granularity = 'day' | 'month';

  export interface ChangeDetail {
    value: string;
  }

  export interface I18nStrings {
    /**
     * Accessible name of the button that shows the previous month.
     */
    previousMonthAriaLabel?: string;
    /**
     * Accessible name of the button that shows the next month.
     */
    nextMonthAriaLabel?: string;
    /**
     * Accessible name of the button that shows the previous year, with month granularity.
     */
    previousYearAriaLabel?: string;
    /**
     * Accessible name of the button that shows the next year, with month granularity.
     */
    nextYearAriaLabel?: string;
    /**
     * Read before today's date, such as "Today".
     */
    todayAriaLabel?: string;
    /**
     * Read before the current month with month granularity, such as "This month".
     */
    currentMonthAriaLabel?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the focused date in the grid.
     */
    focus(): void;
  }
}
