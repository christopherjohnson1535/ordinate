// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../dialog/styles.css.js';

export default class DialogWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.dialog}`;

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
   * Presses Escape inside the dialog.
   */
  pressEscape(): void {
    this.keydown('Escape');
  }
}
