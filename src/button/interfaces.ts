// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

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
   * * `icon` for an icon-only button. Requires `iconSvg` and `ariaLabel`.
   */
  variant?: ButtonProps.Variant;
  /**
   * Renders the button as disabled and prevents clicks.
   */
  disabled?: boolean;
  /**
   * Renders the button as a link (`<a>`) to this URL.
   */
  href?: string;
  /**
   * With `submit`, the button submits the form it is in. With `none`, it renders `type="button"`.
   */
  formAction?: ButtonProps.FormAction;
  /**
   * Stretches the button to the full width of its container.
   */
  fullWidth?: boolean;
  /**
   * Accessible name for the button. Required for the `icon` variant.
   */
  ariaLabel?: string;
  /**
   * Icon for the `icon` variant. Draw it on a 16 by 16 grid with `stroke="currentColor"` so it follows the button's state.
   */
  iconSvg?: React.ReactNode;
  /**
   * Called when the user clicks the button. For links, call `preventDefault()` to stop navigation.
   */
  onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;
}

export namespace ButtonProps {
  export type Variant = 'normal' | 'primary' | 'link' | 'destructive' | 'icon';

  export type FormAction = 'submit' | 'none';

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
