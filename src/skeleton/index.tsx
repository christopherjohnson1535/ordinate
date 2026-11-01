// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SkeletonProps } from './interfaces';
import { InternalSkeleton } from './internal';

export type { SkeletonProps };

export default function Skeleton({
  variant = 'text',
  lines = 1,
  width = 'full',
  height = 'medium',
  loading = true,
  loadingText,
  children,
  ...props
}: SkeletonProps) {
  return (
    <InternalSkeleton
      {...getBaseProps(props)}
      variant={variant}
      lines={lines}
      width={width}
      height={height}
      loading={loading}
      loadingText={loadingText}
    >
      {children}
    </InternalSkeleton>
  );
}
