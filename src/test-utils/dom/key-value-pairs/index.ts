// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../key-value-pairs/styles.css.js';

export class KeyValuePairWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.pair}`;

  findLabel(): ElementWrapper {
    return this.findByClassName(styles['label-text'])!;
  }

  findValue(): ElementWrapper {
    return this.findByClassName(styles.value)!;
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }
}

export class KeyValuePairsGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.group}`;

  findTitle(): ElementWrapper {
    return this.findByClassName(styles['group-title'])!;
  }

  findItems(): KeyValuePairWrapper[] {
    return this.findAllComponents(KeyValuePairWrapper);
  }
}

export default class KeyValuePairsWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The cells of the grid in order: pairs and groups.
   */
  findCells(): Array<KeyValuePairWrapper | KeyValuePairsGroupWrapper> {
    const list = this.getElement().querySelector(`.${styles.list}`)!;
    return Array.from(list.children as HTMLCollectionOf<HTMLElement>, element =>
      element.classList.contains(styles.group)
        ? new KeyValuePairsGroupWrapper(element)
        : new KeyValuePairWrapper(element)
    );
  }

  /**
   * Every pair, including the pairs inside groups.
   */
  findItems(): KeyValuePairWrapper[] {
    return this.findAllComponents(KeyValuePairWrapper);
  }

  findGroups(): KeyValuePairsGroupWrapper[] {
    return this.findAllComponents(KeyValuePairsGroupWrapper);
  }
}
