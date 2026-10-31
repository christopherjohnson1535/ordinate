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
   * Text below the label that explains what the field is for.
   */
  description?: React.ReactNode;
  /**
   * Text below the control describing the rules for its value, such as allowed characters.
   */
  constraintText?: React.ReactNode;
  /**
   * An error message shown below the control. Setting it marks the control as invalid.
   * Say what went wrong and how to fix it.
   */
  errorText?: React.ReactNode;
  /**
   * ID of the control. Generated when not set.
   */
  controlId?: string;
  /**
   * The control, for example an `Input`.
   */
  children?: React.ReactNode;
}
