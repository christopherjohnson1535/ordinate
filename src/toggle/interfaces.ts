// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface ToggleProps extends BaseComponentProps, Omit<FormFieldControlProps, 'controlId' | 'invalid'> {
  /**
   * ID of the native control. Generated when not set, also inside a `FormField`, so that a field can hold
   * several of these controls.
   */
  controlId?: string;
  /**
   * Whether the toggle is on. The toggle is controlled: update this in `onChange`.
   */
  checked: boolean;
  /**
   * Called when the user turns the toggle on or off, with the new state in `event.detail.checked`.
   */
  onChange?: NonCancelableEventHandler<ToggleProps.ChangeDetail>;
  /**
   * The label shown next to the toggle. Clicking it switches the toggle.
   */
  children?: React.ReactNode;
  /**
   * Text below the label that explains the setting.
   */
  description?: React.ReactNode;
  /**
   * Prevents changes and removes the toggle from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the toggle focusable. If both `readOnly` and `disabled` are set,
   * `disabled` wins.
   */
  readOnly?: boolean;
  /**
   * The native `name` attribute, used in form submission.
   */
  name?: string;
  /**
   * Accessible name, for a toggle without a visible label.
   */
  ariaLabel?: string;
  /**
   * ID of the content the toggle shows or hides, such as another form field.
   */
  ariaControls?: string;
  /**
   * Called when the toggle gains focus.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when the toggle loses focus.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace ToggleProps {
  export interface ChangeDetail {
    checked: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the toggle.
     */
    focus(): void;
  }
}
