// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '../internal/logging';
import { SideNavigationProps } from './interfaces';
import { InternalSideNavigation } from './internal';
import { containsCode } from './utils';

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
  if (containsCode(items)) {
    warnOnce(
      'SideNavigation',
      'Item codes are no longer drawn: the navigation shows item names only. `code` stops working in the next major version.'
    );
  }
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
