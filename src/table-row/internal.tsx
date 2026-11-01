// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useTableContext, useTableSection } from '../internal/context/table-context';
import { fireNonCancelableEvent } from '../internal/events';
import { TableRowProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTableRowProps extends TableRowProps {
  /**
   * Lets other components position the row. Not part of the public API.
   */
  className?: string;
  /**
   * Marks a row that holds a message, such as the empty or loading state, instead of an item.
   * It is not striped and does not react to hover.
   */
  message?: boolean;
}

export function InternalTableRow({
  children,
  selected = false,
  ariaRowindex,
  onClick,
  message = false,
  className,
  ...rest
}: InternalTableRowProps) {
  const { stripedRows } = useTableContext();
  const isBodyRow = useTableSection() === 'body' && !message;

  return (
    <tr
      {...rest}
      className={clsx(
        styles.root,
        isBodyRow && styles.item,
        isBodyRow && stripedRows && styles.striped,
        isBodyRow && selected && styles.selected,
        onClick && styles.clickable,
        message && styles.message,
        className
      )}
      aria-rowindex={ariaRowindex}
      onClick={onClick ? () => fireNonCancelableEvent(onClick, null) : undefined}
    >
      {children}
    </tr>
  );
}
