// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface FormFieldProps extends BaseComponentProps {
  /**
   * The label of the field. Keep it short and in sentence case.
   */
  label?: React.ReactNode;
  /**
   * Content beside the label, usually a link to help about the field.
   */
  info?: React.ReactNode;
  /**
   * Text below the label that explains what the field is for.
   */
  description?: React.ReactNode;
  /**
   * Text below the control describing the rules for its value, such as allowed characters.
   */
  constraintText?: React.ReactNode;
  /**
   * A count of characters used or left, such as "12 of 64 characters", shown after the constraint text.
   * Update it on every change: screen readers hear it after typing pauses for a second.
   */
  characterCountText?: string;
  /**
   * An error message shown below the control. Setting it marks the control as invalid.
   * Say what went wrong and how to fix it.
   */
  errorText?: React.ReactNode;
  /**
   * A warning shown below the control, for a value that is allowed but probably not intended.
   * It is not shown while `errorText` is set.
   */
  warningText?: React.ReactNode;
  /**
   * What screen readers hear for the error icon.
   */
  errorIconAriaLabel?: string;
  /**
   * What screen readers hear for the warning icon.
   */
  warningIconAriaLabel?: string;
  /**
   * ID of the control. Generated when not set.
   */
  controlId?: string;
  /**
   * Makes the control take the full width of the field. By default it takes three quarters of the width,
   * and `secondaryControl` takes the rest. When stretched, the secondary control goes below it.
   */
  stretch?: boolean;
  /**
   * The control, for example an `Input`.
   */
  children?: React.ReactNode;
  /**
   * A second control or content beside the main control, such as a button that acts on its value.
   */
  secondaryControl?: React.ReactNode;
}
