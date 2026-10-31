// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface InputProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The current value. The input is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called on every change with the new value in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<InputProps.ChangeDetail>;
  /**
   * The native input type.
   */
  type?: InputProps.Type;
  /**
   * Hint text shown while the input is empty. Do not use it in place of a label.
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
   * `true` turns browser autocomplete on, `false` turns it off, and a string sets a specific hint such as `email`.
   */
  autoComplete?: boolean | string;
  /**
   * Called when the input gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the input loses focus.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace InputProps {
  export type Type = 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';

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
