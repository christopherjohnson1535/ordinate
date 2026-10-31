// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../form-field/styles.css.js';

export default class FormFieldWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findControl(): ElementWrapper | null {
    return this.findByClassName(styles.control);
  }

  findSecondaryControl(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-control']);
  }

  findError(): ElementWrapper | null {
    return this.findByClassName(styles.error);
  }

  findWarning(): ElementWrapper | null {
    return this.findByClassName(styles.warning);
  }

  findConstraint(): ElementWrapper | null {
    return this.findByClassName(styles.constraint);
  }

  /**
   * The visible character count. Screen readers get a copy that updates once typing pauses.
   */
  findCharacterCount(): ElementWrapper | null {
    return this.findByClassName(styles['character-count']);
  }
}
