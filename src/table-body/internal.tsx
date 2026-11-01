// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TableSectionContext } from '../internal/context/table-context';
import { TableBodyProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTableBodyProps extends TableBodyProps {
  /**
   * Lets other components position the table body. Not part of the public API.
   */
  className?: string;
}

export function InternalTableBody({ children, className, ...rest }: InternalTableBodyProps) {
  return (
    <tbody {...rest} className={clsx(styles.root, className)}>
      <TableSectionContext.Provider value="body">{children}</TableSectionContext.Provider>
    </tbody>
  );
}
