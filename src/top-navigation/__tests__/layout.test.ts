// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { computeUtilityLayout, UtilityMeasure } from '../../../lib/components/top-navigation/layout';
import { getOverflowItems, parseOverflowItemId } from '../../../lib/components/top-navigation/overflow';

const utility = (overrides: Partial<UtilityMeasure> = {}): UtilityMeasure => ({
  full: 100,
  collapsed: 40,
  canCollapseText: true,
  canOverflow: true,
  ...overrides,
});

const layoutFor = (available: number, utilities: UtilityMeasure[]) =>
  computeUtilityLayout({ available, utilities, overflowTriggerWidth: 40, gap: 4 });

describe('computeUtilityLayout', () => {
  test('keeps the text when everything fits', () => {
    expect(layoutFor(308, [utility(), utility(), utility()])).toEqual({ collapseText: false, overflowed: [] });
  });

  test('collapses text to icons when the text does not fit', () => {
    expect(layoutFor(307, [utility(), utility(), utility()])).toEqual({ collapseText: true, overflowed: [] });
    expect(layoutFor(128, [utility(), utility(), utility()])).toEqual({ collapseText: true, overflowed: [] });
  });

  test('keeps the full width of utilities that cannot collapse their text', () => {
    const utilities = [utility({ canCollapseText: false }), utility()];
    expect(layoutFor(144, utilities)).toEqual({ collapseText: true, overflowed: [] });
    expect(layoutFor(143, utilities).overflowed).not.toEqual([]);
  });

  test('moves utilities into the overflow menu from the first, until the rest fit', () => {
    const utilities = [utility(), utility(), utility()];
    // Two icons and the trigger take 128, one icon and the trigger 84.
    expect(layoutFor(127, utilities)).toEqual({ collapseText: true, overflowed: [0, 1] });
    expect(layoutFor(84, utilities)).toEqual({ collapseText: true, overflowed: [0, 1] });
    expect(layoutFor(83, utilities)).toEqual({ collapseText: true, overflowed: [0, 1, 2] });
  });

  test('never moves utilities that cannot overflow', () => {
    const utilities = [utility({ canOverflow: false }), utility(), utility()];
    expect(layoutFor(0, utilities)).toEqual({ collapseText: true, overflowed: [1, 2] });
  });

  test('fits an empty list', () => {
    expect(layoutFor(0, [])).toEqual({ collapseText: false, overflowed: [] });
  });
});

describe('overflow items', () => {
  test('turns buttons into items and menus into groups with prefixed IDs', () => {
    const items = getOverflowItems(
      [
        { type: 'button', text: 'Docs', iconName: 'file', href: '/docs', external: true },
        {
          type: 'menu-dropdown',
          text: 'Jane',
          title: 'Jane Doe',
          items: [
            { id: 'profile', text: 'Profile' },
            { text: 'More', items: [{ id: 'sign-out', text: 'Sign out' }] },
          ],
        },
        { type: 'button', ariaLabel: 'Settings', iconName: 'settings' },
      ],
      [0, 1, 2]
    );
    expect(items).toEqual([
      { id: '0:', text: 'Docs', iconName: 'file', href: '/docs', external: true, externalIconAriaLabel: undefined },
      {
        id: '1',
        text: 'Jane Doe',
        iconName: undefined,
        items: [
          { id: '1:profile', text: 'Profile' },
          { id: undefined, text: 'More', items: [{ id: '1:sign-out', text: 'Sign out' }] },
        ],
      },
      {
        id: '2:',
        text: 'Settings',
        iconName: 'settings',
        href: undefined,
        external: undefined,
        externalIconAriaLabel: undefined,
      },
    ]);
  });

  test('parses an item ID back into the utility index and the item ID', () => {
    expect(parseOverflowItemId('1:profile')).toEqual({ index: 1, itemId: 'profile' });
    expect(parseOverflowItemId('3:a:b')).toEqual({ index: 3, itemId: 'a:b' });
    expect(parseOverflowItemId('0:')).toEqual({ index: 0, itemId: '' });
  });
});
