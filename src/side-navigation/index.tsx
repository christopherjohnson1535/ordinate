// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SideNavigationProps } from './interfaces';
import { InternalSideNavigation } from './internal';

export type { SideNavigationProps };

export default function SideNavigation({
  header,
  items = [],
  activeHref,
  ariaLabel,
  externalIconAriaLabel,
  onFollow,
  onChange,
  ...props
}: SideNavigationProps) {
  return (
    <InternalSideNavigation
      {...getBaseProps(props)}
      header={header}
      items={items}
      activeHref={activeHref}
      ariaLabel={ariaLabel}
      externalIconAriaLabel={externalIconAriaLabel}
      onFollow={onFollow}
      onChange={onChange}
    />
  );
}
