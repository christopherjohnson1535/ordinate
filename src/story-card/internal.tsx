// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Heading } from '../internal/components/heading';
import { raiseInteractiveClassName, StretchedLink } from '../internal/components/stretched-link';
import { fireCancelableEvent } from '../internal/events';
import { StoryCardProps } from './interfaces';

import styles from './styles.css.js';

export function InternalStoryCard({
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
  ...rest
}: StoryCardProps) {
  return (
    <article {...rest} className={clsx(styles.root, styles[`variant-${variant}`], href && styles.linked)}>
      {media && <div className={styles.media}>{media}</div>}
      {number && (
        <div className={styles.number} aria-hidden="true">
          {number}
        </div>
      )}
      {kicker && <div className={clsx(styles.kicker, raiseInteractiveClassName)}>{kicker}</div>}
      <Heading level={headingLevel} className={styles.title}>
        {href ? (
          <StretchedLink href={href} onFollow={event => fireCancelableEvent(onFollow, { href }, event)}>
            {title}
          </StretchedLink>
        ) : (
          title
        )}
      </Heading>
      {summary && <div className={styles.summary}>{summary}</div>}
      {meta && <div className={clsx(styles.meta, raiseInteractiveClassName)}>{meta}</div>}
    </article>
  );
}
