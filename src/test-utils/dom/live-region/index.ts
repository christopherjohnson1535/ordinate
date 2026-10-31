// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../live-region/styles.css.js';

export default class LiveRegionWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  /**
   * Returns the text most recently passed to screen readers.
   */
  getAnnouncement(): string {
    return this.findByClassName(styles.announcer)!.getText();
  }
}
