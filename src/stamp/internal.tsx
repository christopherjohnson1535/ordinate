// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { StampProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalStampProps extends StampProps {
  /**
   * Lets other components position the stamp. Not part of the public API.
   */
  className?: string;
}

export function InternalStamp({
  type = 'neutral',
  rotation = 'slight',
  size = 'medium',
  children,
  className,
  ...rest
}: InternalStampProps) {
  return (
    <span
      {...rest}
      className={clsx(
        styles.stamp,
        styles[`type-${type}`],
        styles[`rotation-${rotation}`],
        styles[`size-${size}`],
        className
      )}
    >
      <span className={styles.text}>{children}</span>
    </span>
  );
}
