// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ColumnLayoutProps } from './interfaces';
import { InternalColumnLayout } from './internal';

export type { ColumnLayoutProps };

export default function ColumnLayout({
  columns = 1,
  variant = 'default',
  borders = 'none',
  minColumnWidth,
  disableGutters = false,
  children,
  ...props
}: ColumnLayoutProps) {
  return (
    <InternalColumnLayout
      {...getBaseProps(props)}
      columns={columns}
      variant={variant}
      borders={borders}
      minColumnWidth={minColumnWidth}
      disableGutters={disableGutters}
    >
      {children}
    </InternalColumnLayout>
  );
}
