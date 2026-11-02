// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { SpinnerProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalSpinnerProps extends SpinnerProps {
  /**
   * Lets other components position the spinner. Not part of the public API.
   */
  className?: string;
}

/**
 * The underway icon, turning. With reduced motion it stands still, and still reads as work underway.
 */
export function InternalSpinner({ size = 'normal', variant = 'normal', className, ...rest }: InternalSpinnerProps) {
  return (
    <span
      {...rest}
      className={clsx(styles.root, styles[`size-${size}`], styles[`variant-${variant}`], className)}
      aria-hidden="true"
    >
      <InternalIcon className={styles.mark} name="underway" size="inherit" />
    </span>
  );
}
