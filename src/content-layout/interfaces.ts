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
   * - `default` places the heading on the page with no decoration.
   * - `high-contrast` sets the notifications, breadcrumbs and heading on a dark band, like the title block
   *   of a drawing. Components inside the band switch to their dark colors. The band always keeps its
   *   content clear of its edges.
   * - `divider` rules the heading off from the content with a line.
   */
  headerVariant?: ContentLayoutProps.HeaderVariant;
  /**
   * The widest the heading and the content may get, in pixels. They stay centered when the layout is
   * wider. The high-contrast band still spans the full width.
   */
  maxContentWidth?: number;
  /**
   * With the `high-contrast` header, the top of the content overlaps the bottom of the band. Set this to
   * start the content below the band instead. Other header variants never overlap.
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
