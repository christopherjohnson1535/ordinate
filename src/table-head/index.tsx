// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TableHeadProps } from './interfaces';
import { InternalTableHead } from './internal';

export type { TableHeadProps };

export default function TableHead({ children, ...props }: TableHeadProps) {
  return <InternalTableHead {...getBaseProps(props)}>{children}</InternalTableHead>;
}
