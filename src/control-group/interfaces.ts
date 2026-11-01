// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface ControlGroupProps extends BaseComponentProps {
  /**
   * The controls to join, such as an `Input` followed by a `Select` or a `Button`. They sit in one row
   * and share their inner borders, so the group reads as a single field. Text fields and selects share
   * the free width; buttons keep their natural width.
   *
   * Inside a `FormField`, the first control takes the field's label as its own, and every control
   * picks up the field's description and validation state.
   */
  children?: React.ReactNode;
  /**
   * Accessible name of the group, for a group without a visible label.
   */
  ariaLabel?: string;
  /**
   * IDs of the elements that label the group. Inside a `FormField`, the group is labelled by the
   * field's label unless you set this or `ariaLabel`.
   */
  ariaLabelledby?: string;
  /**
   * IDs of the elements that describe the group.
   */
  ariaDescribedby?: string;
}
