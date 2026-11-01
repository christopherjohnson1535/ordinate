// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const defaultPageSize = 10;

export function normalizePageSize(pageSize: number | undefined): number {
  return pageSize !== undefined && Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : defaultPageSize;
}

/**
 * The number of pages for a number of items. An empty collection still has one page to show.
 */
export function getPagesCount(itemsCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemsCount / pageSize));
}

/**
 * Keeps a page number inside the pages that exist, for example after a filter removes the last pages.
 */
export function clampPageIndex(pageIndex: number, pagesCount: number): number {
  return Math.min(Math.max(1, Math.floor(pageIndex) || 1), pagesCount);
}

export function getPage<T>(items: ReadonlyArray<T>, pageIndex: number, pageSize: number): ReadonlyArray<T> {
  return items.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
}
