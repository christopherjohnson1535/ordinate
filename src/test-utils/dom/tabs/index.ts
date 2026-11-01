// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../tabs/styles.css.js';

export default class TabsWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns every tab, in order, including disabled ones.
   */
  findTabLinks(): ElementWrapper[] {
    return this.findAllByClassName(styles.tab);
  }

  /**
   * Returns the tab at a position, counting from 1.
   */
  findTabLinkByIndex(index: number): ElementWrapper | null {
    return this.findTabLinks()[index - 1] ?? null;
  }

  findTabLinkById(id: string): ElementWrapper | null {
    return this.findTabLinks().find(tab => tab.getElement().getAttribute('data-tab-id') === id) ?? null;
  }

  findActiveTab(): ElementWrapper | null {
    return this.findByClassName(styles['tab-active']);
  }

  /**
   * Returns the panel of the active tab.
   */
  findTabContent(): ElementWrapper | null {
    return this.find(`.${styles.panel}:not([hidden])`);
  }

  private findExtrasByTabId(id: string): ElementWrapper | null {
    return (
      this.findAllByClassName(styles['tab-extras']).find(
        extras => extras.getElement().getAttribute('data-tab-id') === id
      ) ?? null
    );
  }

  findDismissButtonByTabId(id: string): ElementWrapper<HTMLButtonElement> | null {
    return this.findExtrasByTabId(id)?.findByClassName<HTMLButtonElement>(styles['dismiss-button']) ?? null;
  }

  findActionByTabId(id: string): ElementWrapper | null {
    return this.findExtrasByTabId(id)?.findByClassName(styles.action) ?? null;
  }

  /**
   * Returns the button that scrolls toward the first tab, while the tabs overflow.
   */
  findScrollLeftButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(styles['scroll-left']);
  }

  /**
   * Returns the button that scrolls toward the last tab, while the tabs overflow.
   */
  findScrollRightButton(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(styles['scroll-right']);
  }
}
