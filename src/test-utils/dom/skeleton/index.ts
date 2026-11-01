// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../skeleton/styles.css.js';

export default class SkeletonWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  isLoading(): boolean {
    return this.getElement().getAttribute('aria-busy') === 'true';
  }

  /**
   * The lines of the `text` and `heading` variants.
   */
  findLines(): ElementWrapper[] {
    return this.findAllByClassName(styles.line);
  }

  /**
   * The frame of the `block` variant.
   */
  findBlock(): ElementWrapper | null {
    return this.findByClassName(styles.block);
  }

  /**
   * The text read by screen readers while loading.
   */
  findLoadingText(): ElementWrapper | null {
    return this.findByClassName(styles['loading-text']);
  }
}
