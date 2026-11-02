// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../container/styles.css.js';

export default class ContainerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The short reference set above the heading, such as R1.
   */
  findReference(): ElementWrapper | null {
    return this.find(`:scope > .${styles.layout} > .${styles.margin} > .${styles.reference}`);
  }

  findHeading(): ElementWrapper | null {
    return this.find(`:scope > .${styles.layout} > .${styles.margin} > .${styles.heading}`);
  }

  findDescription(): ElementWrapper | null {
    return this.find(`:scope > .${styles.layout} > .${styles.margin} > .${styles.description}`);
  }

  /**
   * The label of the dimension line along the top of the content.
   */
  findMeasure(): ElementWrapper | null {
    return this.find(`:scope > .${styles.layout} > .${styles.main} > .${styles.measure}`);
  }

  findActions(): ElementWrapper | null {
    return this.find(`:scope > .${styles.layout} > .${styles.main} > .${styles.actions}`);
  }

  findContent(): ElementWrapper {
    return this.find(`:scope > .${styles.layout} > .${styles.main} > .${styles.content}`)!;
  }

  findFooter(): ElementWrapper | null {
    return this.find(`:scope > .${styles.layout} > .${styles.main} > .${styles.footer}`);
  }
}
