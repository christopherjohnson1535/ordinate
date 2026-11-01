// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../action-card/styles.css.js';

export default class ActionCardWrapper extends ComponentWrapper {
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

  findIconSlot(): ElementWrapper | null {
    return this.findByClassName(styles.icon);
  }

  isDisabled(): boolean {
    return this.element.classList.contains(styles.disabled);
  }
}
