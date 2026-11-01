// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../index-list/styles.css.js';

export class IndexListItemWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.item}`;

  findLabel(): ElementWrapper {
    return this.findByClassName(styles.label)!;
  }

  /**
   * Returns the row's link, when the item has an `href`.
   */
  findLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findLabel().find<HTMLAnchorElement>('a');
  }

  findValue(): ElementWrapper | null {
    return this.findByClassName(styles.value);
  }

  findMeta(): ElementWrapper | null {
    return this.findByClassName(styles.meta);
  }

  findNumber(): ElementWrapper | null {
    return this.findByClassName(styles.number);
  }
}

export default class IndexListWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the `<ol>` or `<ul>` element.
   */
  findList(): ElementWrapper<HTMLOListElement | HTMLUListElement> {
    return this.findByClassName<HTMLOListElement | HTMLUListElement>(styles.list)!;
  }

  findItems(): IndexListItemWrapper[] {
    return this.findAllComponents(IndexListItemWrapper);
  }
}
