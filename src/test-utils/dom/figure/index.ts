// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../figure/styles.css.js';

export default class FigureWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findMedia(): ElementWrapper | null {
    return this.findByClassName(styles.media);
  }

  /**
   * Returns the whole `<figcaption>`, with the label, caption and credit.
   */
  findCaption(): ElementWrapper | null {
    return this.findByClassName(styles.caption);
  }

  findCaptionText(): ElementWrapper | null {
    return this.findByClassName(styles.text);
  }

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  findCredit(): ElementWrapper | null {
    return this.findByClassName(styles.credit);
  }
}
