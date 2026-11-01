// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ListProps<T = unknown> extends BaseComponentProps {
  /**
   * The items to show, one row each.
   */
  items: ReadonlyArray<T>;
  /**
   * Returns how a row shows an item:
   * * `id`: a key that is unique in the list and stays the same for the item.
   * * `content`: the main text of the row.
   * * `secondaryContent` (optional): smaller text below the main text.
   * * `icon` (optional): an icon before the text. Use the Icon component.
   * * `actions` (optional): controls at the end of the row, such as an icon button.
   */
  renderItem: (item: T) => ListProps.RenderedItem;
  /**
   * The list element: `ul` for a plain list, `ol` when the order matters, such as steps or a ranking.
   * Sortable lists are ordered lists unless this is set.
   */
  tagOverride?: ListProps.TagOverride;
  /**
   * Accessible name of the list.
   */
  ariaLabel?: string;
  /**
   * Adds buttons to each row that move it up or down. The order is controlled: update `items` in
   * `onSortingChange`.
   */
  sortable?: boolean;
  /**
   * Called when the user moves a row, with the items in their new order in `event.detail.items`.
   */
  onSortingChange?: NonCancelableEventHandler<ListProps.SortingChangeDetail<T>>;
  /**
   * Accessible names of the buttons of a sortable list:
   * * `moveUpAriaLabel`: the button that moves a row up.
   * * `moveDownAriaLabel`: the button that moves a row down.
   * The row's content names the group the two buttons are in.
   */
  i18nStrings?: ListProps.I18nStrings;
}

export namespace ListProps {
  export type TagOverride = 'ul' | 'ol';

  export interface RenderedItem {
    id: string;
    content: React.ReactNode;
    secondaryContent?: React.ReactNode;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
  }

  export interface SortingChangeDetail<T> {
    items: T[];
  }

  export interface I18nStrings {
    moveUpAriaLabel?: string;
    moveDownAriaLabel?: string;
  }
}
