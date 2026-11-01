// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface StoryCardProps extends BaseComponentProps {
  /**
   * The headline of the story.
   */
  title: React.ReactNode;
  /**
   * Where the story lives. The title becomes the link, and a click anywhere on the card follows it.
   */
  href?: string;
  /**
   * Called when someone follows the title link with a plain click. Call `event.preventDefault()` to
   * handle the navigation yourself, for example with your site's router.
   */
  onFollow?: CancelableEventHandler<StoryCardProps.FollowDetail>;
  /**
   * One or two sentences that say what the story is about.
   */
  summary?: React.ReactNode;
  /**
   * A short label above the title, such as the section ("Field notes") or the reading time
   * ("6 min read").
   */
  kicker?: React.ReactNode;
  /**
   * A large ordinal drawn above the story, such as "02", for numbered lists like "Also in this issue".
   * It is decoration and is hidden from screen readers, so put the stories in an ordered list when
   * their order matters.
   */
  number?: string;
  /**
   * The byline under the summary, such as the author and the date. Links in it stay clickable on
   * their own.
   */
  meta?: React.ReactNode;
  /**
   * A picture above the story, usually a `Media`.
   */
  media?: React.ReactNode;
  /**
   * The heading level of the title, from 1 to 6. Pick the level that fits the page outline: stories
   * listed under an `h2` section heading use 3.
   */
  headingLevel?: StoryCardProps.HeadingLevel;
  /**
   * * `default` is a plain teaser with no box around it.
   * * `ruled` draws a rule above the story, for columns of stories.
   * * `feature` sets a larger title and summary, for the lead story.
   */
  variant?: StoryCardProps.Variant;
}

export namespace StoryCardProps {
  export type Variant = 'default' | 'ruled' | 'feature';
  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export interface FollowDetail {
    href: string;
  }
}
