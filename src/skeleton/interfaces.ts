// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface SkeletonProps extends BaseComponentProps {
  /**
   * The shape that stands in for the content.
   *
   * - `text` draws lines of body text. Set the number with `lines`.
   * - `heading` draws one line at heading size.
   * - `block` draws a framed area for an image, chart or other media. Set its height with `height`.
   */
  variant?: SkeletonProps.Variant;
  /**
   * The number of lines in the `text` variant. The last of several lines is drawn shorter, like the end of a
   * paragraph.
   */
  lines?: number;
  /**
   * The width of the shape, as a share of the space available: `full`, `large` (three quarters), `medium`
   * (half) or `small` (a quarter).
   */
  width?: SkeletonProps.Width;
  /**
   * The height of the `block` variant.
   */
  height?: SkeletonProps.Height;
  /**
   * Whether the content is still loading. While it is, the shapes are shown in place of `children` and the
   * region is marked busy. When it turns false, `children` are shown.
   */
  loading?: boolean;
  /**
   * Text read by screen readers in place of the shapes, which are hidden from them. Set it to an empty
   * string when several skeletons make up one loading region, so the region is not read as "Loading" many
   * times; give the text to one of them.
   */
  loadingText?: string;
  /**
   * The content that is loading, shown once `loading` is false.
   */
  children?: React.ReactNode;
}

export namespace SkeletonProps {
  export type Variant = 'text' | 'heading' | 'block';

  export type Width = 'full' | 'large' | 'medium' | 'small';

  export type Height = 'small' | 'medium' | 'large';
}
