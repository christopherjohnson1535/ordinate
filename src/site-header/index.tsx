// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SiteHeaderProps } from './interfaces';
import { InternalSiteHeader } from './internal';

export type { SiteHeaderProps };

export default function SiteHeader({
  brand,
  links,
  actions,
  notice,
  sticky = false,
  navigationAriaLabel,
  menuButtonText,
  onFollow,
  ...props
}: SiteHeaderProps) {
  return (
    <InternalSiteHeader
      {...getBaseProps(props)}
      brand={brand}
      links={links}
      actions={actions}
      notice={notice}
      sticky={sticky}
      navigationAriaLabel={navigationAriaLabel}
      menuButtonText={menuButtonText}
      onFollow={onFollow}
    />
  );
}
