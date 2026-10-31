// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../modal/styles.css.js';

export default class ModalWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.dialog}`;

  isVisible(): boolean {
    return this.getElement().hasAttribute('open');
  }

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.heading);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }

  findDismissButton(): ButtonWrapper {
    return new ButtonWrapper(this.findByClassName(styles['close-button'])!.getElement());
  }

  /**
   * Fires the dialog's cancel event, as pressing Escape does.
   */
  pressEscape(): void {
    this.fireEvent(new Event('cancel', { cancelable: true }));
  }
}
