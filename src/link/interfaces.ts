// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';

export interface LinkProps extends BaseComponentProps {
  /**
   * The text of the link.
   */
  children?: React.ReactNode;
  /**
   * The style of the link:
   * * `primary` is underlined. Use it for links next to other text, such as in a paragraph,
   *   a table cell or an alert.
   * * `secondary` is underlined only on hover. Use it where the context already shows that
   *   the text is a link, such as a list of links.
   * * `info` is a small bold link that opens help content, shown next to a heading or label.
   * * `value-large` shows a large number or value as a link, such as a count on a dashboard.
   */
  variant?: LinkProps.Variant;
  /**
   * The URL the link goes to. Without it, the link renders as a button and `target` is ignored.
   */
  href?: string;
  /**
   * Marks the link as going to another site. Adds an icon after the text, and opens the link
   * in a new tab unless `target` is set.
   */
  external?: boolean;
  /**
   * Accessible name of the external icon, such as "Opens in a new tab".
   */
  externalIconAriaLabel?: string;
  /**
   * Where to open the URL, as the native `target` attribute. With `_blank`, the link gets
   * `rel="noopener noreferrer"` unless `rel` is set.
   */
  target?: string;
  /**
   * The native `rel` attribute. Replaces the default `noopener noreferrer` for new tabs.
   */
  rel?: string;
  /**
   * The size of the text. `inherit` follows the surrounding text. `info` and `value-large`
   * links have a fixed size.
   */
  fontSize?: LinkProps.FontSize;
  /**
   * The color of the link. Use `inverted` on dark backgrounds. `info` links are always `normal`.
   */
  color?: LinkProps.Color;
  /**
   * Accessible name, when the text alone does not say where the link goes.
   */
  ariaLabel?: string;
  /**
   * Called when the user follows the link with a plain left click or the keyboard. Call
   * `preventDefault()` to handle navigation yourself, for example with a client-side router.
   */
  onFollow?: CancelableEventHandler<LinkProps.FollowDetail>;
  /**
   * Called on every click, including clicks with modifier keys. Use `onFollow` for navigation.
   */
  onClick?: NonCancelableEventHandler<LinkProps.ClickDetail>;
}

export namespace LinkProps {
  export type Variant = 'primary' | 'secondary' | 'info' | 'value-large';

  export type FontSize =
    | 'body-s'
    | 'body-m'
    | 'heading-xs'
    | 'heading-s'
    | 'heading-m'
    | 'heading-l'
    | 'heading-xl'
    | 'display-l'
    | 'inherit';

  export type Color = 'normal' | 'inverted';

  export interface FollowDetail {
    href?: string;
    external: boolean;
    target?: string;
  }

  export interface ClickDetail {
    button: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the link.
     */
    focus(): void;
  }
}
