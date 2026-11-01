// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useRef } from 'react';
import clsx from 'clsx';

import { IconProps } from '../icon/interfaces';
import { InternalIcon } from '../icon/internal';
import { TableSelectionControl } from '../internal/components/table-selection-control';
import { useTableContext } from '../internal/context/table-context';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { TableHeaderCellProps } from './interfaces';
import { Resizer } from './resizer';

import styles from './styles.css.js';

const defaultResizableMinWidth = 80;

const sortingIcons: Record<TableHeaderCellProps.SortingState, IconProps.Name> = {
  unsorted: 'caret-down',
  ascending: 'caret-up-filled',
  descending: 'caret-down-filled',
};

const ariaSortValues: Record<TableHeaderCellProps.SortingState, React.AriaAttributes['aria-sort']> = {
  unsorted: 'none',
  ascending: 'ascending',
  descending: 'descending',
};

export interface InternalTableHeaderCellProps extends TableHeaderCellProps {
  /**
   * Lets other components position the cell. Not part of the public API.
   */
  className?: string;
}

export function InternalTableHeaderCell({
  children,
  sortingState,
  sortingDisabled = false,
  onSortingChange,
  width,
  minWidth,
  maxWidth,
  resizable = false,
  onResize,
  onResizeEnd,
  resizerRoleDescription,
  rowTagColumn = false,
  selectionType,
  selected = false,
  indeterminate = false,
  selectionDisabled = false,
  selectionAriaLabel,
  onSelectionChange,
  className,
  ...rest
}: InternalTableHeaderCellProps) {
  const i18n = useInternalI18n('table-header-cell');
  const { edgeInset, ruleWeight } = useTableContext();
  const cellRef = useRef<HTMLTableCellElement>(null);
  const labelId = useId();

  const cellClassName = clsx(
    styles.root,
    styles[`rules-${ruleWeight}`],
    edgeInset !== 'cell' && styles[`inset-${edgeInset}`],
    selectionType && styles.selection,
    className
  );

  if (selectionType) {
    return (
      <th {...rest} scope="col" className={cellClassName}>
        {selectionType === 'multi' ? (
          <TableSelectionControl
            type="multi"
            selected={selected}
            indeterminate={indeterminate}
            disabled={selectionDisabled}
            ariaLabel={i18n('allItemsSelectionLabel', selectionAriaLabel)}
            onChange={event => fireNonCancelableEvent(onSelectionChange, { selected: event.detail.selected })}
          />
        ) : (
          <span className={styles['screenreader-only']}>{i18n('selectionGroupLabel', selectionAriaLabel)}</span>
        )}
      </th>
    );
  }

  if (rowTagColumn) {
    return (
      <th {...rest} scope="col" className={clsx(cellClassName, styles['row-tag-column'])}>
        <span className={styles.heading}>
          <span className={styles.label}>{children ?? i18n('rowTagColumnLabel', undefined)}</span>
        </span>
      </th>
    );
  }

  const label = (
    <span id={labelId} className={styles.label}>
      {children}
    </span>
  );

  return (
    <th
      {...rest}
      ref={cellRef}
      scope="col"
      aria-sort={sortingState ? ariaSortValues[sortingState] : undefined}
      className={clsx(cellClassName, resizable && styles.resizable)}
      style={{ width, minWidth, maxWidth }}
    >
      {sortingState ? (
        <button
          type="button"
          className={clsx(styles['sorting-button'], sortingState !== 'unsorted' && styles.sorted)}
          disabled={sortingDisabled}
          onClick={() => fireNonCancelableEvent(onSortingChange, { descending: sortingState === 'ascending' })}
        >
          {label}
          <span className={styles['sorting-icon']}>
            <InternalIcon name={sortingIcons[sortingState]} />
          </span>
        </button>
      ) : (
        <span className={styles.heading}>{label}</span>
      )}
      {resizable && (
        <Resizer
          cellRef={cellRef}
          width={typeof width === 'number' ? width : undefined}
          minWidth={typeof minWidth === 'number' ? minWidth : defaultResizableMinWidth}
          maxWidth={typeof maxWidth === 'number' ? maxWidth : undefined}
          labelledby={labelId}
          roleDescription={i18n('resizerRoleDescription', resizerRoleDescription)}
          onResize={value => fireNonCancelableEvent(onResize, { width: value })}
          onResizeEnd={value => fireNonCancelableEvent(onResizeEnd, { width: value })}
        />
      )}
    </th>
  );
}
