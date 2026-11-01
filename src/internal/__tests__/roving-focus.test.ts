// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { getRovingIndex } from '../../../lib/components/internal/roving-focus';

describe('getRovingIndex', () => {
  const enabled = [true, false, true, true, false];
  const canFocus = (index: number) => enabled[index];

  test('moves to the next and previous focusable items, wrapping around', () => {
    expect(getRovingIndex('next', 0, 5, canFocus)).toBe(2);
    expect(getRovingIndex('next', 3, 5, canFocus)).toBe(0);
    expect(getRovingIndex('previous', 2, 5, canFocus)).toBe(0);
    expect(getRovingIndex('previous', 0, 5, canFocus)).toBe(3);
  });

  test('moves to the first and last focusable items', () => {
    expect(getRovingIndex('first', 3, 5, canFocus)).toBe(0);
    expect(getRovingIndex('last', 0, 5, canFocus)).toBe(3);
  });

  test('starts from the matching end when nothing has focus', () => {
    expect(getRovingIndex('next', -1, 5, canFocus)).toBe(0);
    expect(getRovingIndex('previous', -1, 5, canFocus)).toBe(3);
  });

  test('treats every item as focusable by default', () => {
    expect(getRovingIndex('next', 1, 3)).toBe(2);
    expect(getRovingIndex('last', 0, 3)).toBe(2);
  });

  test('returns -1 when no item can take focus', () => {
    expect(getRovingIndex('next', 0, 0)).toBe(-1);
    expect(getRovingIndex('first', 0, 2, () => false)).toBe(-1);
    expect(getRovingIndex('next', 0, 2, () => false)).toBe(-1);
  });
});
