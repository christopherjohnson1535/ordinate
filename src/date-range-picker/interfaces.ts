// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface DateRangePickerProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The selected range, or `null` for none. An absolute range holds ISO dates, as
   * `YYYY-MM-DDTHH:mm:ss`, or `YYYY-MM-DD` with `dateOnly`. A relative range holds an amount and
   * a unit of time counted back from now, and the `key` of the option it came from, if any.
   * The picker is controlled: update this in `onChange`.
   */
  value: DateRangePickerProps.Value | null;
  /**
   * Called when the user applies a range or clears it, with the new value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>;
  /**
   * Ready-made relative ranges offered in relative mode, such as the last 24 hours. A custom
   * duration is always offered after them.
   */
  relativeOptions?: ReadonlyArray<DateRangePickerProps.RelativeOption>;
  /**
   * Which kinds of range the user may pick: both (`default`), or only absolute or only relative ones.
   */
  rangeSelectorMode?: DateRangePickerProps.RangeSelectorMode;
  /**
   * Checks a range before it is applied. Return `{ valid: false, errorMessage }` to keep the picker
   * open and show the message. Start and end are already checked to be complete and in order.
   */
  isValidRange?: (range: DateRangePickerProps.Value | null) => DateRangePickerProps.ValidationResult;
  /**
   * Called for each day shown in the calendar. Return `false` to disable it.
   */
  isDateEnabled?: (date: Date) => boolean;
  /**
   * Explains why a disabled day is disabled. It is read with the day by screen readers.
   */
  dateDisabledReason?: (date: Date) => string;
  /**
   * Which parts of the start and end times the user enters.
   */
  timeInputFormat?: DateRangePickerProps.TimeInputFormat;
  /**
   * Picks whole days without times. Absolute values are then `YYYY-MM-DD`, and relative units
   * start at days.
   */
  dateOnly?: boolean;
  /**
   * Shows a button in the popup that clears the value and closes it.
   */
  showClearButton?: boolean;
  /**
   * Text shown in the trigger while there is no value.
   */
  placeholder?: string;
  /**
   * The locale for month and weekday names and for the range shown in the trigger. Defaults to
   * the page's `lang`.
   */
  locale?: string;
  /**
   * The first day of the week in the calendar, from 0 for Sunday to 6 for Saturday.
   * Defaults to the locale's usual first day.
   */
  startOfWeek?: number;
  /**
   * Positions the popup against the viewport, so a container with hidden overflow, such as a
   * table or a modal, cannot clip it.
   */
  expandToViewport?: boolean;
  /**
   * Prevents opening the picker and removes it from the tab order.
   */
  disabled?: boolean;
  /**
   * Shows the value but prevents opening the picker.
   */
  readOnly?: boolean;
  /**
   * Accessible name of the trigger, for pickers without a visible label.
   */
  ariaLabel?: string;
  /**
   * Called when the trigger gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the trigger loses focus.
   */
  onBlur?: NonCancelableEventHandler;
  /**
   * Built-in labels and messages, to replace the English defaults.
   */
  i18nStrings?: DateRangePickerProps.I18nStrings;
}

export namespace DateRangePickerProps {
  export type Value = AbsoluteValue | RelativeValue;

  export interface AbsoluteValue {
    type: 'absolute';
    startDate: string;
    endDate: string;
  }

  export interface RelativeValue {
    type: 'relative';
    amount: number;
    unit: TimeUnit;
    /**
     * The key of the relative option the range came from. A custom duration has none.
     */
    key?: string;
  }

  export interface RelativeOption {
    key: string;
    amount: number;
    unit: TimeUnit;
    type: 'relative';
  }

  export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

  export type RangeSelectorMode = 'default' | 'absolute-only' | 'relative-only';

  export type TimeInputFormat = 'hh' | 'hh:mm' | 'hh:mm:ss';

  export type ValidationResult = { valid: true } | { valid: false; errorMessage: string };

  export interface ChangeDetail {
    value: Value | null;
  }

  export interface I18nStrings {
    /**
     * Accessible name of the popup.
     */
    dialogAriaLabel?: string;
    /**
     * Accessible name of the switch between relative and absolute mode.
     */
    modeSelectionLabel?: string;
    relativeModeTitle?: string;
    absoluteModeTitle?: string;
    /**
     * Label of the list of relative ranges.
     */
    relativeRangeSelectionHeading?: string;
    customRelativeRangeOptionLabel?: string;
    customRelativeRangeOptionDescription?: string;
    customRelativeRangeDurationLabel?: string;
    customRelativeRangeDurationPlaceholder?: string;
    customRelativeRangeUnitLabel?: string;
    /**
     * Writes a relative range, such as "Last 5 minutes", for the options and the trigger.
     */
    formatRelativeRange?: (value: RelativeValue) => string;
    /**
     * Writes a unit of time for the custom duration's unit list, such as "minutes".
     */
    formatUnit?: (unit: TimeUnit, amount: number) => string;
    startDateLabel?: string;
    endDateLabel?: string;
    startTimeLabel?: string;
    endTimeLabel?: string;
    /**
     * Placeholder of the date inputs.
     */
    datePlaceholder?: string;
    /**
     * Placeholder of the time inputs.
     */
    timePlaceholder?: string;
    /**
     * Explains the input formats under the inputs when there are no times.
     */
    dateConstraintText?: string;
    /**
     * Explains the input formats under the inputs when there are times.
     */
    dateTimeConstraintText?: string;
    previousMonthAriaLabel?: string;
    nextMonthAriaLabel?: string;
    /**
     * Read before today's date in the calendar.
     */
    todayAriaLabel?: string;
    applyButtonLabel?: string;
    cancelButtonLabel?: string;
    clearButtonLabel?: string;
    errorIconAriaLabel?: string;
    /**
     * Shown when the user applies without choosing a range.
     */
    noRangeSelectedErrorText?: string;
    /**
     * Shown when the user applies an absolute range with a missing or partial start or end.
     */
    incompleteRangeErrorText?: string;
    /**
     * Shown when the user applies an absolute range that ends before it starts.
     */
    endBeforeStartErrorText?: string;
    /**
     * Shown when the user applies a custom duration that is not a whole number of at least 1.
     */
    customDurationErrorText?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the trigger.
     */
    focus(): void;
  }
}
