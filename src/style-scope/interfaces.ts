// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { revisionIds, styleIds } from '../internal/generated/theming';

export interface StyleScopeProps {
  /**
   * The voice of everything inside: `console` for applications, or `editorial`, `studio` or
   * `shopfront` for websites. When not set, the scope keeps the style around it.
   */
  styleName?: StyleScopeProps.StyleName;
  /**
   * Light or dark mode for everything inside. When set, the scope also paints the page
   * background and text color for that mode. When not set, the scope keeps the mode around it.
   */
  mode?: StyleScopeProps.Mode;
  /**
   * Comfortable or compact density for everything inside. When not set, the scope keeps the
   * density around it.
   */
  density?: StyleScopeProps.Density;
  /**
   * Pins everything inside to one design revision. When not set, the scope keeps the revision
   * around it.
   */
  revision?: StyleScopeProps.Revision;
  /**
   * The element the scope renders, so it can also be the page's `main`, a `section` or an
   * `article`.
   */
  tagOverride?: StyleScopeProps.Tag;
  /**
   * Accessible name for the element, for a `section` or `article` that needs one.
   */
  ariaLabel?: string;
  /**
   * The content that takes the scope's settings.
   */
  children?: React.ReactNode;
}

export namespace StyleScopeProps {
  export type StyleName = (typeof styleIds)[number];
  export type Revision = (typeof revisionIds)[number];
  export type Mode = 'light' | 'dark';
  export type Density = 'comfortable' | 'compact';
  export type Tag = 'div' | 'main' | 'section' | 'article' | 'aside';
}
