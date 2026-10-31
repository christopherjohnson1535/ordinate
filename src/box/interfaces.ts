// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface BoxProps extends BaseComponentProps {
  /**
   * The element and text style to render.
   *
   * - `div`, `span`, `h1` to `h5`, `p`, `strong`, `small`, `code`, `pre` and `samp` render that HTML element.
   * - `key-label` renders a `div` styled as the key in a key-value pair.
   * - `value-large` renders a `span` with large, light display text, for a headline number.
   * - `inline-code` renders a `code` element with a tinted background, for code inside running text.
   *
   * `code`, `pre`, `samp` and `inline-code` use the monospace font. Use `tagOverride` to change the element
   * without changing the style.
   */
  variant?: BoxProps.Variant;
  /**
   * Renders this HTML element instead of the one set by `variant`. The text style still follows `variant`.
   */
  tagOverride?: BoxProps.TagName;
  /**
   * Overrides the display of the element. When not set, it depends on the variant.
   */
  display?: BoxProps.Display;
  /**
   * Adds margin. Pass a single size for all sides, or an object to set sides separately.
   * `top` and `bottom` are the block sides; `left` and `right` are the inline start and end sides,
   * so they swap in right-to-left text. A single side wins over `horizontal` or `vertical`.
   *
   * `n` means no margin.
   */
  margin?: BoxProps.SpacingSize | BoxProps.Spacing;
  /**
   * Adds padding. Pass a single size for all sides, or an object to set sides separately.
   * `top` and `bottom` are the block sides; `left` and `right` are the inline start and end sides,
   * so they swap in right-to-left text. A single side wins over `horizontal` or `vertical`.
   *
   * `n` means no padding.
   */
  padding?: BoxProps.SpacingSize | BoxProps.Spacing;
  /**
   * Aligns the text. `left` and `right` follow the text direction.
   */
  textAlign?: BoxProps.TextAlign;
  /**
   * Floats the element to the start (`left`) or end (`right`) of the line.
   */
  float?: BoxProps.Float;
  /**
   * Overrides the font size and line height. When not set, they depend on the variant.
   */
  fontSize?: BoxProps.FontSize;
  /**
   * Overrides the font weight. When not set, it depends on the variant.
   */
  fontWeight?: BoxProps.FontWeight;
  /**
   * Overrides the text color. When not set, it depends on the variant.
   *
   * - `inherit` takes the color of the parent element.
   * - `text-label` is for labels outside forms, such as the key in a key-value pair.
   * - `text-body-secondary` is for secondary text.
   * - `text-status-*` colors are for status text: error, success, info, warning, and inactive or loading.
   */
  color?: BoxProps.Color;
  /**
   * Content of the box.
   */
  children?: React.ReactNode;
}

export namespace BoxProps {
  export type Variant =
    | 'div'
    | 'span'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'p'
    | 'strong'
    | 'small'
    | 'code'
    | 'pre'
    | 'samp'
    | 'key-label'
    | 'value-large'
    | 'inline-code';

  export type TagName = keyof React.JSX.IntrinsicElements;

  export type Display = 'block' | 'inline' | 'inline-block' | 'none';

  export type TextAlign = 'left' | 'center' | 'right';

  export type Float = 'left' | 'right';

  export type FontSize =
    | 'body-s'
    | 'body-m'
    | 'heading-xs'
    | 'heading-s'
    | 'heading-m'
    | 'heading-l'
    | 'heading-xl'
    | 'display-l'
    | 'display-xl';

  export type FontWeight = 'light' | 'normal' | 'bold' | 'heavy';

  export type Color =
    | 'inherit'
    | 'text-label'
    | 'text-body-secondary'
    | 'text-status-error'
    | 'text-status-success'
    | 'text-status-info'
    | 'text-status-inactive'
    | 'text-status-warning';

  export type SpacingSize = 'n' | 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';

  export interface Spacing {
    top?: SpacingSize;
    right?: SpacingSize;
    bottom?: SpacingSize;
    left?: SpacingSize;
    horizontal?: SpacingSize;
    vertical?: SpacingSize;
  }
}
