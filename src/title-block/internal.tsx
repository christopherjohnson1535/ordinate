// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TitleBlockProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTitleBlockProps extends TitleBlockProps {
  /**
   * Lets other components position the block. Not part of the public API.
   */
  className?: string;
}

export function InternalTitleBlock({
  items,
  columns = 'auto',
  ariaLabel,
  ariaLabelledby,
  className,
  ...rest
}: InternalTitleBlockProps) {
  return (
    <div {...rest} className={clsx(styles.root, className)}>
      <dl
        className={clsx(styles.list, styles[`columns-${columns}`])}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {items.map((item, index) => (
          <div key={index} className={styles.cell}>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
