// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { LiveRegionProps } from './interfaces';
import { InternalLiveRegion } from './internal';

export type { LiveRegionProps };

export default function LiveRegion({
  children,
  assertive = false,
  hidden = false,
  tagName = 'div',
  ...props
}: LiveRegionProps) {
  return (
    <InternalLiveRegion {...getBaseProps(props)} assertive={assertive} hidden={hidden} tagName={tagName}>
      {children}
    </InternalLiveRegion>
  );
}
