// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { NavigableGroupProps } from './interfaces';
import { InternalNavigableGroup } from './internal';

export type { NavigableGroupProps };

/**
 * Turns the focusable elements inside it into a single tab stop, moved between with the arrow keys.
 * It adds keyboard behavior only and has no look of its own.
 */
const NavigableGroup = React.forwardRef(
  (
    { children, navigationDirection, getItemKey, loopFocus = false, ariaLabel, role, ...props }: NavigableGroupProps,
    ref: React.Ref<NavigableGroupProps.Ref>
  ) => (
    <InternalNavigableGroup
      {...getBaseProps(props)}
      ref={ref}
      navigationDirection={navigationDirection}
      getItemKey={getItemKey}
      loopFocus={loopFocus}
      ariaLabel={ariaLabel}
      role={role}
    >
      {children}
    </InternalNavigableGroup>
  )
);

export default NavigableGroup;
