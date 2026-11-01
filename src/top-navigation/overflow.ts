// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { isItemGroup } from '../button-dropdown/utils';
import { TopNavigationProps } from './interfaces';

// Overflow item IDs start with the utility's index, so a click can be sent to the right utility.
const separator = ':';

function prefixItems(items: ButtonDropdownProps.Items, prefix: string): ButtonDropdownProps.Items {
  return items.map(item =>
    isItemGroup(item)
      ? {
          ...item,
          id: item.id === undefined ? undefined : `${prefix}${item.id}`,
          items: prefixItems(item.items, prefix),
        }
      : { ...item, id: `${prefix}${item.id}` }
  );
}

export function getUtilityLabel(utility: TopNavigationProps.Utility): string {
  return utility.text ?? utility.ariaLabel ?? '';
}

/**
 * Turns the overflowed utilities into menu items: buttons become items and menus become
 * groups that open in place.
 */
export function getOverflowItems(
  utilities: ReadonlyArray<TopNavigationProps.Utility>,
  indexes: ReadonlyArray<number>
): ButtonDropdownProps.Items {
  return indexes.map(index => {
    const utility = utilities[index];
    const prefix = `${index}${separator}`;
    if (utility.type === 'menu-dropdown') {
      return {
        id: `${index}`,
        text: utility.title ?? getUtilityLabel(utility),
        iconName: utility.iconName,
        items: prefixItems(utility.items, prefix),
      };
    }
    return {
      id: prefix,
      text: getUtilityLabel(utility),
      iconName: utility.iconName,
      href: utility.href,
      external: utility.external,
      externalIconAriaLabel: utility.externalIconAriaLabel,
    };
  });
}

/**
 * Splits an overflow item ID into the utility's index and the item's own ID.
 */
export function parseOverflowItemId(id: string): { index: number; itemId: string } {
  const position = id.indexOf(separator);
  return { index: Number(id.slice(0, position)), itemId: id.slice(position + 1) };
}
