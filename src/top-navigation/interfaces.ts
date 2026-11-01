// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonProps } from '../button/interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface TopNavigationProps extends BaseComponentProps {
  /**
   * The application's name and logo, shown at the start of the bar as a link to its home page:
   * * `href`: the URL of the home page.
   * * `title`: the name of the application.
   * * `logo`: an image with `src` and `alt`. Give it an `alt` when there is no `title`.
   * * `onFollow`: called when the user follows the link with a plain left click. Call
   *   `preventDefault()` to route on the client.
   */
  identity: TopNavigationProps.Identity;
  /**
   * Buttons and menus shown at the end of the bar, in order. As the bar narrows, utilities with
   * an icon first drop their text, then move into an overflow menu, starting with the first one.
   *
   * Every utility can have:
   * * `type`: `button` or `menu-dropdown`.
   * * `text`: the label of the utility.
   * * `iconName`: a built-in icon shown before the text, or alone when the text is collapsed.
   * * `ariaLabel`: the accessible name, for utilities without `text`. It also replaces `text`
   *   for screen readers, so mention a badge here, such as "Notifications (unread)".
   * * `badge`: shows a dot on the icon, for example for unread notifications.
   * * `disableTextCollapse`: keeps the text when the bar narrows.
   * * `disableUtilityCollapse`: keeps the utility out of the overflow menu.
   *
   * A `button` utility can also have:
   * * `variant`: `link` (the default) for a quiet button, or `primary-button`.
   * * `href`, `external` and `externalIconAriaLabel`: makes the utility a link.
   * * `onClick`: called when the user clicks it. For links, call `preventDefault()` to route on the client.
   *
   * A `menu-dropdown` utility opens a menu and can also have:
   * * `items`, `expandableGroups`, `onItemClick` and `onItemFollow`: as for a button dropdown.
   * * `title` and `description`: shown at the top of the menu, such as a user's name and email.
   */
  utilities?: ReadonlyArray<TopNavigationProps.Utility>;
  /**
   * A search field shown between the identity and the utilities, such as an `Input` of type `search`.
   */
  search?: React.ReactNode;
  /**
   * Built-in text:
   * * `overflowMenuTriggerText`: the accessible name of the button that opens the overflow menu.
   */
  i18nStrings?: TopNavigationProps.I18nStrings;
}

export namespace TopNavigationProps {
  export interface Logo {
    src: string;
    alt?: string;
  }

  export interface Identity {
    href: string;
    title?: string;
    logo?: Logo;
    onFollow?: CancelableEventHandler;
  }

  export interface BaseUtility {
    text?: string;
    iconName?: IconProps.Name;
    ariaLabel?: string;
    badge?: boolean;
    disableTextCollapse?: boolean;
    disableUtilityCollapse?: boolean;
  }

  export interface ButtonUtility extends BaseUtility {
    type: 'button';
    variant?: 'link' | 'primary-button';
    href?: string;
    external?: boolean;
    externalIconAriaLabel?: string;
    onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;
  }

  export interface MenuDropdownUtility extends BaseUtility {
    type: 'menu-dropdown';
    title?: string;
    description?: string;
    items: ButtonDropdownProps.Items;
    expandableGroups?: boolean;
    onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
    onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  }

  export type Utility = ButtonUtility | MenuDropdownUtility;

  export interface I18nStrings {
    overflowMenuTriggerText?: string;
  }
}
