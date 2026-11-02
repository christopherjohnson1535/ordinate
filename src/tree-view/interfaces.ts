// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TreeViewProps<T = unknown> extends BaseComponentProps {
  /**
   * The top-level items. Their children come from `getItemChildren`, so the items can keep
   * whatever shape your data already has.
   */
  items: ReadonlyArray<T>;
  /**
   * Returns a unique and stable ID for an item. `expandedItems` and `onItemToggle` refer to
   * items by this ID.
   */
  getItemId: (item: T) => string;
  /**
   * Returns the children of an item, or `undefined` or an empty array for an item without
   * children. Only items with children can be expanded.
   */
  getItemChildren: (item: T) => ReadonlyArray<T> | undefined;
  /**
   * Describes how an item looks. `index` is the item's position among its siblings.
   *
   * * `content`: the item's main text.
   * * `secondaryContent`: a second line in secondary text, such as a description or a count.
   * * `icon`: an icon before the content.
   * * `actions`: controls at the end of the row, such as a button dropdown. They are only in
   *   the tab order while their item holds focus.
   * * `announcementLabel`: the item's accessible name, for when `content` is not plain text.
   */
  renderItem: (item: T, index: number) => TreeViewProps.TreeItem;
  /**
   * The IDs of the items that are expanded. Keep it in your state and update it from
   * `onItemToggle`. When it is not set, the tree keeps its own state and starts collapsed.
   */
  expandedItems?: ReadonlyArray<string>;
  /**
   * The ID of the item the user is on, such as the file open beside the tree. It is marked with the
   * position rule and read as the current item by screen readers. It does not move focus or expand the
   * items above it.
   */
  currentItemId?: string;
  /**
   * Called when the user expands or collapses an item, with the item, its ID and the new
   * state in `detail.expanded`.
   */
  onItemToggle?: NonCancelableEventHandler<TreeViewProps.ItemToggleDetail<T>>;
  /**
   * Replaces the icon of the expand and collapse button. It receives whether the item is
   * expanded.
   */
  renderItemToggleIcon?: (state: TreeViewProps.ToggleIconState) => React.ReactNode;
  /**
   * Accessible name of the tree. Set it, or `ariaLabelledby`, so the tree has a name.
   */
  ariaLabel?: string;
  /**
   * ID of the element that names the tree, such as a heading above it.
   */
  ariaLabelledby?: string;
  /**
   * ID of the element that describes the tree.
   */
  ariaDescribedby?: string;
  /**
   * Accessible names of the expand and collapse buttons:
   *
   * * `expandButtonLabel` returns the name of the button that expands an item.
   * * `collapseButtonLabel` returns the name of the button that collapses an item.
   */
  i18nStrings?: TreeViewProps.I18nStrings<T>;
}

export namespace TreeViewProps {
  export interface TreeItem {
    content: React.ReactNode;
    secondaryContent?: React.ReactNode;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    announcementLabel?: string;
  }

  export interface ItemToggleDetail<T> {
    id: string;
    item: T;
    expanded: boolean;
  }

  export interface ToggleIconState {
    expanded: boolean;
  }

  export interface I18nStrings<T> {
    expandButtonLabel?: (item: T) => string;
    collapseButtonLabel?: (item: T) => string;
  }
}
