// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Whether `element` is laid out right to left, from the inherited `dir` attribute or
 * `direction` property. Use it for logic CSS cannot express, such as which arrow key
 * moves to the next tab.
 */
export function getIsRtl(element: Element | null): boolean {
  if (!element || typeof window === 'undefined') {
    return false;
  }
  return window.getComputedStyle(element).direction === 'rtl';
}

/**
 * Maps a horizontal arrow key to a logical step: `1` toward the end of the line and
 * `-1` toward the start, accounting for right-to-left layout. Other keys return `0`.
 */
export function getLogicalArrowStep(key: string, element: Element | null): -1 | 0 | 1 {
  if (key !== 'ArrowRight' && key !== 'ArrowLeft') {
    return 0;
  }
  const forward = key === 'ArrowRight' ? 1 : -1;
  return getIsRtl(element) ? (-forward as -1 | 1) : forward;
}
