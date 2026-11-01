// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../pull-quote/styles.css.js';

export default class PullQuoteWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the `<blockquote>` with the quoted words.
   */
  findQuote(): ElementWrapper {
    return this.findByClassName(styles.quote)!;
  }

  findAttribution(): ElementWrapper | null {
    return this.findByClassName(styles.attribution);
  }

  /**
   * Returns the oversized quotation mark of the `hanging` variant.
   */
  findMark(): ElementWrapper | null {
    return this.findByClassName(styles.mark);
  }
}
