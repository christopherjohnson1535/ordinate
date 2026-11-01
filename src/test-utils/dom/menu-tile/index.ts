// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import leaderStyles from '../../../internal/components/leader-row/styles.css.js';
import styles from '../../../menu-tile/styles.css.js';

export class MenuTileItemWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.item}`;

  findLabel(): ElementWrapper {
    return this.findByClassName(leaderStyles.label)!;
  }

  findValue(): ElementWrapper | null {
    return this.findByClassName(leaderStyles.value);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles['item-description']);
  }
}

export default class MenuTileWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the heading that holds the title.
   */
  findTitle(): ElementWrapper {
    return this.findByClassName(styles.title)!;
  }

  findBadge(): ElementWrapper | null {
    return this.findByClassName(styles.badge);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findItems(): MenuTileItemWrapper[] {
    return this.findAllComponents(MenuTileItemWrapper);
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }
}
