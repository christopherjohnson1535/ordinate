// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../form-field/styles.css.js';

export default class FormFieldWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findControl(): ElementWrapper | null {
    return this.findByClassName(styles.control);
  }

  findError(): ElementWrapper | null {
    return this.findByClassName(styles.error);
  }

  findConstraint(): ElementWrapper | null {
    return this.findByClassName(styles.constraint);
  }
}
