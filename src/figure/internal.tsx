// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { FigureProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalFigureProps extends FigureProps {
  /**
   * Lets other components position the figure. Not part of the public API.
   */
  className?: string;
}

export function InternalFigure({ media, caption, label, credit, className, ...rest }: InternalFigureProps) {
  const hasCaption = Boolean(caption || label || credit);
  return (
    <figure {...rest} className={clsx(styles.root, className)}>
      {media && <div className={styles.media}>{media}</div>}
      {hasCaption && (
        <figcaption className={styles.caption}>
          {(label || caption) && (
            <span className={styles.line}>
              {label && <span className={styles.label}>{label}</span>}
              {label && caption && ' '}
              {caption && <span className={styles.text}>{caption}</span>}
            </span>
          )}
          {credit && (
            <>
              {(label || caption) && ' '}
              <span className={styles.credit}>{credit}</span>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
