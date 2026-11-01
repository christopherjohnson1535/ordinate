// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../side-navigation/styles.css.js';

export default class SideNavigationWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeaderLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName<HTMLAnchorElement>(styles['header-link']);
  }

  /**
   * Returns every rendered link, in order, including links in collapsed sections.
   */
  findLinks(): ElementWrapper<HTMLAnchorElement>[] {
    return this.findAllByClassName<HTMLAnchorElement>(styles.link);
  }

  findLinkByHref(href: string): ElementWrapper<HTMLAnchorElement> | null {
    return this.findLinks().find(link => link.getElement().getAttribute('href') === href) ?? null;
  }

  findActiveLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName<HTMLAnchorElement>(styles['link-active']);
  }

  /**
   * Returns the buttons that expand and collapse sections, in order.
   */
  findSectionToggles(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(styles['section-toggle']);
  }

  /**
   * Returns the buttons that expand and collapse expandable link groups, in order.
   */
  findExpandToggles(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(styles['expand-toggle']);
  }

  findSectionGroupTitles(): ElementWrapper[] {
    return this.findAllByClassName(styles['section-group-title']);
  }

  findDividers(): ElementWrapper[] {
    return this.findAllByClassName(styles.divider);
  }
}
