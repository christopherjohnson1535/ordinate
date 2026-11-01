// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Heading } from '../internal/components/heading';
import { raiseInteractiveClassName, StretchedLink } from '../internal/components/stretched-link';
import { fireCancelableEvent } from '../internal/events';
import { PlateProps } from './interfaces';

import styles from './styles.css.js';

export function InternalPlate({
  media,
  label,
  title,
  href,
  onFollow,
  meta,
  description,
  headingLevel = 3,
  ...rest
}: PlateProps) {
  return (
    <article {...rest} className={clsx(styles.root, href && styles.linked)}>
      {media && <div className={styles.media}>{media}</div>}
      <div className={styles.caption}>
        {(label || meta) && (
          <div className={styles.line}>
            {label && <span className={styles.label}>{label}</span>}
            {label && meta && ' '}
            {meta && <span className={clsx(styles.meta, raiseInteractiveClassName)}>{meta}</span>}
          </div>
        )}
        <Heading level={headingLevel} defaultLevel={3} className={styles.title}>
          {href ? (
            <StretchedLink href={href} onFollow={event => fireCancelableEvent(onFollow, { href }, event)}>
              {title}
            </StretchedLink>
          ) : (
            title
          )}
        </Heading>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </article>
  );
}
