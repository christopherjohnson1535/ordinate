// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export type ConstructionKind = 'configuration' | 'resource' | 'policy' | 'neutral';

interface KindProps {
  /**
   * The kind color of the lines and marks. Neutral graphite when left out.
   */
  kind?: ConstructionKind;
}

/**
 * The construction line that opens a drawn section: a thin line along the top edge of the nearest positioned
 * ancestor, running past both ends, with a hash mark at each end. Drawing only, hidden from screen readers.
 * Give the ancestor `position: relative` and enough padding at the top for its content to clear the line.
 */
export function ConstructionTopLine({ kind = 'neutral' }: KindProps) {
  return (
    <>
      <span className={clsx(styles[`kind-${kind}`], styles.line, styles['top-line'])} aria-hidden="true" />
      <span className={clsx(styles[`kind-${kind}`], styles.mark, styles['top-start'])} aria-hidden="true" />
      <span className={clsx(styles[`kind-${kind}`], styles.mark, styles['top-end'])} aria-hidden="true" />
    </>
  );
}

/**
 * Hash marks at both ends of a rule drawn along the top edge of the nearest positioned ancestor, such as the
 * rule above a footer. Drawing only, hidden from screen readers.
 */
export function RuleEndMarks({ kind = 'neutral' }: KindProps) {
  return (
    <>
      <span className={clsx(styles[`kind-${kind}`], styles.mark, styles['rule-start'])} aria-hidden="true" />
      <span className={clsx(styles[`kind-${kind}`], styles.mark, styles['rule-end'])} aria-hidden="true" />
    </>
  );
}
