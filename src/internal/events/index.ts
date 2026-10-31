// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type React from 'react';

export type CancelableCustomEvent<Detail> = CustomEvent<Detail>;

export interface NonCancelableCustomEvent<Detail> extends Omit<CustomEvent<Detail>, 'preventDefault'> {}

export type CancelableEventHandler<Detail = null> = (event: CancelableCustomEvent<Detail>) => void;

export type NonCancelableEventHandler<Detail = null> = (event: NonCancelableCustomEvent<Detail>) => void;

function createCustomEvent<Detail>(detail: Detail, cancelable: boolean): CustomEvent<Detail> {
  return new CustomEvent('ordinate', { detail, cancelable });
}

export function fireNonCancelableEvent<Detail>(handler: NonCancelableEventHandler<Detail> | undefined, detail: Detail) {
  handler?.(createCustomEvent(detail, false));
}

/**
 * Calls `handler` with a cancelable event. When the handler calls
 * `preventDefault()`, the default action of `sourceEvent` is prevented too.
 * Returns whether the event was cancelled.
 */
export function fireCancelableEvent<Detail>(
  handler: CancelableEventHandler<Detail> | undefined,
  detail: Detail,
  sourceEvent?: { preventDefault(): void }
): boolean {
  if (!handler) {
    return false;
  }
  const event = createCustomEvent(detail, true);
  handler(event);
  if (event.defaultPrevented) {
    sourceEvent?.preventDefault();
  }
  return event.defaultPrevented;
}

export interface KeyDetail {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  /**
   * Whether the key was pressed while an input method editor was composing text.
   */
  isComposing: boolean;
}

/**
 * Calls `handler` with the key and modifiers of a React keyboard event.
 * Calling `preventDefault()` in the handler prevents the native default.
 */
export function fireKeyboardEvent(
  handler: CancelableEventHandler<KeyDetail> | undefined,
  event: React.KeyboardEvent
): boolean {
  const { key, ctrlKey, shiftKey, altKey, metaKey } = event;
  return fireCancelableEvent(
    handler,
    { key, ctrlKey, shiftKey, altKey, metaKey, isComposing: event.nativeEvent.isComposing },
    event
  );
}
