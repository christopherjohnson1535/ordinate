// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { TableSelectionControl } from '../internal/components/table-selection-control';
import { useTableContext } from '../internal/context/table-context';
import { useInternalI18n } from '../internal/i18n/context';
import { TableBodyCellProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTableBodyCellProps extends TableBodyCellProps {
  /**
   * Lets other components position the cell. Not part of the public API.
   */
  className?: string;
  /**
   * Marks a cell that holds a message spanning the row, such as the empty state. Its content wraps
   * and is never cut off.
   */
  message?: boolean;
}

export function InternalTableBodyCell({
  children,
  isRowHeader = false,
  verticalAlign = 'middle',
  contentType = 'text',
  colSpan,
  rowTag,
  selectionType,
  selected = false,
  selectionDisabled = false,
  selectionName,
  selectionAriaLabel,
  onSelectionChange,
  message = false,
  className,
  ...rest
}: InternalTableBodyCellProps) {
  const i18n = useInternalI18n('table-body-cell');
  const { wrapLines, layout, edgeInset, ruleWeight } = useTableContext();
  const isRowTag = rowTag !== undefined && !selectionType;
  const Tag = isRowHeader && !selectionType && !isRowTag ? 'th' : 'td';

  return (
    <Tag
      {...rest}
      scope={Tag === 'th' ? 'row' : undefined}
      colSpan={colSpan}
      className={clsx(
        styles.root,
        styles[`rules-${ruleWeight}`],
        styles[`align-${verticalAlign}`],
        !selectionType && !isRowTag && !message && contentType !== 'text' && styles[`content-${contentType}`],
        selectionType && styles.selection,
        isRowTag && styles['row-tag'],
        message && styles.message,
        !selectionType && !isRowTag && !message && (wrapLines ? styles.wrap : styles['no-wrap']),
        layout === 'fixed' && !message && styles.truncate,
        edgeInset !== 'cell' && styles[`inset-${edgeInset}`],
        className
      )}
    >
      {selectionType ? (
        <TableSelectionControl
          type={selectionType}
          selected={selected}
          disabled={selectionDisabled}
          name={selectionName}
          ariaLabel={i18n('selectionAriaLabel', selectionAriaLabel)}
          onChange={onSelectionChange}
        />
      ) : isRowTag ? (
        <span className={styles.tag}>{rowTag}</span>
      ) : (
        children
      )}
    </Tag>
  );
}
