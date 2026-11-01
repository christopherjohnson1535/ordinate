// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface DropdownProps extends BaseComponentProps {
  /**
   * Whether the popup is shown. The dropdown is controlled: set this in your trigger's
   * click handler, and set it to `false` in `onOutsideClick` and `onEscape`.
   */
  open: boolean;
  /**
   * The element that opens the popup, usually a button. The popup opens below it, or above
   * it when there is more room there, and is aligned to its start edge.
   */
  trigger: React.ReactNode;
  /**
   * The scrolling content of the popup.
   */
  content?: React.ReactNode;
  /**
   * Content fixed above the scrolling content, such as a filter input.
   */
  header?: React.ReactNode;
  /**
   * Content fixed below the scrolling content, such as actions or a status.
   */
  footer?: React.ReactNode;
  /**
   * Called when the user presses the mouse outside the trigger and the popup.
   */
  onOutsideClick?: NonCancelableEventHandler;
  /**
   * Called when the user presses Escape with focus in the trigger or the popup. Close the
   * popup and move focus back to the trigger here.
   */
  onEscape?: NonCancelableEventHandler;
  /**
   * The narrowest the popup gets:
   * * `trigger`: as wide as the trigger.
   * * `small`, `medium`, `large`: a fixed minimum from the design tokens.
   */
  minWidth?: DropdownProps.MinWidth;
  /**
   * The widest the popup gets. The popup grows with its content up to this width.
   * With `none`, it grows up to the width of the viewport.
   */
  maxWidth?: DropdownProps.MaxWidth;
  /**
   * The role of the popup, such as `dialog` when it holds a form, or `menu`.
   */
  ariaRole?: string;
  /**
   * Accessible name of the popup.
   */
  ariaLabel?: string;
  /**
   * The ID of the element that names the popup, such as a heading in `header`.
   */
  ariaLabelledby?: string;
}

export namespace DropdownProps {
  export type Width = 'small' | 'medium' | 'large';

  export type MinWidth = 'trigger' | Width;

  export type MaxWidth = Width | 'none';
}
