// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../measure/styles.css.js';

export default class MeasureWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  /**
   * The whole reading as it is read: the value, the maximum and the unit, as in "20 of 32 nodes".
   */
  findReading(): ElementWrapper {
    return this.findByClassName(styles.reading)!;
  }

  findValue(): ElementWrapper {
    return this.findByClassName(styles.value)!;
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  /**
   * The ruler, drawn when `max` is set. It is hidden from screen readers.
   */
  findRuler(): ElementWrapper | null {
    return this.findByClassName(styles.ruler);
  }

  /**
   * The filled run of the ruler.
   */
  findRun(): ElementWrapper | null {
    return this.findByClassName(styles.run);
  }

  findTicks(): ElementWrapper[] {
    return this.findAllByClassName(styles.tick);
  }

  findLimitMark(): ElementWrapper | null {
    return this.findByClassName(styles['limit-mark']);
  }

  findLimitLabel(): ElementWrapper | null {
    return this.findByClassName(styles['limit-label']);
  }
}
