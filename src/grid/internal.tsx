// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { childKey, flattenChildren } from '../internal/flatten-children';
import { warnOnce } from '../internal/logging';
import { GridProps } from './interfaces';
import { getPlacements, placementStyle } from './placement';

import styles from './styles.css.js';

export function InternalGrid({ gridDefinition = [], disableGutters = false, children, ...rest }: GridProps) {
  const items = flattenChildren(children);
  if (gridDefinition.length > 0 && gridDefinition.length !== items.length) {
    warnOnce('Grid', '`gridDefinition` should have one entry per child.');
  }
  const placements = getPlacements(items.map((_, index) => gridDefinition[index] ?? {}));

  return (
    <div {...rest} className={styles.root}>
      <div className={clsx(styles.grid, !disableGutters && styles.gutters)}>
        {items.map((child, index) => (
          <div
            key={childKey(child, index)}
            className={styles.column}
            style={placementStyle(placements, index) as React.CSSProperties}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
