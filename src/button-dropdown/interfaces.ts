// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonProps } from '../button/interfaces';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface ButtonDropdownProps extends BaseComponentProps {
  /**
   * The items of the menu. Put items in a group to show them under a heading, separated
   * from the rest.
   *
   * Each item can have:
   * * `id`: identifies the item in `onItemClick`.
   * * `text`: the label of the item.
   * * `lang`: the language of the label, as a BCP 47 tag.
   * * `itemType`: `action` (the default) or `checkbox`, for an item that turns a setting on or off.
   * * `checked`: whether a checkbox item is on.
   * * `disabled`: shows the item but prevents choosing it.
   * * `disabledReason`: says why the item is disabled. Shown when the item is highlighted.
   * * `description`: secondary text below the label.
   * * `secondaryText`: a short text at the end of the item, such as a keyboard shortcut.
   * * `iconName`: a built-in icon shown before the label.
   * * `href`: makes the item a link to this URL.
   * * `external`: marks the link as one that leaves the application and opens it in a new tab.
   * * `externalIconAriaLabel`: what screen readers hear for the external icon.
   *
   * A group has `text`, `items` and optionally `id`, `iconName` and `disabled`. A disabled
   * group disables its items. With `expandableGroups`, groups open in place like sub-menus.
   */
  items: ButtonDropdownProps.Items;
  /**
   * Shows groups as collapsed entries that open in place to reveal their items, like sub-menus.
   * Use it for long menus with natural categories.
   */
  expandableGroups?: boolean;
  /**
   * Called when the user chooses an item, with its `id`, and its `href`, `external` and `checked`
   * when set. For a checkbox item, `checked` is the state it should change to. For a link item,
   * call `preventDefault()` to stop the browser from following it, for example to route on the client.
   */
  onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  /**
   * Called when the user follows a link item with a plain left click or Enter, after `onItemClick`.
   * Call `preventDefault()` to route on the client instead.
   */
  onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  /**
   * Text of the button that opens the menu.
   */
  children?: React.ReactNode;
  /**
   * The style of the button:
   * * `normal` for most menus.
   * * `primary` for the main action of a page, offered with alternatives.
   * * `icon` for an icon-only button with a frame, such as in a toolbar.
   * * `inline-icon` for a small icon-only button without a frame, such as in a table row.
   */
  variant?: ButtonDropdownProps.Variant;
  /**
   * Turns the button into a split button: a main action, and a narrow button next to it
   * that opens the menu. The main action has `text`, and optionally `onClick`, `href`,
   * `external`, `externalIconAriaLabel`, `iconName`, `disabled`, `loading`, `loadingText`
   * and `ariaLabel`. Only the `normal` and `primary` variants support it.
   */
  mainAction?: ButtonDropdownProps.MainAction;
  /**
   * Positions the menu against the viewport, so containers with hidden overflow, such as
   * tables and modals, do not clip it.
   */
  expandToViewport?: boolean;
  /**
   * Renders the button as disabled. The menu cannot be opened.
   */
  disabled?: boolean;
  /**
   * Shows a loading indicator in the button. The menu cannot be opened.
   */
  loading?: boolean;
  /**
   * Announced to screen readers when `loading` turns on.
   */
  loadingText?: string;
  /**
   * Accessible name of the button that opens the menu. Needed for the icon variants and
   * the split button, where the button has no text of its own.
   */
  ariaLabel?: string;
}

export namespace ButtonDropdownProps {
  export type Variant = 'normal' | 'primary' | 'icon' | 'inline-icon';

  export type ItemType = 'action' | 'checkbox';

  export interface Item {
    id: string;
    text: string;
    lang?: string;
    itemType?: ItemType;
    checked?: boolean;
    disabled?: boolean;
    disabledReason?: string;
    description?: string;
    secondaryText?: string;
    iconName?: IconProps.Name;
    href?: string;
    external?: boolean;
    externalIconAriaLabel?: string;
  }

  export interface CheckboxItem extends Item {
    itemType: 'checkbox';
    checked: boolean;
  }

  export interface ItemGroup {
    id?: string;
    text: string;
    iconName?: IconProps.Name;
    disabled?: boolean;
    items: Items;
  }

  export type ItemOrGroup = Item | CheckboxItem | ItemGroup;

  export type Items = ReadonlyArray<ItemOrGroup>;

  export interface ItemClickDetails {
    id: string;
    href?: string;
    external?: boolean;
    checked?: boolean;
  }

  export interface MainAction {
    text: string;
    onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;
    href?: string;
    external?: boolean;
    externalIconAriaLabel?: string;
    iconName?: IconProps.Name;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    ariaLabel?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the button that opens the menu.
     */
    focus(): void;
  }
}
