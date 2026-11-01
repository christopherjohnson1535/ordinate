// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../token/styles.css.js';

export default class TokenWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findLabel(): ElementWrapper {
    return this.findByClassName(styles.label)!;
  }

  findLabelTag(): ElementWrapper | null {
    return this.findByClassName(styles['label-tag']);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findTags(): ElementWrapper[] {
    return this.findAllByClassName(styles.tag);
  }

  findIconSlot(): ElementWrapper | null {
    return this.findByClassName(styles.icon);
  }

  /**
   * Returns the token's dismiss button, if it can be dismissed.
   */
  findDismissButton(): ButtonWrapper | null {
    const element = this.findByClassName(styles['dismiss-button']);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  isDisabled(): boolean {
    return this.element.classList.contains(styles.disabled);
  }
}
