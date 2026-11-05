// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface CheckboxProps extends BaseComponentProps, Omit<FormFieldControlProps, 'controlId' | 'invalid'> {
  /**
   * ID of the native control. Generated when not set, also inside a `FormField`, so that a field can hold
   * several of these controls.
   */
  controlId?: string;
  /**
   * Whether the checkbox is checked. The checkbox is controlled: update this in `onChange`.
   */
  checked: boolean;
  /**
   * Shows the checkbox as partly checked, for example when it selects a group whose items are only
   * partly selected. Works like the native `indeterminate` property and takes precedence over `checked`
   * in how the checkbox looks. Clicking an indeterminate checkbox reports `checked: true`.
   */
  indeterminate?: boolean;
  /**
   * Called when the user checks or clears the checkbox, with the new state in `event.detail`.
   */
  onChange?: NonCancelableEventHandler<CheckboxProps.ChangeDetail>;
  /**
   * The label shown next to the checkbox. Clicking it toggles the checkbox.
   */
  children?: React.ReactNode;
  /**
   * Text below the label that explains the option.
   */
  description?: React.ReactNode;
  /**
   * Prevents changes and removes the checkbox from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the checkbox focusable. If both `readOnly` and `disabled` are set,
   * `disabled` wins.
   */
  readOnly?: boolean;
  /**
   * The native `name` attribute, used in form submission.
   */
  name?: string;
  /**
   * Accessible name, for a checkbox without a visible label.
   */
  ariaLabel?: string;
  /**
   * Marks the checkbox as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * ID of the content the checkbox shows or hides, such as another form field.
   */
  ariaControls?: string;
  /**
   * Called when the checkbox gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the checkbox loses focus.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace CheckboxProps {
  export interface ChangeDetail {
    checked: boolean;
    /**
     * Always `false`: any change by the user ends the indeterminate state.
     */
    indeterminate: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the checkbox.
     */
    focus(): void;
  }
}
