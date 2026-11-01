// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { warnOnce } from '../internal/logging';
import { MediaProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalMediaProps extends MediaProps {
  /**
   * Lets other components size the frame. Not part of the public API.
   */
  className?: string;
}

export function InternalMedia({
  src,
  alt,
  aspectRatio = '3:2',
  fit = 'cover',
  children,
  placeholderText,
  className,
  ...rest
}: InternalMediaProps) {
  if (src && alt === undefined) {
    warnOnce('Media', 'Set `alt` whenever `src` is set. Use an empty string only for decoration.');
  }

  const hasChildren = children !== undefined && children !== null && children !== false;
  const content = hasChildren ? (
    <div className={styles.slot}>{children}</div>
  ) : src ? (
    <img className={styles.image} src={src} alt={alt ?? ''} />
  ) : null;

  return (
    <div
      {...rest}
      className={clsx(
        styles.root,
        styles[`ratio-${aspectRatio.replace(':', '-')}`],
        styles[`fit-${fit}`],
        !content && styles.placeholder,
        className
      )}
    >
      {content ??
        (placeholderText && (
          <span className={styles['placeholder-text']} aria-hidden="true">
            {placeholderText}
          </span>
        ))}
    </div>
  );
}
