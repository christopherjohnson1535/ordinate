// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { SpinnerProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalSpinnerProps extends SpinnerProps {
  /**
   * Lets other components position the spinner. Not part of the public API.
   */
  className?: string;
}

export function InternalSpinner({ size = 'normal', variant = 'normal', className, ...rest }: InternalSpinnerProps) {
  return (
    <span
      {...rest}
      className={clsx(styles.root, styles[`size-${size}`], styles[`variant-${variant}`], className)}
      aria-hidden="true"
    >
      <svg className={styles.arc} viewBox="0 0 16 16" focusable="false">
        <path d="M8 1.5a6.5 6.5 0 1 1-6.5 6.5" />
      </svg>
    </span>
  );
}
