// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { DrawerProps } from './interfaces';
import { InternalDrawer } from './internal';

export type { DrawerProps };

export default function Drawer({
  header,
  children,
  footer,
  loading = false,
  loadingText,
  disableContentPaddings = false,
  ...props
}: DrawerProps) {
  return (
    <InternalDrawer
      {...getBaseProps(props)}
      header={header}
      footer={footer}
      loading={loading}
      loadingText={loadingText}
      disableContentPaddings={disableContentPaddings}
    >
      {children}
    </InternalDrawer>
  );
}
