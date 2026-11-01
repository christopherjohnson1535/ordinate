// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TableHeaderCellProps } from './interfaces';
import { InternalTableHeaderCell } from './internal';

export type { TableHeaderCellProps };

export default function TableHeaderCell({
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
  ...props
}: TableHeaderCellProps) {
  return (
    <InternalTableHeaderCell
      {...getBaseProps(props)}
      sortingState={sortingState}
      sortingDisabled={sortingDisabled}
      onSortingChange={onSortingChange}
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      resizable={resizable}
      onResize={onResize}
      onResizeEnd={onResizeEnd}
      resizerRoleDescription={resizerRoleDescription}
      rowTagColumn={rowTagColumn}
      selectionType={selectionType}
      selected={selected}
      indeterminate={indeterminate}
      selectionDisabled={selectionDisabled}
      selectionAriaLabel={selectionAriaLabel}
      onSelectionChange={onSelectionChange}
    >
      {children}
    </InternalTableHeaderCell>
  );
}
