// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { IndexListProps } from './interfaces';
import { InternalIndexList } from './internal';

export type { IndexListProps };

/**
 * A list that reads like a contents page, a price list or a project index. Use it in place of a
 * small table on a website.
 */
export default function IndexList({
  items,
  variant = 'leaders',
  size = 'default',
  ordered = false,
  ariaLabel,
  onFollow,
  ...props
}: IndexListProps) {
  return (
    <InternalIndexList
      {...getBaseProps(props)}
      items={items}
      variant={variant}
      size={size}
      ordered={ordered}
      ariaLabel={ariaLabel}
      onFollow={onFollow}
    />
  );
}
