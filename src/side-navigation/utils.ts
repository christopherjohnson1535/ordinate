// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SideNavigationProps } from './interfaces';

type ListItem = Exclude<SideNavigationProps.Item, SideNavigationProps.Divider>;

export interface IndexedItem {
  item: ListItem;
  index: number;
}

/**
 * Splits items into runs of list items separated by dividers. Each item keeps its index in
 * the original array, so its identity does not change when a divider is added before it.
 */
export function splitAtDividers(items: ReadonlyArray<SideNavigationProps.Item>): Array<IndexedItem[] | 'divider'> {
  const runs: Array<IndexedItem[] | 'divider'> = [];
  items.forEach((item, index) => {
    if (item.type === 'divider') {
      runs.push('divider');
      return;
    }
    const last = runs[runs.length - 1];
    if (Array.isArray(last)) {
      last.push({ item, index });
    } else {
      runs.push([{ item, index }]);
    }
  });
  return runs;
}

/**
 * Whether any item, at any depth, links to `href`.
 */
export function containsHref(items: ReadonlyArray<SideNavigationProps.Item>, href: string | undefined): boolean {
  if (href === undefined) {
    return false;
  }
  return items.some(item => {
    if (item.type === 'divider') {
      return false;
    }
    if ('href' in item && item.href === href) {
      return true;
    }
    return 'items' in item && containsHref(item.items, href);
  });
}

/**
 * Whether any link, at any depth, carries a code, so every link keeps a column for one.
 */
export function containsCode(items: ReadonlyArray<SideNavigationProps.Item>): boolean {
  return items.some(item => {
    switch (item.type) {
      case 'divider':
        return false;
      case 'link':
        return Boolean(item.code);
      case 'section':
      case 'section-group':
        return containsCode(item.items);
      default:
        return Boolean(item.code) || containsCode(item.items);
    }
  });
}
