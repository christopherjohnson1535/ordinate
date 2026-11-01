// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// The same event shape as the components' `onX` handlers, so chart and component handlers read alike.
export interface NonCancelableCustomEvent<Detail> extends Omit<CustomEvent<Detail>, 'preventDefault'> {}

export type NonCancelableEventHandler<Detail = null> = (event: NonCancelableCustomEvent<Detail>) => void;

export function fireNonCancelableEvent<Detail>(handler: NonCancelableEventHandler<Detail> | undefined, detail: Detail) {
  handler?.(new CustomEvent('ordinate', { detail, cancelable: false }));
}
