// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TableBodyProps } from './interfaces';
import { InternalTableBody } from './internal';

export type { TableBodyProps };

export default function TableBody({ children, ...props }: TableBodyProps) {
  return <InternalTableBody {...getBaseProps(props)}>{children}</InternalTableBody>;
}
