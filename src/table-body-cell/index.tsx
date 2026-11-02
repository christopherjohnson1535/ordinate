// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TableBodyCellProps } from './interfaces';
import { InternalTableBodyCell } from './internal';

export type { TableBodyCellProps };

export default function TableBodyCell({
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
  ...props
}: TableBodyCellProps) {
  return (
    <InternalTableBodyCell
      {...getBaseProps(props)}
      isRowHeader={isRowHeader}
      verticalAlign={verticalAlign}
      contentType={contentType}
      colSpan={colSpan}
      rowTag={rowTag}
      selectionType={selectionType}
      selected={selected}
      selectionDisabled={selectionDisabled}
      selectionName={selectionName}
      selectionAriaLabel={selectionAriaLabel}
      onSelectionChange={onSelectionChange}
    >
      {children}
    </InternalTableBodyCell>
  );
}
