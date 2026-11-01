// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { BreadcrumbGroupProps } from './interfaces';
import { InternalBreadcrumbGroup } from './internal';

export type { BreadcrumbGroupProps };

export default function BreadcrumbGroup<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>({
  items,
  ariaLabel,
  expandAriaLabel,
  onFollow,
  onClick,
  ...props
}: BreadcrumbGroupProps<T>) {
  return (
    <InternalBreadcrumbGroup
      {...getBaseProps(props)}
      items={items}
      ariaLabel={ariaLabel}
      expandAriaLabel={expandAriaLabel}
      onFollow={onFollow}
      onClick={onClick}
    />
  );
}
