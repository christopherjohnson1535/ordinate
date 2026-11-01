// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ListProps } from './interfaces';
import { InternalList } from './internal';

export type { ListProps };

export default function List<T>({
  items,
  renderItem,
  tagOverride,
  ariaLabel,
  sortable = false,
  onSortingChange,
  i18nStrings,
  ...props
}: ListProps<T>) {
  return (
    <InternalList<T>
      {...getBaseProps(props)}
      items={items}
      renderItem={renderItem}
      tagOverride={tagOverride}
      ariaLabel={ariaLabel}
      sortable={sortable}
      onSortingChange={onSortingChange}
      i18nStrings={i18nStrings}
    />
  );
}
