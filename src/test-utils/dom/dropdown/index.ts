// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../dropdown/styles.css.js';
import popupStyles from '../../../internal/components/dropdown/styles.css.js';

export default class DropdownWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The popup, while the dropdown is open.
   */
  findOpenDropdown(): ElementWrapper | null {
    return this.findByClassName(popupStyles.popup);
  }

  findHeader(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(popupStyles.header) ?? null;
  }

  findContent(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(popupStyles.content) ?? null;
  }

  findFooter(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(popupStyles.footer) ?? null;
  }

  isOpen(): boolean {
    return this.findOpenDropdown() !== null;
  }

  /**
   * Presses Escape inside the dropdown.
   */
  pressEscape(): void {
    this.keydown('Escape');
  }
}
