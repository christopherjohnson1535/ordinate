// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface OpeningProps extends BaseComponentProps {
  /**
   * The layout of the opening.
   *
   * - `statement` sets one large sentence as the title, with a picture or drawing beside it.
   * - `split` puts the title, text and buttons on one side and a framed picture on the other.
   * - `masthead` sets the title very large between printed rules, like the front page of a journal.
   */
  variant?: OpeningProps.Variant;
  /**
   * The page title: the name of a journal, or one sentence that says what you do.
   */
  title: React.ReactNode;
  /**
   * A short line above the title, such as "Bicycle repairs in Leith".
   */
  kicker?: React.ReactNode;
  /**
   * Small facts set in a typewriter face, such as an issue number and a date. Several elements are
   * spaced out along the line.
   */
  meta?: React.ReactNode;
  /**
   * A sentence or two under the title.
   */
  description?: React.ReactNode;
  /**
   * Buttons under the text, usually one primary button and one quieter one.
   */
  actions?: React.ReactNode;
  /**
   * A row of links under the title, such as the sections of a journal.
   */
  links?: ReadonlyArray<OpeningProps.Link>;
  /**
   * The accessible name of the row of links.
   */
  navigationAriaLabel?: string;
  /**
   * Called when someone follows one of the `links` with a plain click. Call `preventDefault()` to
   * handle the navigation yourself, for example with a router.
   */
  onFollow?: CancelableEventHandler<OpeningProps.FollowDetail>;
  /**
   * A short note set in a marker-colored pill above the title, such as "Open Sundays".
   */
  badge?: React.ReactNode;
  /**
   * A picture, illustration or drawing beside the text, or below it in the masthead. Give images
   * alt text, and hide purely decorative drawings with `aria-hidden`.
   */
  media?: React.ReactNode;
  /**
   * A caption under the media, such as the title of a drawing and its scale.
   */
  mediaCaption?: React.ReactNode;
  /**
   * Which side the media sits on when there is room for two columns. Below the text otherwise.
   */
  mediaPosition?: OpeningProps.MediaPosition;
  /**
   * The level of the title. The opening usually holds the page's only level 1 heading.
   */
  headingLevel?: OpeningProps.HeadingLevel;
}

export namespace OpeningProps {
  export type Variant = 'statement' | 'split' | 'masthead';

  export type MediaPosition = 'start' | 'end';

  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export interface Link {
    /**
     * The text of the link.
     */
    text: string;
    /**
     * Where the link goes.
     */
    href: string;
    /**
     * Marks the link to the page being shown.
     */
    current?: boolean;
  }

  export interface FollowDetail {
    href: string;
    text: string;
  }
}
