// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

const minorTicksPerSegment = 3;

/**
 * Progress drawn as a ruler: a major tick between questions, finer ticks within each, and a filled
 * run up to the question shown. It only repeats the counter's text, so it is hidden from assistive
 * technology.
 */
export function ProgressRuler({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <div className={styles.ruler} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={clsx(styles.segment, index <= activeIndex && styles.filled)}>
          {Array.from({ length: minorTicksPerSegment }, (_, tick) => (
            <span key={tick} className={styles['minor-tick']} />
          ))}
        </span>
      ))}
    </div>
  );
}
