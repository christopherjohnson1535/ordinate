// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface HowItWorksProps extends BaseComponentProps {
  /**
   * The steps of the process, in order, such as "Book a slot", "Drop off your bike" and "Ride home".
   * Each step has:
   * * `title`: the step in a few words. It is a heading.
   * * `description` (optional): a sentence or two on what happens.
   * * `media` (optional): an image or illustration for the step. Give it its own alt text, or an empty
   *   one if it only decorates.
   */
  steps: ReadonlyArray<HowItWorksProps.Step>;
  /**
   * The level of each step's title, from 1 to 6. The default, 3, suits steps placed under a section
   * heading at level 2.
   */
  headingLevel?: HowItWorksProps.HeadingLevel;
  /**
   * `horizontal` sets the steps side by side, and stacks them where there is no room. `vertical`
   * always stacks them, with the number beside each step.
   */
  orientation?: HowItWorksProps.Orientation;
  /**
   * Accessible name for the list of steps, when no heading nearby says what the process is.
   */
  ariaLabel?: string;
}

export namespace HowItWorksProps {
  export interface Step {
    title: React.ReactNode;
    description?: React.ReactNode;
    media?: React.ReactNode;
  }

  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export type Orientation = 'horizontal' | 'vertical';
}
