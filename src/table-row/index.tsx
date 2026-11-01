// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TableRowProps } from './interfaces';
import { InternalTableRow } from './internal';

export type { TableRowProps };

export default function TableRow({ children, selected = false, ariaRowindex, onClick, ...props }: TableRowProps) {
  return (
    <InternalTableRow {...getBaseProps(props)} selected={selected} ariaRowindex={ariaRowindex} onClick={onClick}>
      {children}
    </InternalTableRow>
  );
}
