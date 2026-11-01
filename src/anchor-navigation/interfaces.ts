// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';

export interface AnchorNavigationProps extends BaseComponentProps {
  /**
   * The sections of the page, in document order. Each anchor links to an element by its ID, such
   * as `#pricing`. An anchor with a higher `level` than the one before it is nested under it.
   */
  anchors: ReadonlyArray<AnchorNavigationProps.Anchor>;
  /**
   * The `href` of the anchor to mark as current. Leave it out to have the component follow the
   * scroll position and mark the section the reader is in.
   */
  activeHref?: string;
  /**
   * How far from the top of the viewport, in pixels, a section counts as reached. Set it to the
   * height of a sticky header that covers the top of the page.
   */
  scrollSpyOffset?: number;
  /**
   * Called when the user follows an anchor with a plain click. Call `preventDefault()` to scroll
   * in your own way instead of jumping to the section.
   */
  onFollow?: CancelableEventHandler<AnchorNavigationProps.FollowDetail>;
  /**
   * Called when the section the reader is in changes, while the component follows the scroll
   * position.
   */
  onActiveHrefChange?: NonCancelableEventHandler<AnchorNavigationProps.FollowDetail>;
  /**
   * ID of the element that names the navigation, usually a heading such as "On this page".
   */
  ariaLabelledby?: string;
}

export namespace AnchorNavigationProps {
  export interface Anchor {
    /**
     * The text of the link, usually the section heading.
     */
    text: string;
    /**
     * A link to the section, such as `#pricing`.
     */
    href: string;
    /**
     * The depth of the section, starting at 1 for top-level sections.
     */
    level: number;
    /**
     * Short text shown after the link, such as "New" or "Updated".
     */
    info?: string;
  }

  export interface FollowDetail {
    text: string;
    href: string;
    level: number;
  }
}
