// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export interface LeaderRowProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

function isPresent(value: React.ReactNode) {
  return value !== undefined && value !== null && value !== false && value !== '';
}

/**
 * A label and a value joined by a dotted leader, as on a price list or a contents page. The dots
 * are drawing only and stay out of the accessibility tree. Without a value the label stands alone.
 */
export function LeaderRow({ label, value, className, labelClassName, valueClassName }: LeaderRowProps) {
  return (
    <span className={clsx(styles.row, className)}>
      <span className={clsx(styles.label, labelClassName)}>{label}</span>
      {isPresent(value) && (
        <>
          {/* Keeps the label and the value apart when the row is read as one string. */}{' '}
          <span className={styles.leader} aria-hidden="true" />
          <span className={clsx(styles.value, valueClassName)}>{value}</span>
        </>
      )}
    </span>
  );
}
