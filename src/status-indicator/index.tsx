// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { StatusIndicatorProps } from './interfaces';
import { InternalStatusIndicator } from './internal';
import { resolveColorOverride, resolveState } from './legacy';

export type { StatusIndicatorProps };

export default function StatusIndicator({
  state,
  type,
  children,
  iconAriaLabel,
  tone,
  colorOverride,
  wrapText = true,
  ...props
}: StatusIndicatorProps) {
  return (
    <InternalStatusIndicator
      {...getBaseProps(props)}
      state={resolveState('StatusIndicator', state ?? type) ?? 'complete'}
      iconAriaLabel={iconAriaLabel}
      tone={tone ?? resolveColorOverride(colorOverride)}
      wrapText={wrapText}
    >
      {children}
    </InternalStatusIndicator>
  );
}
