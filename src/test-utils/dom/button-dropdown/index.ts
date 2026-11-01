// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../button-dropdown/styles.css.js';

export default class ButtonDropdownWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The button that opens the menu.
   */
  findTrigger(): ButtonWrapper {
    return new ButtonWrapper(this.findByClassName(styles.trigger)!.getElement());
  }

  /**
   * The main action of a split button.
   */
  findMainAction(): ButtonWrapper | null {
    const element = this.findByClassName(styles['main-action']);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  /**
   * Returns the menu while it is open.
   */
  findMenu(): ElementWrapper<HTMLUListElement> | null {
    return this.findByClassName<HTMLUListElement>(styles.menu);
  }

  /**
   * Returns the items in the open menu, in order, including group entries that expand and disabled items.
   */
  findItems(): ElementWrapper[] {
    return this.findAll('[data-menu-item]');
  }

  findItemById(id: string): ElementWrapper | null {
    return this.findItems().find(item => item.getElement().dataset.itemId === id) ?? null;
  }

  /**
   * Returns the entry of an expandable group by the group's `id`.
   */
  findExpandableGroupById(id: string): ElementWrapper | null {
    return this.findItems().find(item => item.getElement().dataset.groupKey === id) ?? null;
  }

  /**
   * Returns the shown reason of a disabled item, by the item's `id`.
   */
  findDisabledReason(id: string): ElementWrapper | null {
    return this.findItemById(id)?.findByClassName(styles['disabled-reason']) ?? null;
  }

  isOpen(): boolean {
    return this.findTrigger().getElement().getAttribute('aria-expanded') === 'true';
  }

  /**
   * Opens the menu by clicking the trigger, unless it is already open.
   */
  openDropdown(): void {
    if (!this.isOpen()) {
      this.findTrigger().click();
    }
  }

  /**
   * Opens the menu and clicks the item with this `id`.
   */
  clickItem(id: string): void {
    this.openDropdown();
    const item = this.findItemById(id);
    if (!item) {
      throw new Error(`No item with id ${id}.`);
    }
    item.click();
  }
}
