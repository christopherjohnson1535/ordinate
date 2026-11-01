// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { StatusIndicatorProps } from '../status-indicator/interfaces';

export interface StepsProps extends BaseComponentProps {
  /**
   * The steps, in order. Each one shows a status icon, a header and optional details below it.
   */
  steps: ReadonlyArray<StepsProps.Step>;
  /**
   * `vertical` stacks the steps with a line running down between their icons. `horizontal`
   * places them side by side with the line running across, for a short sequence in a wide space.
   */
  orientation?: StepsProps.Orientation;
  /**
   * Accessible name of the list of steps, such as "Deployment progress".
   */
  ariaLabel?: string;
  /**
   * ID of an element that names the list of steps, such as a heading above it.
   */
  ariaLabelledby?: string;
}

export namespace StepsProps {
  export type Orientation = 'vertical' | 'horizontal';

  export interface Step {
    /**
     * The name of the step, such as "Build image".
     */
    header: React.ReactNode;
    /**
     * Where the step stands. It sets the icon and its color, as in a status indicator. The line
     * leading into a `pending` step is dashed, to show the part of the sequence not reached yet.
     */
    status: StatusIndicatorProps.Type;
    /**
     * Accessible name of the status icon, such as "Completed". Set it when the header does not
     * say how the step went.
     */
    statusIconAriaLabel?: string;
    /**
     * More about the step, shown below the header, such as a time or an error message.
     */
    details?: React.ReactNode;
  }
}
