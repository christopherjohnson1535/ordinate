// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SpaceBetweenProps } from './interfaces';
import { InternalSpaceBetween } from './internal';

export type { SpaceBetweenProps };

export default function SpaceBetween({
  direction = 'vertical',
  size,
  alignItems,
  children,
  ...props
}: SpaceBetweenProps) {
  return (
    <InternalSpaceBetween {...getBaseProps(props)} direction={direction} size={size} alignItems={alignItems}>
      {children}
    </InternalSpaceBetween>
  );
}
