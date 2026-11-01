// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type React from 'react';

import { CancelableEventHandler, fireCancelableEvent } from './events';
import { isPlainLeftClick } from './link-click';

/**
 * What a website component passes to `onFollow` when someone follows one of its links.
 */
export interface SiteLinkFollowDetail {
  href: string;
  text: string;
}

export type SiteLinkFollowHandler = CancelableEventHandler<SiteLinkFollowDetail>;

/**
 * Fires `onFollow` for a plain click on a link, so a single-page app can route it and call
 * `preventDefault()`. Clicks that open the link elsewhere are left to the browser.
 */
export function followLink(
  onFollow: SiteLinkFollowHandler | undefined,
  detail: SiteLinkFollowDetail,
  event: React.MouseEvent
): boolean {
  if (!isPlainLeftClick(event)) {
    return false;
  }
  return fireCancelableEvent(onFollow, detail, event);
}
