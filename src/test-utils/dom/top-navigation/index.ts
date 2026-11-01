// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonDropdownWrapper from '../button-dropdown';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../top-navigation/styles.css.js';

export default class TopNavigationWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findIdentityLink(): ElementWrapper<HTMLAnchorElement> {
    return this.find<HTMLAnchorElement>(`.${styles.identity} .${styles['identity-link']}`)!;
  }

  findTitle(): ElementWrapper | null {
    return this.find(`.${styles.identity} .${styles.title}`);
  }

  findLogo(): ElementWrapper<HTMLImageElement> | null {
    return this.find<HTMLImageElement>(`.${styles.identity} .${styles.logo}`);
  }

  findSearch(): ElementWrapper | null {
    return this.findByClassName(styles.search);
  }

  /**
   * Returns the utilities shown in the bar, in order, without the overflow menu.
   */
  findUtilities(): ElementWrapper[] {
    return this.findAll(`.${styles.utilities} > .${styles['utility-slot']}:not([data-overflow-menu])`);
  }

  /**
   * Returns the utility at this position among the ones shown in the bar, counting from 1.
   */
  findUtility(index: number): ElementWrapper | null {
    return this.findUtilities()[index - 1] ?? null;
  }

  /**
   * Returns the badge dot of the utility at this position, counting from 1.
   */
  findUtilityBadge(index: number): ElementWrapper | null {
    return this.findUtility(index)?.findByClassName(styles.badge) ?? null;
  }

  /**
   * Returns the menu that holds the utilities that do not fit, while there are any.
   */
  findOverflowMenu(): ButtonDropdownWrapper | null {
    const slot = this.find(`.${styles.utilities} > [data-overflow-menu]`);
    return slot?.findComponent(ButtonDropdownWrapper) ?? null;
  }
}
