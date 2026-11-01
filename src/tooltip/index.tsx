// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TooltipProps } from './interfaces';
import { InternalTooltip } from './internal';

export type { TooltipProps };

export default function Tooltip({ content, children, position = 'top', ...props }: TooltipProps) {
  return (
    <InternalTooltip {...getBaseProps(props)} content={content} position={position}>
      {children}
    </InternalTooltip>
  );
}
