// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { AnchorNavigationProps } from './interfaces';
import { InternalAnchorNavigation } from './internal';

export type { AnchorNavigationProps };

export default function AnchorNavigation({
  anchors,
  activeHref,
  scrollSpyOffset = 0,
  onFollow,
  onActiveHrefChange,
  ariaLabelledby,
  ...props
}: AnchorNavigationProps) {
  return (
    <InternalAnchorNavigation
      {...getBaseProps(props)}
      anchors={anchors}
      activeHref={activeHref}
      scrollSpyOffset={scrollSpyOffset}
      onFollow={onFollow}
      onActiveHrefChange={onActiveHrefChange}
      ariaLabelledby={ariaLabelledby}
    />
  );
}
