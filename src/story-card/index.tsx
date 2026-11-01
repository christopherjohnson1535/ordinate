// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { StoryCardProps } from './interfaces';
import { InternalStoryCard } from './internal';

export type { StoryCardProps };

/**
 * A teaser for an article or post: a title that links to it, with an optional picture, number,
 * kicker, summary and byline. It has no box, so it sits in columns and lists like print.
 */
export default function StoryCard({
  title,
  href,
  onFollow,
  summary,
  kicker,
  number,
  meta,
  media,
  headingLevel = 3,
  variant = 'default',
  ...props
}: StoryCardProps) {
  return (
    <InternalStoryCard
      {...getBaseProps(props)}
      title={title}
      href={href}
      onFollow={onFollow}
      summary={summary}
      kicker={kicker}
      number={number}
      meta={meta}
      media={media}
      headingLevel={headingLevel}
      variant={variant}
    />
  );
}
