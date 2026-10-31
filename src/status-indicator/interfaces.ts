// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface StatusIndicatorProps extends BaseComponentProps {
  /**
   * The status to show. It sets the icon and the color. `loading` shows a spinner.
   */
  type?: StatusIndicatorProps.Type;
  /**
   * Text that describes the status, such as "Running" or "3 errors".
   */
  children?: React.ReactNode;
  /**
   * Accessible name for the icon. Without it the icon is decorative. Set it when the text alone does not
   * say what the status is, for example when the text is a time stamp.
   */
  iconAriaLabel?: string;
  /**
   * Replaces the color that comes with `type`. The icon stays the same.
   */
  colorOverride?: StatusIndicatorProps.Color;
  /**
   * Whether long text wraps onto more lines. When `false`, the text stays on one line and is cut off with
   * an ellipsis.
   */
  wrapText?: boolean;
}

export namespace StatusIndicatorProps {
  export type Type = 'error' | 'warning' | 'success' | 'info' | 'stopped' | 'pending' | 'in-progress' | 'loading';

  export type Color = 'blue' | 'grey' | 'green' | 'red' | 'yellow';
}
