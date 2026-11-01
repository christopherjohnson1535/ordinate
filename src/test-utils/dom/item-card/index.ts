// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../item-card/styles.css.js';

export default class ItemCardWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  findMedia(): ElementWrapper | null {
    return this.findByClassName(styles.media);
  }

  /**
   * Returns the slot that holds the card's checkbox or radio button.
   */
  findSelectionControl(): ElementWrapper | null {
    return this.findByClassName(styles.selection);
  }

  isSelected(): boolean {
    return this.element.classList.contains(styles.selected);
  }

  isDisabled(): boolean {
    return this.element.classList.contains(styles.disabled);
  }
}
