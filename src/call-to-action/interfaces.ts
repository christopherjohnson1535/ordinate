// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface CallToActionProps extends BaseComponentProps {
  /**
   * What you are asking people to do, such as "Book a table for Friday".
   */
  heading?: React.ReactNode;
  /**
   * A short line that gives a reason to act.
   */
  description?: React.ReactNode;
  /**
   * The one thing to do, usually a primary button, sometimes with a quieter second option.
   */
  actions?: React.ReactNode;
  /**
   * Richer content shown where the actions go, such as a short sign-up form with an email field
   * and a button.
   */
  children?: React.ReactNode;
  /**
   * The background of the band.
   *
   * - `inverted` uses dark ink with light text, so the band stands out from the page.
   * - `accent` uses a soft tint.
   * - `default` uses the page background.
   */
  tone?: CallToActionProps.Tone;
  /**
   * The heading level, so the page reads in order.
   */
  headingLevel?: CallToActionProps.HeadingLevel;
}

export namespace CallToActionProps {
  export type Tone = 'inverted' | 'accent' | 'default';

  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
}
