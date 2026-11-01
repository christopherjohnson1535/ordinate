// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface SiteFooterProps extends BaseComponentProps {
  /**
   * The name of the site, with an optional logo.
   *
   * - `name`: the name, always shown as text.
   * - `href`: where the name links to, usually `/`. Leave it out to show the name without a link.
   * - `logo`: an `<svg>` or `<img>` shown before the name. It is hidden from screen readers, which
   *   read the name instead.
   */
  brand?: SiteFooterProps.Brand;
  /**
   * Groups of links, each under a short title, such as "Visit" or "Shop".
   */
  columns?: ReadonlyArray<SiteFooterProps.Column>;
  /**
   * Shown under the brand: an address, opening hours, a newsletter form or any other content.
   */
  children?: React.ReactNode;
  /**
   * The small print at the bottom, such as a copyright line and links to the privacy policy.
   */
  legal?: React.ReactNode;
  /**
   * The background of the footer.
   *
   * - `default` uses the page background, with a rule above the footer.
   * - `accent` uses a soft tint.
   * - `inverted` uses dark ink with light text.
   */
  tone?: SiteFooterProps.Tone;
  /**
   * The heading level of the column titles, so the page reads in order.
   */
  headingLevel?: SiteFooterProps.HeadingLevel;
  /**
   * The accessible name of the navigation landmark that holds the columns of links.
   */
  navigationAriaLabel?: string;
  /**
   * Called when someone follows a link or the brand with a plain click. Call `preventDefault()` to
   * handle the navigation yourself, for example with a router.
   */
  onFollow?: CancelableEventHandler<SiteFooterProps.FollowDetail>;
}

export namespace SiteFooterProps {
  export interface Brand {
    /**
     * The name of the site or business.
     */
    name: string;
    /**
     * Where the name links to. Leave it out to show the name without a link.
     */
    href?: string;
    /**
     * A logo shown before the name.
     */
    logo?: React.ReactNode;
  }

  export interface Column {
    /**
     * The title of the group, such as "Visit".
     */
    title: string;
    /**
     * The links in the group.
     */
    links: ReadonlyArray<Link>;
  }

  export interface Link {
    /**
     * The text of the link.
     */
    text: string;
    /**
     * Where the link goes.
     */
    href: string;
  }

  export type Tone = 'default' | 'accent' | 'inverted';

  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export interface FollowDetail {
    href: string;
    text: string;
  }
}
