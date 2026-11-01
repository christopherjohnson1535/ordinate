// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TestimonialProps } from './interfaces';

import styles from './styles.css.js';

export function InternalTestimonial({ quote, name, detail, media, tone = 'default', ...rest }: TestimonialProps) {
  const hasPerson = Boolean(name || detail || media);
  return (
    <figure {...rest} className={clsx(styles.root, styles[`tone-${tone}`])}>
      <span className={styles.mark} aria-hidden="true">
        {'“'}
      </span>
      <blockquote className={styles.quote}>{quote}</blockquote>
      {hasPerson && (
        <figcaption className={styles.person}>
          {media && <span className={styles.media}>{media}</span>}
          {(name || detail) && (
            <span className={styles.who}>
              {name && <span className={styles.name}>{name}</span>}
              {name && detail && ' '}
              {detail && <span className={styles.detail}>{detail}</span>}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
