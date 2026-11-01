// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface TimeInputProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The time as `HH`, `HH:mm` or `HH:mm:ss`, matching `format`. While the user types, the value can
   * be partial, such as `14:3`, so check that it is complete before using it.
   * The input is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called on every change with the new value, complete or partial, in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<TimeInputProps.ChangeDetail>;
  /**
   * Which parts of the time the user enters.
   */
  format?: TimeInputProps.Format;
  /**
   * Whether hours run from 00 to 23. When `false`, hours run from 01 to 12 and the value has no
   * AM or PM part, so pair the input with a control for that when the time of day matters.
   */
  use24Hour?: boolean;
  /**
   * Hint text shown while the input is empty, usually the expected format such as `hh:mm:ss`.
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

export namespace TimeInputProps {
  export type Format = 'hh' | 'hh:mm' | 'hh:mm:ss';

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
