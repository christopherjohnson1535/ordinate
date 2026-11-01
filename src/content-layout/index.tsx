// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ContentLayoutProps } from './interfaces';
import { InternalContentLayout } from './internal';

export type { ContentLayoutProps };

export default function ContentLayout({
  header,
  breadcrumbs,
  notifications,
  headerVariant = 'default',
  maxContentWidth,
  disableOverlap = false,
  defaultPadding = false,
  children,
  ...props
}: ContentLayoutProps) {
  return (
    <InternalContentLayout
      {...getBaseProps(props)}
      header={header}
      breadcrumbs={breadcrumbs}
      notifications={notifications}
      headerVariant={headerVariant}
      maxContentWidth={maxContentWidth}
      disableOverlap={disableOverlap}
      defaultPadding={defaultPadding}
    >
      {children}
    </InternalContentLayout>
  );
}
