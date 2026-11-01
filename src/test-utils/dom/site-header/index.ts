// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../site-header/styles.css.js';

export default class SiteHeaderWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findBrand(): ElementWrapper {
    return this.findByClassName(styles.brand)!;
  }

  findNotice(): ElementWrapper | null {
    return this.findByClassName(styles['notice-inner']);
  }

  /**
   * Returns the navigation landmark, which is only rendered when there are `links`.
   */
  findNavigation(): ElementWrapper | null {
    return this.findByClassName(styles.navigation);
  }

  findLinks(): ElementWrapper<HTMLAnchorElement>[] {
    return this.findAllByClassName<HTMLAnchorElement>(styles.link);
  }

  findCurrentLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.find<HTMLAnchorElement>(`.${styles.link}[aria-current="page"]`);
  }

  /**
   * Returns the button that shows the links when they are folded into a menu. It is in the page
   * at every width and hidden by styles when the links fit.
   */
  findMenuButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(styles['menu-button']);
  }

  isMenuOpen(): boolean {
    return this.findMenuButton()?.getElement().getAttribute('aria-expanded') === 'true';
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }
}
