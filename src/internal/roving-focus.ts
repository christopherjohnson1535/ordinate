// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type RovingMove = 'next' | 'previous' | 'first' | 'last';

/**
 * Finds the index of the item that takes focus after a move in a roving-focus
 * group, skipping items that cannot take focus. `next` and `previous` wrap around
 * the ends; `current` may be -1 when no item has focus yet. Returns -1 when no
 * item can take focus.
 */
export function getRovingIndex(
  move: RovingMove,
  current: number,
  count: number,
  canFocus: (index: number) => boolean = () => true
): number {
  if (count === 0) {
    return -1;
  }
  const step = move === 'next' || move === 'first' ? 1 : -1;
  let start: number;
  if (move === 'first') {
    start = 0;
  } else if (move === 'last') {
    start = count - 1;
  } else if (current < 0) {
    start = step === 1 ? 0 : count - 1;
  } else {
    start = current + step;
  }
  const wraps = move === 'next' || move === 'previous';
  for (let offset = 0; offset < count; offset++) {
    const index = start + offset * step;
    if (!wraps && (index < 0 || index >= count)) {
      break;
    }
    const wrapped = ((index % count) + count) % count;
    if (canFocus(wrapped)) {
      return wrapped;
    }
  }
  return -1;
}
