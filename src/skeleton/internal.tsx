// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../internal/i18n/context';
import { SkeletonProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalSkeletonProps extends SkeletonProps {
  /**
   * Lets other components position the skeleton. Not part of the public API.
   */
  className?: string;
}

function lineCount(variant: SkeletonProps.Variant, lines: number) {
  if (variant !== 'text') {
    return 1;
  }
  return Number.isFinite(lines) ? Math.max(1, Math.floor(lines)) : 1;
}

export function InternalSkeleton({
  variant = 'text',
  lines = 1,
  width = 'full',
  height = 'medium',
  loading = true,
  loadingText,
  className,
  children,
  ...rest
}: InternalSkeletonProps) {
  const i18n = useInternalI18n('skeleton');

  if (!loading) {
    return (
      <div {...rest} className={clsx(styles.root, styles.loaded, className)} aria-busy="false">
        {children}
      </div>
    );
  }

  const text = i18n('loadingText', loadingText);

  return (
    <div
      {...rest}
      className={clsx(styles.root, styles[`variant-${variant}`], styles[`width-${width}`], className)}
      aria-busy="true"
    >
      {text && <span className={styles['loading-text']}>{text}</span>}
      <div aria-hidden="true">
        {variant === 'block' ? (
          <div className={clsx(styles.block, styles[`height-${height}`])} />
        ) : (
          Array.from({ length: lineCount(variant, lines) }, (_, index) => (
            <div key={index} className={styles.line}>
              <span className={styles.bar} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
