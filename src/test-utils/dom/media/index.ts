// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../media/styles.css.js';

export default class MediaWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findImage(): ElementWrapper<HTMLImageElement> | null {
    return this.findByClassName<HTMLImageElement>(styles.image);
  }

  /**
   * Returns the box that holds the content passed as `children`.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.slot);
  }

  findPlaceholderText(): ElementWrapper | null {
    return this.findByClassName(styles['placeholder-text']);
  }

  /**
   * Whether the frame is empty and drawn as a placeholder.
   */
  isPlaceholder(): boolean {
    return this.element.classList.contains(styles.placeholder);
  }
}
