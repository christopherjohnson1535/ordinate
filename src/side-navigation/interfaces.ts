// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';

export interface SideNavigationProps extends BaseComponentProps {
  /**
   * The name of the application or area, shown above the items as a link. Has:
   * * `text` (string): The name.
   * * `href` (string): Where the name links to, usually the home page.
   * * `logo` (object): An image shown before the name, with `src` and `alt`.
   */
  header?: SideNavigationProps.Header;
  /**
   * The navigation items, in order, drawn as the index of a drawing set. Each item has a `type`:
   * * `link`: A link with `text` and `href`. Set `external` for links that leave the
   *   application, and `info` for content after the text, such as a badge.
   * * `section`: A titled set of items with `text` and `items`, which the user can
   *   collapse. Starts expanded unless `defaultExpanded` is false.
   * * `section-group`: A set of items with a `title` that cannot be collapsed.
   * * `link-group`: A link with `text` and `href`, followed by its child `items`.
   * * `expandable-link-group`: A link with `text` and `href` whose child `items` the user
   *   can show and hide. Starts collapsed unless `defaultExpanded` is true or it holds the
   *   active link.
   * * `divider`: A break between two sets of items.
   *
   * Links and link groups can also have a `code`, a short reference such as "A-01", shown in
   * its own column before the text, the way sheets are numbered in a drawing index. Sections
   * and section groups can have a `code` too, such as "Set B", shown before their title.
   */
  items?: ReadonlyArray<SideNavigationProps.Item>;
  /**
   * The `href` of the current page. The matching link is marked as current.
   */
  activeHref?: string;
  /**
   * Accessible name of the navigation landmark.
   */
  ariaLabel?: string;
  /**
   * Accessible name of the icon on external links, such as "Opens in a new tab".
   */
  externalIconAriaLabel?: string;
  /**
   * Called when the user follows a link or the header with a plain left click or the keyboard.
   * Call `preventDefault()` to handle navigation yourself, for example with a client-side router.
   */
  onFollow?: CancelableEventHandler<SideNavigationProps.FollowDetail>;
  /**
   * Called when the user expands or collapses a section or an expandable link group.
   */
  onChange?: NonCancelableEventHandler<SideNavigationProps.ChangeDetail>;
}

export namespace SideNavigationProps {
  export interface Logo {
    src: string;
    alt?: string;
  }

  export interface Header {
    text?: string;
    href: string;
    logo?: Logo;
  }

  export interface Link {
    type: 'link';
    text: string;
    href: string;
    code?: string;
    external?: boolean;
    externalIconAriaLabel?: string;
    info?: React.ReactNode;
  }

  export interface Divider {
    type: 'divider';
  }

  export interface Section {
    type: 'section';
    text: string;
    code?: string;
    items: ReadonlyArray<Item>;
    defaultExpanded?: boolean;
  }

  export interface SectionGroup {
    type: 'section-group';
    title: string;
    code?: string;
    items: ReadonlyArray<Item>;
  }

  export interface LinkGroup {
    type: 'link-group';
    text: string;
    href: string;
    code?: string;
    items: ReadonlyArray<Item>;
    info?: React.ReactNode;
  }

  export interface ExpandableLinkGroup {
    type: 'expandable-link-group';
    text: string;
    href: string;
    code?: string;
    items: ReadonlyArray<Item>;
    defaultExpanded?: boolean;
  }

  export type Item = Link | Divider | Section | SectionGroup | LinkGroup | ExpandableLinkGroup;

  export type FollowType = 'link' | 'link-group' | 'expandable-link-group' | 'header';

  export interface FollowDetail {
    href: string;
    text?: string;
    external: boolean;
    type: FollowType;
  }

  export interface ChangeDetail {
    item: Section | ExpandableLinkGroup;
    expanded: boolean;
  }
}
