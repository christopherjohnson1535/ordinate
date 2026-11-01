// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { AppLayoutToolbarProps } from './interfaces';
import { InternalAppLayoutToolbar } from './internal';

export type { AppLayoutToolbarProps };

export default function AppLayoutToolbar({
  breadcrumbs,
  navigationOpen = false,
  navigationHide = false,
  onNavigationChange,
  drawers,
  activeDrawerId = null,
  onDrawerChange,
  ariaLabels,
  ...props
}: AppLayoutToolbarProps) {
  return (
    <InternalAppLayoutToolbar
      {...getBaseProps(props)}
      breadcrumbs={breadcrumbs}
      navigationOpen={navigationOpen}
      navigationHide={navigationHide}
      onNavigationChange={onNavigationChange}
      drawers={drawers}
      activeDrawerId={activeDrawerId}
      onDrawerChange={onDrawerChange}
      ariaLabels={ariaLabels}
    />
  );
}
