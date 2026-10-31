// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { BadgeProps } from './interfaces';
import { InternalBadge } from './internal';

export type { BadgeProps };

export default function Badge({ color = 'grey', children, ...props }: BadgeProps) {
  return (
    <InternalBadge {...getBaseProps(props)} color={color}>
      {children}
    </InternalBadge>
  );
}
