// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../progress-bar/styles.css.js';

export default class ProgressBarWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findAdditionalInfo(): ElementWrapper | null {
    return this.findByClassName(styles['additional-info']);
  }

  /**
   * The element with the `progressbar` role. Only present while the status is `underway`; once the operation
   * has finished, the line stays drawn but is hidden from screen readers.
   */
  findBar(): ElementWrapper | null {
    return this.findByClassName(styles.track);
  }

  /**
   * The printed measure, such as "64%". Only rendered while the status is `underway`.
   */
  findPercentageText(): ElementWrapper | null {
    return this.findByClassName(styles.percentage);
  }

  /**
   * The state's icon and word, shown in place of the measure once the operation has finished.
   */
  findStatus(): ElementWrapper | null {
    return this.findByClassName(styles.status);
  }

  /**
   * The text shown with the status once the operation has finished.
   */
  findResultText(): ElementWrapper | null {
    return this.findByClassName(styles['result-text']);
  }

  findResultButton(): ButtonWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(`.${styles['result-button']}`);
    return element ? new ButtonWrapper(element) : null;
  }
}
