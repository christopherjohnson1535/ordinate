// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../opening/styles.css.js';

export default class OpeningWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findTitle(): ElementWrapper {
    return this.findByClassName(styles.title)!;
  }

  findKicker(): ElementWrapper | null {
    return this.findByClassName(styles.kicker);
  }

  findMeta(): ElementWrapper | null {
    return this.findByClassName(styles.meta);
  }

  findBadge(): ElementWrapper | null {
    return this.findByClassName(styles.badge);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  /**
   * Returns the links row, which is only rendered when there are `links`.
   */
  findNavigation(): ElementWrapper | null {
    return this.findByClassName(styles.navigation);
  }

  findLinks(): ElementWrapper<HTMLAnchorElement>[] {
    return this.findAllByClassName<HTMLAnchorElement>(styles.link);
  }

  findMedia(): ElementWrapper | null {
    return this.findByClassName(styles['media-frame']);
  }

  findMediaCaption(): ElementWrapper | null {
    return this.findByClassName(styles['media-caption']);
  }
}
