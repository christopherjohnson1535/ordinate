// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface ContentLayoutProps extends BaseComponentProps {
  /**
   * The page heading, usually a Header with the `h1` variant and the page actions.
   */
  header?: React.ReactNode;
  /**
   * Breadcrumbs shown above the heading. Use the BreadcrumbGroup component.
   */
  breadcrumbs?: React.ReactNode;
  /**
   * Notifications shown at the top of the page, above the breadcrumbs. Use the Flashbar component.
   */
  notifications?: React.ReactNode;
  /**
   * The main content of the page.
   */
  children?: React.ReactNode;
  /**
   * How the heading area is set apart from the content.
   *
   * The heading always sits on the sheet with the content, never on a colored band.
   *
   * - `default` places the heading on the sheet with no decoration.
   * - `high-contrast` stands the notifications, breadcrumbs and heading on a heavy ink rule, like the head of
   *   a title block.
   * - `divider` rules the heading off from the content with a hairline.
   */
  headerVariant?: ContentLayoutProps.HeaderVariant;
  /**
   * The widest the heading and the content may get, in pixels. They stay centered when the layout is
   * wider.
   */
  maxContentWidth?: number;
  /**
   * Deprecated: the `high-contrast` header no longer draws a band for the content to overlap, so this has no
   * visible effect.
   */
  disableOverlap?: boolean;
  /**
   * Adds space around the heading and the content, for pages that do not get it from a surrounding
   * layout.
   */
  defaultPadding?: boolean;
}

export namespace ContentLayoutProps {
  export type HeaderVariant = 'default' | 'high-contrast' | 'divider';
}
