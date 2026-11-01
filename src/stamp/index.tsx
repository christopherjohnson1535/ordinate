// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { StampProps } from './interfaces';
import { InternalStamp } from './internal';

export type { StampProps };

export default function Stamp({
  type = 'neutral',
  rotation = 'slight',
  size = 'medium',
  children,
  ...props
}: StampProps) {
  return (
    <InternalStamp {...getBaseProps(props)} type={type} rotation={rotation} size={size}>
      {children}
    </InternalStamp>
  );
}
