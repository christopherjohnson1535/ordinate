// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { StatusIndicatorProps } from './interfaces';
import { InternalStatusIndicator } from './internal';

export type { StatusIndicatorProps };

export default function StatusIndicator({
  type = 'success',
  children,
  iconAriaLabel,
  colorOverride,
  wrapText = true,
  ...props
}: StatusIndicatorProps) {
  return (
    <InternalStatusIndicator
      {...getBaseProps(props)}
      type={type}
      iconAriaLabel={iconAriaLabel}
      colorOverride={colorOverride}
      wrapText={wrapText}
    >
      {children}
    </InternalStatusIndicator>
  );
}
