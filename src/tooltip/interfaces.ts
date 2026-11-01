// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface TooltipProps extends BaseComponentProps {
  /**
   * The short text shown in the tooltip. Keep it to a few words and do not put links or
   * buttons in it: the tooltip cannot be reached with the keyboard. Use a popover for
   * anything interactive.
   */
  content: React.ReactNode;
  /**
   * The element the tooltip describes, usually a button. The tooltip shows when the pointer
   * rests on it or when it receives keyboard focus, and becomes its accessible description.
   * When it contains nothing focusable, the tooltip makes it focusable.
   */
  children: React.ReactNode;
  /**
   * The side of the trigger the tooltip shows on. `right` and `left` follow the reading
   * direction. When there is no room on this side, the tooltip shows on the opposite side.
   */
  position?: TooltipProps.Position;
}

export namespace TooltipProps {
  export type Position = 'top' | 'right' | 'bottom' | 'left';
}
