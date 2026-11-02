// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

// The row keeps the same number of slots as the current page moves, so the arrows stay put.
const slots = 7;

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(to - from + 1, 0) }, (_, index) => from + index);
}

/**
 * The page numbers to show, with ellipses for the pages left out. The first page, the
 * current page and its neighbours are always shown, and the last page too unless the
 * range is open-ended, where a trailing ellipsis stands for the pages not loaded yet.
 */
export function getPageItems(current: number, count: number, openEnd: boolean): PageItem[] {
  if (openEnd) {
    if (count < slots) {
      return [...range(1, count), 'ellipsis-end'];
    }
    if (current <= 4) {
      return [...range(1, 5), 'ellipsis-end'];
    }
    return [1, 'ellipsis-start', ...range(current - 1, Math.min(current + 1, count)), 'ellipsis-end'];
  }
  if (count <= slots) {
    return range(1, count);
  }
  if (current <= 4) {
    return [...range(1, 5), 'ellipsis-end', count];
  }
  if (current >= count - 3) {
    return [1, 'ellipsis-start', ...range(count - 4, count)];
  }
  return [1, 'ellipsis-start', current - 1, current, current + 1, 'ellipsis-end', count];
}

/**
 * The page number as it is lettered on the button. Under 100 pages, numbers take two digits, "03", so the
 * buttons keep one width, like the sheet numbers of a drawing set.
 */
export function formatPageNumber(pageNumber: number, count: number): string {
  return count < 100 ? String(pageNumber).padStart(2, '0') : String(pageNumber);
}
