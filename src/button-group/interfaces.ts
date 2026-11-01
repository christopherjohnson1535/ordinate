// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ButtonGroupProps extends BaseComponentProps {
  /**
   * The actions of the toolbar, in order. Each entry has a `type`:
   * * `icon-button`: an action with `id`, `text`, `iconName` or `iconSvg`, and optionally
   *   `disabled`, `loading`, `loadingText` and `popoverFeedback`.
   * * `icon-toggle-button`: an action that stays pressed, with `pressed` and optionally
   *   `pressedIconName`, besides the fields of an icon button.
   * * `menu-dropdown`: a button that opens a menu of `items`, shaped like the items of a
   *   button dropdown. It shows `iconName`, or an ellipsis.
   * * `group`: related actions under a `text` label, with their own `items`. Groups are
   *   separated from what is next to them by a rule.
   *
   * Every action shows its `text` in a tooltip on hover and focus, and `text` is also its
   * accessible name, so keep it short: "Copy", "Thumbs up".
   */
  items: ReadonlyArray<ButtonGroupProps.ItemOrGroup>;
  /**
   * Called when the user activates an action or chooses a menu item, with the `id`. For a
   * toggle button, `pressed` is the state it should change to; for a checkbox menu item,
   * `checked` is. Update `items` to reflect it.
   */
  onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  /**
   * The style of the actions. `icon` shows compact icon buttons without a frame.
   */
  variant?: ButtonGroupProps.Variant;
  /**
   * Accessible name of the toolbar, such as "Response actions".
   */
  ariaLabel: string;
}

export namespace ButtonGroupProps {
  export type Variant = 'icon';

  export interface IconButton {
    type: 'icon-button';
    id: string;
    text: string;
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    /**
     * A short message shown next to the button and announced after it is clicked, such as "Copied".
     */
    popoverFeedback?: React.ReactNode;
  }

  export interface IconToggleButton {
    type: 'icon-toggle-button';
    id: string;
    text: string;
    pressed: boolean;
    iconName?: IconProps.Name;
    pressedIconName?: IconProps.Name;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    popoverFeedback?: React.ReactNode;
  }

  export interface MenuDropdown {
    type: 'menu-dropdown';
    id: string;
    text: string;
    items: ButtonDropdownProps.Items;
    iconName?: IconProps.Name;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
  }

  export type Item = IconButton | IconToggleButton | MenuDropdown;

  export interface Group {
    type: 'group';
    text: string;
    items: ReadonlyArray<Item>;
  }

  export type ItemOrGroup = Item | Group;

  export interface ItemClickDetails {
    id: string;
    pressed?: boolean;
    checked?: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the action with this `id`. The ID of a menu item is not accepted.
     */
    focus(itemId: string): void;
  }
}
