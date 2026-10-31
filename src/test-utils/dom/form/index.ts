// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../form/styles.css.js';

export default class FormWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  findSecondaryActions(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-actions']);
  }

  findError(): ElementWrapper | null {
    return this.findByClassName(styles['error-text']);
  }
}
