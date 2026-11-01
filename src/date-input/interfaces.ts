// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface DateInputProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The date as `YYYY-MM-DD`, or `YYYY-MM` with month granularity. While the user types, the value
   * can be partial, such as `2026-03`, so check that it is complete before using it.
   * The input is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called on every change with the new value, complete or partial, in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<DateInputProps.ChangeDetail>;
  /**
   * Whether the input takes a whole date or only a year and month.
   */
  granularity?: DateInputProps.Granularity;
  /**
   * Hint text shown while the input is empty, usually the expected format such as `YYYY/MM/DD`.
   */
  placeholder?: string;
  /**
   * Prevents changes and removes the input from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the value focusable and selectable.
   */
  readOnly?: boolean;
  /**
   * Focuses the input when it first renders.
   */
  autoFocus?: boolean;
  /**
   * Accessible name, for inputs without a visible label.
   */
  ariaLabel?: string;
  /**
   * Marks the input as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * The native `name` attribute.
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
}

export namespace DateInputProps {
  export type Granularity = 'day' | 'month';

  export interface ChangeDetail {
    value: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the input.
     */
    focus(): void;
    /**
     * Selects all of the input's text.
     */
    select(): void;
  }
}
