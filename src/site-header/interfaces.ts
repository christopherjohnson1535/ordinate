// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface SiteHeaderProps extends BaseComponentProps {
  /**
   * The name of the site, with an optional logo, linking to the home page.
   *
   * - `name`: the name, always shown as text.
   * - `href`: where the name links to, usually `/`.
   * - `logo`: an `<svg>` or `<img>` shown before the name. It is hidden from screen readers, which
   *   read the name instead.
   */
  brand: SiteHeaderProps.Brand;
  /**
   * The main pages of the site. Mark the page being shown with `current: true`. When there is not
   * enough room, the links fold into a menu button.
   */
  links?: ReadonlyArray<SiteHeaderProps.Link>;
  /**
   * Shown at the end of the header, usually one button such as "Book a repair". It stays visible
   * when the links fold into the menu.
   */
  actions?: React.ReactNode;
  /**
   * A short note in a thin strip above the header, such as "Open today 8–6".
   */
  notice?: React.ReactNode;
  /**
   * Keeps the header at the top of the window while the page scrolls.
   */
  sticky?: boolean;
  /**
   * The accessible name of the navigation landmark that holds the links.
   */
  navigationAriaLabel?: string;
  /**
   * The text of the button that shows the links when they are folded into a menu.
   */
  menuButtonText?: string;
  /**
   * Called when someone follows a link or the brand with a plain click. Call `preventDefault()` to
   * handle the navigation yourself, for example with a router.
   */
  onFollow?: CancelableEventHandler<SiteHeaderProps.FollowDetail>;
}

export namespace SiteHeaderProps {
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

  export interface Link {
    /**
     * The text of the link.
     */
    text: string;
    /**
     * Where the link goes.
     */
    href: string;
    /**
     * Marks the link to the page being shown.
     */
    current?: boolean;
  }

  export interface FollowDetail {
    href: string;
    text: string;
  }
}
