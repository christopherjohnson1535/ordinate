// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type React from 'react';

/**
 * Whether a click on a link should be handled as in-page navigation. Clicks with a modifier
 * key or another button open the link elsewhere, so they are left to the browser.
 */
export function isPlainLeftClick(event: React.MouseEvent): boolean {
  return event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
}
