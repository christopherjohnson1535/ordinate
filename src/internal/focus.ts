// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type React from 'react';

const tabbableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
]
  .map(selector => `${selector}:not([tabindex^="-"])`)
  .join(', ');

/**
 * The elements inside `container` that Tab can reach, in document order.
 */
export function getTabbableElements(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(tabbableSelector)).filter(
    element => !element.closest('[hidden], [inert]')
  );
}

/**
 * The first element inside `container` that Tab can reach, if any.
 */
export function getFirstTabbable(container: Element): HTMLElement | null {
  return getTabbableElements(container)[0] ?? null;
}

/**
 * Keeps Tab and Shift+Tab inside `container` by wrapping from the last tabbable
 * element to the first and back. Call it from a keydown handler on the container.
 */
export function wrapTabFocus(event: React.KeyboardEvent | KeyboardEvent, container: Element): void {
  if (event.key !== 'Tab') {
    return;
  }
  const tabbable = getTabbableElements(container);
  if (tabbable.length === 0) {
    event.preventDefault();
    return;
  }
  const first = tabbable[0];
  const last = tabbable[tabbable.length - 1];
  const active = container.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || active === container)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
