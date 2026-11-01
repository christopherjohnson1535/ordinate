// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../steps/styles.css.js';

export class StepWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.step}`;

  findHeader(): ElementWrapper {
    return this.findByClassName(styles.header)!;
  }

  findDetails(): ElementWrapper | null {
    return this.findByClassName(styles.details);
  }
}

export default class StepsWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The steps, in order. Each one finds its header, details and status indicator.
   */
  findItems(): StepWrapper[] {
    return this.findAllComponents(StepWrapper);
  }
}
