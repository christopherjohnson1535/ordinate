// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface RadioButtonProps extends BaseComponentProps, Omit<FormFieldControlProps, 'controlId' | 'invalid'> {
  /**
   * ID of the native control. Generated when not set, also inside a `FormField`, so that a field can hold
   * several of these controls.
   */
  controlId?: string;
  /**
   * Whether the radio button is selected. The radio button is controlled: set this in `onSelect`.
   */
  checked: boolean;
  /**
   * Name of the group the radio button belongs to. Radio buttons with the same name form one group
   * that the arrow keys move through.
   */
  name: string;
  /**
   * The native `value` attribute, sent with the form when the radio button is selected.
   */
  value?: string;
  /**
   * Called when the user selects the radio button.
   */
  onSelect?: NonCancelableEventHandler;
  /**
   * The label shown next to the radio button. Clicking it selects the radio button.
   */
  children?: React.ReactNode;
  /**
   * Text below the label that explains the option.
   */
  description?: React.ReactNode;
  /**
   * Prevents selection and removes the radio button from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents selection but keeps the radio button focusable. Set it on every radio button in a group
   * or on none of them.
   */
  readOnly?: boolean;
  /**
   * Accessible name, for a radio button without a visible label.
   */
  ariaLabel?: string;
}

export namespace RadioButtonProps {
  export interface Ref {
    /**
     * Moves keyboard focus to the radio button.
     */
    focus(): void;
  }
}
