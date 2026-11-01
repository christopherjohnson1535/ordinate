// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

/**
 * NavigableGroup adds keyboard behavior only. It draws nothing of its own: lay out and style the
 * children as you would without it.
 */
export interface NavigableGroupProps extends BaseComponentProps {
  /**
   * The content of the group. Every focusable element inside it, such as a button or a link,
   * becomes an item of the group, except items inside a nested navigable group.
   */
  children?: React.ReactNode;
  /**
   * Which arrow keys move between the items: Left and Right for `horizontal`, Up and Down for
   * `vertical`, and all four for `both`. Left and Right follow the reading direction, so Right
   * moves backward in right-to-left layout. Home and End always move to the first and last item.
   */
  navigationDirection: NavigableGroupProps.NavigationDirection;
  /**
   * Returns a key that identifies an item across renders, so the group remembers which item holds
   * the tab stop while its children change. For example `element => element.dataset.itemId`.
   */
  getItemKey: (element: HTMLElement) => string;
  /**
   * Whether moving past the last item goes to the first, and the other way round.
   */
  loopFocus?: boolean;
  /**
   * Accessible name of the group. Give a group a name whenever it has a role.
   */
  ariaLabel?: string;
  /**
   * Replaces the `group` role, for example with `toolbar` for a row of actions or `radiogroup`.
   */
  role?: string;
}

export namespace NavigableGroupProps {
  export type NavigationDirection = 'horizontal' | 'vertical' | 'both';

  export interface Ref {
    /**
     * Moves keyboard focus to the item that holds the tab stop.
     */
    focus(): void;
  }
}
