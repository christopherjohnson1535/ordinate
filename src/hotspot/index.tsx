// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { HotspotProps } from './interfaces';
import { InternalHotspot } from './internal';

export type { HotspotProps };

export default function Hotspot({ hotspotId, children, side = 'right', direction = 'top', ...props }: HotspotProps) {
  return (
    <InternalHotspot {...getBaseProps(props)} hotspotId={hotspotId} side={side} direction={direction}>
      {children}
    </InternalHotspot>
  );
}
