// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface PopoverProps extends BaseComponentProps {
  /**
   * The trigger. With the `text` trigger type, pass plain text; it becomes a button with a
   * dotted underline. With `custom`, pass your own focusable element, such as a button.
   */
  children?: React.ReactNode;
  /**
   * Content of the popover.
   */
  content?: React.ReactNode;
  /**
   * Title shown at the top of the popover. It also becomes the popover's accessible name.
   * Without it, the popover is named after its trigger.
   */
  header?: React.ReactNode;
  /**
   * The side of the trigger the popover opens on. `right` and `left` follow the reading
   * direction, so `right` opens on the left in right-to-left layout. When there is no room
   * on this side, the popover opens on the opposite side.
   */
  position?: PopoverProps.Position;
  /**
   * The largest width of the popover. It grows with its content up to this width.
   */
  size?: PopoverProps.Size;
  /**
   * Keeps the popover at the full width of `size`, whatever its content.
   */
  fixedWidth?: boolean;
  /**
   * How the trigger looks:
   * * `text`: inline text with a dotted underline, rendered as a button.
   * * `custom`: your own element passed as `children`, such as a button or an icon.
   */
  triggerType?: PopoverProps.TriggerType;
  /**
   * Lets the text trigger wrap onto more lines. Set it to `false` to keep it on one line.
   */
  wrapTriggerText?: boolean;
  /**
   * Shows a close button in the header and moves focus into the popover when it opens.
   * Without it, focus stays on the trigger. Escape and clicks outside close it either way.
   */
  dismissButton?: boolean;
  /**
   * Accessible name of the close button.
   */
  dismissAriaLabel?: string;
  /**
   * Renders the popover at the end of the page body, so a container that clips its content,
   * such as a scrolling table, does not cut it off.
   */
  renderWithPortal?: boolean;
}

export namespace PopoverProps {
  export type Position = 'top' | 'right' | 'bottom' | 'left';

  export type Size = 'small' | 'medium' | 'large';

  export type TriggerType = 'text' | 'custom';

  export interface Ref {
    /**
     * Moves keyboard focus to the trigger.
     */
    focus(): void;
    /**
     * Closes the popover without moving focus.
     */
    dismiss(): void;
  }
}
