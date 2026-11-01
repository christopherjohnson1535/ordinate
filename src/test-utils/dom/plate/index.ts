// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../plate/styles.css.js';

export default class PlateWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findMedia(): ElementWrapper | null {
    return this.findByClassName(styles.media);
  }

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  /**
   * Returns the heading that holds the title.
   */
  findTitle(): ElementWrapper {
    return this.findByClassName(styles.title)!;
  }

  /**
   * Returns the title link, when the plate has an `href`.
   */
  findTitleLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findTitle().find<HTMLAnchorElement>('a');
  }

  findMeta(): ElementWrapper | null {
    return this.findByClassName(styles.meta);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }
}
