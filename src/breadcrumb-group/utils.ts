// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * How many items after the first one to hide behind the ellipsis so the rest fit in
 * `available`. The first item and the current page always stay. `widths` are the full
 * widths of the items, separators included.
 */
export function getHiddenCount(widths: ReadonlyArray<number>, ellipsisWidth: number, available: number): number {
  let total = widths.reduce((sum, width) => sum + width, 0);
  if (total <= available || widths.length <= 2) {
    return 0;
  }
  total += ellipsisWidth;
  let hidden = 0;
  for (let index = 1; index < widths.length - 1 && total > available; index++) {
    total -= widths[index];
    hidden++;
  }
  return hidden;
}
