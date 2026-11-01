// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TreeViewProps } from './interfaces';
import { InternalTreeView } from './internal';

export type { TreeViewProps };

export default function TreeView<T>({
  items,
  getItemId,
  getItemChildren,
  renderItem,
  expandedItems,
  onItemToggle,
  renderItemToggleIcon,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  i18nStrings,
  ...props
}: TreeViewProps<T>) {
  return (
    <InternalTreeView
      {...getBaseProps(props)}
      items={items}
      getItemId={getItemId}
      getItemChildren={getItemChildren}
      renderItem={renderItem}
      expandedItems={expandedItems}
      onItemToggle={onItemToggle}
      renderItemToggleIcon={renderItemToggleIcon}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      i18nStrings={i18nStrings}
    />
  );
}
