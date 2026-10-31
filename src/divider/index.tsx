// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { DividerProps } from './interfaces';
import { InternalDivider } from './internal';

export type { DividerProps };

export default function Divider({ orientation = 'horizontal', children, ...props }: DividerProps) {
  return (
    <InternalDivider {...getBaseProps(props)} orientation={orientation}>
      {children}
    </InternalDivider>
  );
}
