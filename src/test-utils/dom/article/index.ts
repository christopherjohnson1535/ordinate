// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../article/styles.css.js';

export default class ArticleWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findLead(): ElementWrapper | null {
    return this.findByClassName(styles.lead);
  }

  findByline(): ElementWrapper | null {
    return this.findByClassName(styles.byline);
  }

  /**
   * The text of the article: everything passed as children.
   */
  findContent(): ElementWrapper {
    return this.findByClassName(styles.body)!;
  }
}
