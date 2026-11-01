// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SiteFooterProps } from './interfaces';
import { InternalSiteFooter } from './internal';

export type { SiteFooterProps };

export default function SiteFooter({
  brand,
  columns,
  children,
  legal,
  tone = 'default',
  headingLevel = 2,
  navigationAriaLabel,
  onFollow,
  ...props
}: SiteFooterProps) {
  return (
    <InternalSiteFooter
      {...getBaseProps(props)}
      brand={brand}
      columns={columns}
      legal={legal}
      tone={tone}
      headingLevel={headingLevel}
      navigationAriaLabel={navigationAriaLabel}
      onFollow={onFollow}
    >
      {children}
    </InternalSiteFooter>
  );
}
