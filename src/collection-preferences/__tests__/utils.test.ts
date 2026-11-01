// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { createDraft, moveItem, normalizeContentDisplay } from '../../../lib/components/collection-preferences/utils';

const options = [
  { id: 'name', label: 'Name', alwaysVisible: true },
  { id: 'zone', label: 'Zone' },
  { id: 'cpu', label: 'CPU' },
];

describe('normalizeContentDisplay', () => {
  test('shows every column in option order without a stored order', () => {
    expect(normalizeContentDisplay(options, undefined)).toEqual([
      { id: 'name', visible: true },
      { id: 'zone', visible: true },
      { id: 'cpu', visible: true },
    ]);
  });

  test('keeps the stored order, drops unknown and repeated columns and adds missing ones hidden', () => {
    expect(
      normalizeContentDisplay(options, [
        { id: 'cpu', visible: true },
        { id: 'old', visible: true },
        { id: 'cpu', visible: false },
        { id: 'zone', visible: false },
      ])
    ).toEqual([
      { id: 'cpu', visible: true },
      { id: 'zone', visible: false },
      { id: 'name', visible: true },
    ]);
  });

  test('shows always-visible columns even when stored as hidden', () => {
    expect(normalizeContentDisplay(options, [{ id: 'name', visible: false }])[0]).toEqual({
      id: 'name',
      visible: true,
    });
  });
});

describe('moveItem', () => {
  test('moves an item up or down in a copy', () => {
    const items = ['a', 'b', 'c', 'd'];
    expect(moveItem(items, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
    expect(moveItem(items, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(items).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('createDraft', () => {
  test('copies the preferences and lines up the columns when there is a column list', () => {
    const preferences = { pageSize: 10, contentDisplay: [{ id: 'zone', visible: true }] };
    const draft = createDraft(preferences, options);
    expect(draft).not.toBe(preferences);
    expect(draft.pageSize).toBe(10);
    expect(draft.contentDisplay!.map(item => item.id)).toEqual(['zone', 'name', 'cpu']);
  });

  test('leaves the stored columns alone without a column list', () => {
    const contentDisplay = [{ id: 'gone', visible: true }];
    expect(createDraft({ contentDisplay }, undefined).contentDisplay).toBe(contentDisplay);
    expect(createDraft(undefined, undefined)).toEqual({});
  });
});
