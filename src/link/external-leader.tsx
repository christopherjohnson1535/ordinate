// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export interface ExternalLeaderProps {
  /**
   * What screen readers hear in place of the arrow, such as "Opens in a new tab". Without it the arrow is hidden
   * from screen readers.
   */
  ariaLabel?: string;
  className?: string;
}

/**
 * A short diagonal leader, the mark for a link that leaves the application. It is drawn with the same strokes
 * as `Leader`, as tall as the capitals of the text beside it, and points the other way in right-to-left pages.
 */
export function ExternalLeader({ ariaLabel, className }: ExternalLeaderProps) {
  return (
    <span
      className={clsx(styles['external-leader'], className)}
      {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : { 'aria-hidden': true })}
    >
      <svg viewBox="0 0 10 10" focusable="false" aria-hidden="true">
        <path d="M2 8 8 2M4 2h4v4" />
      </svg>
    </span>
  );
}
