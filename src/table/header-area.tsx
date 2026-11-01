// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

interface HeaderAreaProps {
  header?: React.ReactNode;
  filter?: React.ReactNode;
  pagination?: React.ReactNode;
  preferences?: React.ReactNode;
  className?: string;
}

/**
 * The header slot and, below it, the tools row: the filter takes the free space, and pagination
 * and preferences sit at the end of the row.
 */
export function HeaderArea({ header, filter, pagination, preferences, className }: HeaderAreaProps) {
  const hasTools = Boolean(filter || pagination || preferences);
  if (!header && !hasTools) {
    return null;
  }
  return (
    <div className={clsx(styles['header-area'], className)}>
      {header && <div className={styles['header-slot']}>{header}</div>}
      {hasTools && (
        <div className={styles.tools}>
          {filter && <div className={styles['tools-filter']}>{filter}</div>}
          {(pagination || preferences) && (
            <div className={styles['tools-end']}>
              {pagination && <div className={styles['tools-pagination']}>{pagination}</div>}
              {preferences && <div className={styles['tools-preferences']}>{preferences}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
