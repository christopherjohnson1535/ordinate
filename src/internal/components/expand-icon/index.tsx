// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../../../icon/internal';

import styles from './styles.css.js';

export interface ExpandIconProps {
  expanded: boolean;
  /**
   * Where the caret points while collapsed. A disclosure points along the reading direction and turns
   * down to open; a stack toggle points down and turns up to close.
   */
  collapsedDirection?: 'inline-end' | 'down';
  className?: string;
}

/**
 * The caret of a disclosure button. It turns with motion when the state changes.
 */
export function ExpandIcon({ expanded, collapsedDirection = 'inline-end', className }: ExpandIconProps) {
  return (
    <span
      className={clsx(styles.root, styles[`collapsed-${collapsedDirection}`], expanded && styles.expanded, className)}
    >
      <InternalIcon name="caret-down-solid" />
    </span>
  );
}
