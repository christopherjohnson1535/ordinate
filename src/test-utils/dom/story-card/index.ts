// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../story-card/styles.css.js';

export default class StoryCardWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the heading that holds the title.
   */
  findTitle(): ElementWrapper {
    return this.findByClassName(styles.title)!;
  }

  /**
   * Returns the title link, when the card has an `href`.
   */
  findTitleLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findTitle().find<HTMLAnchorElement>('a');
  }

  findSummary(): ElementWrapper | null {
    return this.findByClassName(styles.summary);
  }

  findKicker(): ElementWrapper | null {
    return this.findByClassName(styles.kicker);
  }

  findNumber(): ElementWrapper | null {
    return this.findByClassName(styles.number);
  }

  findMeta(): ElementWrapper | null {
    return this.findByClassName(styles.meta);
  }

  findMedia(): ElementWrapper | null {
    return this.findByClassName(styles.media);
  }
}
