// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../testimonial/styles.css.js';

export default class TestimonialWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the `<blockquote>` with the customer's words.
   */
  findQuote(): ElementWrapper {
    return this.findByClassName(styles.quote)!;
  }

  findName(): ElementWrapper | null {
    return this.findByClassName(styles.name);
  }

  findDetail(): ElementWrapper | null {
    return this.findByClassName(styles.detail);
  }

  findMedia(): ElementWrapper | null {
    return this.findByClassName(styles.media);
  }
}
