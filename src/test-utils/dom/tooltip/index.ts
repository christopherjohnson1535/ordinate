// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../tooltip/styles.css.js';

export default class TooltipWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The element wrapping the trigger passed as `children`.
   */
  findTrigger(): ElementWrapper {
    return this.findByClassName(styles.trigger)!;
  }

  /**
   * The tooltip text. It stays in the document while hidden, because the trigger refers to it.
   */
  findContent(): ElementWrapper {
    return this.findByClassName(styles.tooltip)!;
  }

  isVisible(): boolean {
    return !this.findContent().getElement().hidden;
  }
}
