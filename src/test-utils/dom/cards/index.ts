// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';
import ItemCardWrapper from '../item-card';

import styles from '../../../cards/styles.css.js';

/**
 * One card in a Cards collection.
 */
export class CardWrapper extends ItemCardWrapper {
  findSections(): ElementWrapper[] {
    return this.findAllByClassName(styles.section);
  }

  findSectionHeaders(): ElementWrapper[] {
    return this.findAllByClassName(styles['section-header']);
  }

  /**
   * Returns the native checkbox or radio input that selects the card.
   */
  findSelectionInput(): ElementWrapper<HTMLInputElement> | null {
    return this.find<HTMLInputElement>('input');
  }
}

export default class CardsWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findItems(): CardWrapper[] {
    return this.findAllByClassName(styles.card).map(card => new CardWrapper(card.getElement()));
  }

  findSelectedItems(): CardWrapper[] {
    return this.findItems().filter(card => card.isSelected());
  }

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findFilterSlot(): ElementWrapper | null {
    return this.findByClassName(styles.filter);
  }

  findPaginationSlot(): ElementWrapper | null {
    return this.findByClassName(styles.pagination);
  }

  findPreferencesSlot(): ElementWrapper | null {
    return this.findByClassName(styles.preferences);
  }

  findLoadingText(): ElementWrapper | null {
    return this.findByClassName(styles.loading);
  }

  findEmptySlot(): ElementWrapper | null {
    return this.findByClassName(styles.empty);
  }
}
