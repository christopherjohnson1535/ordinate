// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { PullQuoteProps } from './interfaces';

import styles from './styles.css.js';

export function InternalPullQuote({ children, attribution, variant = 'default', ...rest }: PullQuoteProps) {
  return (
    <figure {...rest} className={clsx(styles.root, styles[`variant-${variant}`])}>
      {variant === 'hanging' && (
        <span className={styles.mark} aria-hidden="true">
          {'“'}
        </span>
      )}
      <blockquote className={styles.quote}>{children}</blockquote>
      {attribution && <figcaption className={styles.attribution}>{attribution}</figcaption>}
    </figure>
  );
}
