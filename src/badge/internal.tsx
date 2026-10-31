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

export function InternalBadge({ color = 'grey', children, className, ...rest }: InternalBadgeProps) {
  return (
    <span {...rest} className={clsx(styles.badge, styles[`color-${color}`], className)}>
      {children}
    </span>
  );
}
