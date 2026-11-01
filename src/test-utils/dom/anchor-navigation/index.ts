// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../anchor-navigation/styles.css.js';

export default class AnchorNavigationWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Every anchor link, in document order, including nested ones.
   */
  findAnchorLinks(): ElementWrapper<HTMLAnchorElement>[] {
    return this.findAllByClassName<HTMLAnchorElement>(styles.link);
  }

  /**
   * The anchor link with this position in document order, counted from 1.
   */
  findAnchorLinkByIndex(index: number): ElementWrapper<HTMLAnchorElement> | null {
    return this.findAnchorLinks()[index - 1] ?? null;
  }

  findAnchorLinkByHref(href: string): ElementWrapper<HTMLAnchorElement> | null {
    return this.findAnchorLinks().find(link => link.getElement().getAttribute('href') === href) ?? null;
  }

  findActiveAnchor(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName<HTMLAnchorElement>(styles['link-active']);
  }

  /**
   * The info text of every anchor that has one, in order.
   */
  findInfos(): ElementWrapper[] {
    return this.findAllByClassName(styles.info);
  }
}
