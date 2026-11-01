// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';

export interface ActionCardProps extends BaseComponentProps {
  /**
   * The title of the card. It names the card's action for assistive technology, so make it say
   * what happens, such as "Create a cluster". Use text, not headings or other blocks.
   */
  header: React.ReactNode;
  /**
   * Text below the header that explains the action. It becomes the card's accessible description.
   */
  description?: React.ReactNode;
  /**
   * More content below the description. Keep it to text: the whole card is one button or link, so it
   * cannot contain other controls.
   */
  children?: React.ReactNode;
  /**
   * A built-in icon at the start of the card that pictures the action.
   */
  iconName?: IconProps.Name;
  /**
   * The URL the card goes to. With it, the card is a link; without it, the card is a button.
   */
  href?: string;
  /**
   * Where to open `href`, as the native `target` attribute. With `_blank`, the link gets
   * `rel="noopener noreferrer"`.
   */
  target?: string;
  /**
   * Called when the user activates a card without `href`.
   */
  onClick?: NonCancelableEventHandler;
  /**
   * Called when the user follows a card with `href` by a plain left click or the keyboard. Call
   * `preventDefault()` to handle navigation yourself, for example with a client-side router.
   */
  onFollow?: CancelableEventHandler<ActionCardProps.FollowDetail>;
  /**
   * Prevents the action. A disabled link card loses its URL and is marked with `aria-disabled`.
   */
  disabled?: boolean;
  /**
   * Accessible name, when the header alone does not say what the card does.
   */
  ariaLabel?: string;
}

export namespace ActionCardProps {
  export interface FollowDetail {
    href?: string;
    target?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the card.
     */
    focus(): void;
  }
}
