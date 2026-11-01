// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type React from 'react';

import { ButtonDropdownProps } from './interfaces';

export function isItemGroup(item: ButtonDropdownProps.ItemOrGroup): item is ButtonDropdownProps.ItemGroup {
  return 'items' in item && Array.isArray(item.items);
}

export function isCheckboxItem(item: ButtonDropdownProps.Item): item is ButtonDropdownProps.CheckboxItem {
  return item.itemType === 'checkbox';
}

/**
 * A key for a group that stays the same while the menu is open: its `id`, or its position.
 */
export function getGroupKey(group: ButtonDropdownProps.ItemGroup, path: string): string {
  return group.id ?? `position-${path}`;
}

export function isPlainLeftClick(event: React.MouseEvent): boolean {
  return event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
}

export function getItemClickDetails(item: ButtonDropdownProps.Item): ButtonDropdownProps.ItemClickDetails {
  const details: ButtonDropdownProps.ItemClickDetails = { id: item.id };
  if (item.href !== undefined) {
    details.href = item.href;
    details.external = Boolean(item.external);
  }
  if (isCheckboxItem(item)) {
    details.checked = !item.checked;
  }
  return details;
}
