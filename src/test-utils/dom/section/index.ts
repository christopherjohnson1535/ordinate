// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../section/styles.css.js';

export default class SectionWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeading(): ElementWrapper | null {
    return this.findByClassName(styles.heading);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }
}
