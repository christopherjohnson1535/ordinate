// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export interface DimensionLineProps {
  label: React.ReactNode;
  className?: string;
}

/**
 * A dimension line: a rule with a hash mark and an extension tick at each end and its label set in the
 * middle, as on a technical drawing. The line breaks around the label, so it needs no background and reads
 * on any surface. It takes the text color of its parent. The marks are drawing only; the label is text.
 */
export function DimensionLine({ label, className }: DimensionLineProps) {
  return (
    <div className={clsx(styles.root, className)}>
      <span className={styles.end} aria-hidden="true" />
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.end} aria-hidden="true" />
    </div>
  );
}
