// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface IndexListProps extends BaseComponentProps {
  /**
   * The rows of the list. Each needs a unique `id`.
   */
  items: ReadonlyArray<IndexListProps.Item>;
  /**
   * * `leaders` joins each name to its value with a dotted line, like a contents page or a price
   *   list.
   * * `numbered` sets each row in columns (number, name, details, value) with a rule between rows,
   *   like a project index. Rows stack in narrow spaces.
   */
  variant?: IndexListProps.Variant;
  /**
   * `large` sets the names in the style's headline type, for a list that is the main thing on the
   * page.
   */
  size?: IndexListProps.Size;
  /**
   * Whether the order of the rows matters. An ordered list is announced with each row's position,
   * and rows without their own `number` are numbered 1, 2, 3.
   */
  ordered?: boolean;
  /**
   * Names the list for screen readers, such as "Contents" or "Selected projects". Leave it out when a
   * visible heading right above the list already says it.
   */
  ariaLabel?: string;
  /**
   * Called when someone follows a row's link with a plain click. Call `event.preventDefault()` to
   * handle the navigation yourself, for example with your site's router.
   */
  onFollow?: CancelableEventHandler<IndexListProps.FollowDetail>;
}

export namespace IndexListProps {
  export type Variant = 'leaders' | 'numbered';
  export type Size = 'default' | 'large';

  export interface Item {
    /**
     * A unique key for the row.
     */
    id: string;
    /**
     * The name in the row, such as a chapter, a service or a project.
     */
    label: React.ReactNode;
    /**
     * Makes the name a link. A click anywhere on the row follows it.
     */
    href?: string;
    /**
     * The value at the end of the row, such as a page number, a price or a year.
     */
    value?: React.ReactNode;
    /**
     * A few words about the row, such as the client or the kind of work.
     */
    meta?: React.ReactNode;
    /**
     * The row's own number or reference, such as "01" or "A-4". Replaces the automatic number of an
     * ordered list.
     */
    number?: string;
  }

  export interface FollowDetail {
    id: string;
    href: string;
  }
}
