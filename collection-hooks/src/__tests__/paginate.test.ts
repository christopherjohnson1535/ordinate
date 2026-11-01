// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { clampPageIndex, defaultPageSize, getPage, getPagesCount, normalizePageSize } from '../operations/paginate';

describe('pagination helpers', () => {
  test('counts pages, with one page for no items', () => {
    expect(getPagesCount(0, 10)).toBe(1);
    expect(getPagesCount(10, 10)).toBe(1);
    expect(getPagesCount(11, 10)).toBe(2);
    expect(getPagesCount(25, 5)).toBe(5);
  });

  test('keeps the page inside the pages that exist', () => {
    expect(clampPageIndex(3, 5)).toBe(3);
    expect(clampPageIndex(9, 5)).toBe(5);
    expect(clampPageIndex(0, 5)).toBe(1);
    expect(clampPageIndex(-2, 5)).toBe(1);
    expect(clampPageIndex(Number.NaN, 5)).toBe(1);
    expect(clampPageIndex(2.7, 5)).toBe(2);
  });

  test('cuts out one page', () => {
    const items = Array.from({ length: 12 }, (_, index) => index);
    expect(getPage(items, 1, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(getPage(items, 3, 5)).toEqual([10, 11]);
  });

  test('falls back to the default page size for unusable values', () => {
    expect(normalizePageSize(undefined)).toBe(defaultPageSize);
    expect(normalizePageSize(0)).toBe(defaultPageSize);
    expect(normalizePageSize(-5)).toBe(defaultPageSize);
    expect(normalizePageSize(Number.POSITIVE_INFINITY)).toBe(defaultPageSize);
    expect(normalizePageSize(25)).toBe(25);
    expect(normalizePageSize(7.5)).toBe(7);
  });
});
