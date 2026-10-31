// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { IconName } from './generated/icons';

export interface IconProps extends BaseComponentProps {
  /**
   * The name of a built-in icon.
   */
  name?: IconProps.Name;
  /**
   * A custom icon, used instead of `name`. Draw it on a 16 by 16 grid with `stroke="currentColor"`.
   */
  svg?: React.ReactNode;
  /**
   * The size of the icon. `inherit` follows the surrounding font size.
   */
  size?: IconProps.Size;
  /**
   * The color of the icon. `normal` follows the surrounding text color.
   */
  variant?: IconProps.Variant;
  /**
   * Accessible name. Without it the icon is decorative and hidden from assistive technology.
   */
  ariaLabel?: string;
}

export namespace IconProps {
  export type Name = IconName;

  export type Size = 'small' | 'normal' | 'medium' | 'big' | 'large' | 'inherit';

  export type Variant = 'normal' | 'subtle' | 'disabled' | 'error' | 'warning' | 'success' | 'info' | 'link';
}
