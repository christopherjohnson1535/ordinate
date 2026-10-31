// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface DividerProps extends BaseComponentProps {
  /**
   * The direction of the line.
   *
   * - `horizontal` spans the full width. Use it between stacked sections.
   * - `vertical` spans the full height of a flex row. Use it between items placed side by side.
   */
  orientation?: DividerProps.Orientation;
  /**
   * A short label shown in the middle of a horizontal line, such as a section title or "or".
   * Vertical dividers ignore it.
   */
  children?: React.ReactNode;
}

export namespace DividerProps {
  export type Orientation = 'horizontal' | 'vertical';
}
