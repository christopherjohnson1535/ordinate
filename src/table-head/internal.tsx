// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TableSectionContext } from '../internal/context/table-context';
import { TableHeadProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTableHeadProps extends TableHeadProps {
  /**
   * Lets other components position the table head. Not part of the public API.
   */
  className?: string;
}

export function InternalTableHead({ children, className, ...rest }: InternalTableHeadProps) {
  return (
    <thead {...rest} className={clsx(styles.root, className)}>
      <TableSectionContext.Provider value="head">{children}</TableSectionContext.Provider>
    </thead>
  );
}
