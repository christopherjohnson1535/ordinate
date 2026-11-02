// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BadgeProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalBadgeProps extends BadgeProps {
  /**
   * Lets other components position the badge. Not part of the public API.
   */
  className?: string;
}

/**
 * A short label in mono capitals with a key square before it. The square carries the tone; the text stays in
 * ink. The square is drawing only, so the label reads the same to everyone.
 */
export function InternalBadge({ tone = 'neutral', children, className, ...rest }: InternalBadgeProps) {
  return (
    <span {...rest} className={clsx(styles.badge, styles[`tone-${tone}`], className)}>
      <span className={styles.key} aria-hidden="true" />
      {children}
    </span>
  );
}
