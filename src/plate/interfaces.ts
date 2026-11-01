// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface PlateProps extends BaseComponentProps {
  /**
   * The picture of the work, usually a `Media`.
   */
  media?: React.ReactNode;
  /**
   * A catalogue reference set in a typewriter face above the title, such as "Plate I" or "No. 14".
   */
  label?: React.ReactNode;
  /**
   * The name of the work or project.
   */
  title: React.ReactNode;
  /**
   * Where the project page lives. The title becomes the link, and a click anywhere on the plate
   * follows it.
   */
  href?: string;
  /**
   * Called when someone follows the title link with a plain click. Call `event.preventDefault()` to
   * handle the navigation yourself, for example with your site's router.
   */
  onFollow?: CancelableEventHandler<PlateProps.FollowDetail>;
  /**
   * Short facts shown across from the label, such as the place and the year ("Lisbon, 2025").
   */
  meta?: React.ReactNode;
  /**
   * A sentence or two about the work.
   */
  description?: React.ReactNode;
  /**
   * The heading level of the title, from 1 to 6. Pick the level that fits the page outline: plates
   * listed under an `h2` section heading use 3.
   */
  headingLevel?: PlateProps.HeadingLevel;
}

export namespace PlateProps {
  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export interface FollowDetail {
    href: string;
  }
}
