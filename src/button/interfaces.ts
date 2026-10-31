// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface ButtonProps extends BaseComponentProps {
  /**
   * Text displayed in the button.
   */
  children?: React.ReactNode;
  /**
   * The style of the button:
   * * `normal` for most actions.
   * * `primary` for the main action of a page or form. Use one per view.
   * * `link` for low-emphasis actions next to other content.
   * * `destructive` for actions that delete or cannot be undone.
   * * `icon` for an icon-only button. Requires `iconName` or `iconSvg`, and `ariaLabel`.
   */
  variant?: ButtonProps.Variant;
  /**
   * Renders the button as disabled and prevents clicks. A disabled button cannot be focused.
   */
  disabled?: boolean;
  /**
   * Shows a loading indicator and prevents clicks while an action is in progress.
   * Unlike `disabled`, the button stays focusable so keyboard users keep their place.
   */
  loading?: boolean;
  /**
   * Announced to screen readers when `loading` turns on, for example "Saving changes".
   */
  loadingText?: string;
  /**
   * A built-in icon shown next to the text. Use `iconAlign` to choose the side.
   */
  iconName?: IconProps.Name;
  /**
   * The side of the text the icon is on. The `icon` variant ignores it.
   */
  iconAlign?: ButtonProps.IconAlign;
  /**
   * A custom icon, used instead of `iconName`. Draw it on a 16 by 16 grid with `stroke="currentColor"`
   * so it follows the button's state.
   */
  iconSvg?: React.ReactNode;
  /**
   * Lets long text wrap onto more lines. Set it to `false` to keep the text on one line.
   */
  wrapText?: boolean;
  /**
   * Renders the button as a link (`<a>`) to this URL.
   */
  href?: string;
  /**
   * Where to open the link, such as `_blank` for a new tab. Only applies with `href`.
   */
  target?: string;
  /**
   * The `rel` attribute of the link. Defaults to `noopener noreferrer` when the link opens in a new tab.
   * Only applies with `href`.
   */
  rel?: string;
  /**
   * Marks the link as one that leaves the application. Adds the external icon and,
   * with `href`, opens the link in a new tab. Screen readers hear `externalIconAriaLabel`.
   */
  external?: boolean;
  /**
   * What screen readers hear for the external icon.
   */
  externalIconAriaLabel?: string;
  /**
   * Asks the browser to download the linked file instead of opening it. A string suggests the file name.
   * Only applies with `href`.
   */
  download?: boolean | string;
  /**
   * With `submit`, the button submits the form it is in. With `none`, it renders `type="button"`.
   */
  formAction?: ButtonProps.FormAction;
  /**
   * The ID of the form the button submits, for buttons placed outside that form, such as in a modal footer.
   */
  form?: string;
  /**
   * Stretches the button to the full width of its container.
   */
  fullWidth?: boolean;
  /**
   * Accessible name for the button. Required for the `icon` variant. It replaces the text
   * for screen readers, so for an external link, say that it opens in a new tab.
   */
  ariaLabel?: string;
  /**
   * Whether the element the button controls is expanded. Use it for buttons that open and close
   * a section or a menu.
   */
  ariaExpanded?: boolean;
  /**
   * The kind of popup the button opens, such as `menu` or `dialog`.
   */
  ariaHaspopup?: ButtonProps.AriaHaspopup;
  /**
   * The ID of the element the button controls.
   */
  ariaControls?: string;
  /**
   * Called when the user clicks the button, unless it is disabled or loading.
   * For links, call `preventDefault()` to stop navigation.
   */
  onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;
}

export namespace ButtonProps {
  export type Variant = 'normal' | 'primary' | 'link' | 'destructive' | 'icon';

  export type FormAction = 'submit' | 'none';

  export type IconAlign = 'left' | 'right';

  export type AriaHaspopup = boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  export interface ClickDetail {
    button: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the button.
     */
    focus(): void;
  }
}
