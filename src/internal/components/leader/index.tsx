// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export interface LeaderProps {
  /**
   * `short` draws a shorter line, for the joins between breadcrumbs and other tight spots.
   */
  size?: 'normal' | 'short';
  className?: string;
}

/**
 * A leader line with an arrowhead, the mark that points a note at the part it describes. In Ordinate it means
 * "this goes somewhere else". It takes the text color and points the other way in right-to-left pages.
 * Drawing only, hidden from screen readers.
 */
export function Leader({ size = 'normal', className }: LeaderProps) {
  return (
    <svg
      className={clsx(styles.leader, styles[`size-${size}`], className)}
      viewBox={size === 'short' ? '0 0 16 12' : '0 0 28 12'}
      focusable="false"
      aria-hidden="true"
    >
      <path d={size === 'short' ? 'M1 6h13M10.5 2.5l3.5 3.5-3.5 3.5' : 'M1 6h25M21.5 2l4.5 4-4.5 4'} />
    </svg>
  );
}
