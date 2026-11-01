// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getLogicalArrowStep } from '../internal/direction';
import { RovingMove } from '../internal/roving-focus';
import { NavigableGroupProps } from './interfaces';

/**
 * Marks the root of every navigable group, so a group can leave the items of a nested group to it.
 */
export const groupAttribute = 'data-navigable-group';

/**
 * Marks the elements a group manages. A focusable element that its author took out of the tab
 * order with `tabindex="-1"` has no mark, and stays out of the group.
 */
const itemAttribute = 'data-navigable-group-item';

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  'iframe',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(', ');

function isItem(element: HTMLElement, root: HTMLElement): boolean {
  if (element.closest(`[${groupAttribute}]`) !== root) {
    return false;
  }
  if (element.matches(':disabled') || element.closest('[hidden], [inert]')) {
    return false;
  }
  return element.getAttribute('tabindex') !== '-1' || element.hasAttribute(itemAttribute);
}

/**
 * The items of the group in document order: its focusable descendants that are not disabled,
 * hidden or inside a nested group. Marks each one as managed by the group.
 */
export function getGroupItems(root: HTMLElement): HTMLElement[] {
  const items = Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(element =>
    isItem(element, root)
  );
  for (const item of items) {
    if (!item.hasAttribute(itemAttribute)) {
      item.setAttribute(itemAttribute, '');
    }
  }
  return items;
}

const textInputTypes = new Set([
  'text',
  'search',
  'email',
  'url',
  'tel',
  'password',
  'number',
  'date',
  'datetime-local',
  'month',
  'time',
  'week',
]);

/**
 * Whether arrow keys already mean something inside the element, such as moving the caret.
 */
export function isTextEntry(element: HTMLElement): boolean {
  if (element instanceof HTMLInputElement) {
    return textInputTypes.has(element.type);
  }
  return element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement || element.isContentEditable;
}

/**
 * The move a key asks for in a group navigated in `direction`, or null for other keys.
 */
export function getGroupMove(
  key: string,
  direction: NavigableGroupProps.NavigationDirection,
  element: Element
): RovingMove | null {
  if (key === 'Home') {
    return 'first';
  }
  if (key === 'End') {
    return 'last';
  }
  if (direction !== 'vertical') {
    const step = getLogicalArrowStep(key, element);
    if (step !== 0) {
      return step === 1 ? 'next' : 'previous';
    }
  }
  if (direction !== 'horizontal') {
    if (key === 'ArrowDown') {
      return 'next';
    }
    if (key === 'ArrowUp') {
      return 'previous';
    }
  }
  return null;
}
