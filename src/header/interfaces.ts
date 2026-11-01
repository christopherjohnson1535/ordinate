// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface HeaderProps extends BaseComponentProps {
  /**
   * The heading text. Plain text works best.
   */
  children?: React.ReactNode;
  /**
   * A short reference shown in small mono capitals above the heading, like the sheet number on a
   * drawing: "Sheet A-02". It is not part of the heading's text.
   */
  code?: React.ReactNode;
  /**
   * The heading level and its look.
   *
   * - `h1` is for the page title, drawn large and light like a sheet heading. Under a website style it
   *   takes that style's headline type.
   * - `h2` is for container and modal titles.
   * - `h3` is for sections inside a container.
   */
  variant?: HeaderProps.Variant;
  /**
   * Renders this heading element instead of the one set by `variant`, without changing the look.
   * Use it to keep the document outline correct. `div` removes the heading semantics.
   */
  headingTagOverride?: HeaderProps.HeadingTag;
  /**
   * Supporting text shown below the heading.
   */
  description?: React.ReactNode;
  /**
   * Actions shown at the end of the heading row, usually buttons.
   */
  actions?: React.ReactNode;
  /**
   * Secondary text shown after the heading text and inside the heading, such as a count of items: `(12)`.
   */
  counter?: React.ReactNode;
  /**
   * Content shown after the heading, outside the heading element, usually an info link.
   */
  info?: React.ReactNode;
}

export namespace HeaderProps {
  export type Variant = 'h1' | 'h2' | 'h3';

  export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}
