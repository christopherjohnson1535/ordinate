// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface SpaceBetweenProps extends BaseComponentProps {
  /**
   * Lays the items out in a column (`vertical`) or in a row that wraps (`horizontal`).
   */
  direction?: SpaceBetweenProps.Direction;
  /**
   * The space between items.
   */
  size: SpaceBetweenProps.Size;
  /**
   * Aligns the items on the cross axis, as `align-items` does in a flex layout.
   */
  alignItems?: SpaceBetweenProps.AlignItems;
  /**
   * The items to space. Each child, including each child of a fragment, becomes one item.
   * `null`, `false` and `undefined` children are left out.
   */
  children?: React.ReactNode;
}

export namespace SpaceBetweenProps {
  export type Direction = 'vertical' | 'horizontal';

  export type Size = 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

  export type AlignItems = 'center' | 'start' | 'end';
}
