// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ToggleButtonProps extends BaseComponentProps {
  /**
   * Whether the button is pressed. The button is controlled: update this in `onChange`.
   */
  pressed: boolean;
  /**
   * Called when the user presses or releases the button, with the new state in `event.detail.pressed`.
   */
  onChange?: NonCancelableEventHandler<ToggleButtonProps.ChangeDetail>;
  /**
   * Text displayed in the button. Keep it the same in both states, because the pressed
   * state is announced separately.
   */
  children?: React.ReactNode;
  /**
   * The style of the button:
   * * `normal` for a button with text.
   * * `icon` for an icon-only button. Requires `iconName` and `ariaLabel`.
   */
  variant?: ToggleButtonProps.Variant;
  /**
   * A built-in icon shown before the text, or alone in the `icon` variant.
   */
  iconName?: IconProps.Name;
  /**
   * The icon shown while the button is pressed, such as a filled version of `iconName`.
   * Falls back to `iconName`.
   */
  pressedIconName?: IconProps.Name;
  /**
   * Renders the button as disabled and prevents clicks. A disabled button cannot be focused.
   */
  disabled?: boolean;
  /**
   * Shows a loading indicator and prevents clicks while the change is saved.
   * The button stays focusable so keyboard users keep their place.
   */
  loading?: boolean;
  /**
   * Announced to screen readers when `loading` turns on, for example "Saving".
   */
  loadingText?: string;
  /**
   * Accessible name for the button. Required for the `icon` variant.
   */
  ariaLabel?: string;
}

export namespace ToggleButtonProps {
  export type Variant = 'normal' | 'icon';

  export interface ChangeDetail {
    pressed: boolean;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the button.
     */
    focus(): void;
  }
}
