// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId } from 'react';
import clsx from 'clsx';

import { warnOnce } from '../internal/logging';
import { DividerProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalDividerProps extends DividerProps {
  /**
   * Lets other components position the divider. Not part of the public API.
   */
  className?: string;
}

export function InternalDivider({ orientation = 'horizontal', className, children, ...rest }: InternalDividerProps) {
  const labelId = useId();
  const hasLabel = children !== undefined && children !== null && children !== false;

  if (hasLabel && orientation === 'vertical') {
    warnOnce('Divider', 'Vertical dividers do not show a label.');
  }

  if (hasLabel && orientation === 'horizontal') {
    // The content of a separator is presentational, so the label names it instead.
    return (
      <div
        {...rest}
        role="separator"
        aria-labelledby={labelId}
        className={clsx(styles.divider, styles.labelled, className)}
      >
        <span className={styles.line} />
        <span id={labelId} className={styles.label}>
          {children}
        </span>
        <span className={styles.line} />
      </div>
    );
  }

  return (
    <hr
      {...rest}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={clsx(styles.divider, styles[orientation], className)}
    />
  );
}
