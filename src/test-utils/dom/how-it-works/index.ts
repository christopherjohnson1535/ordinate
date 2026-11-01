// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../how-it-works/styles.css.js';

export default class HowItWorksWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The steps, in order.
   */
  findSteps(): ElementWrapper<HTMLLIElement>[] {
    return this.findAllByClassName<HTMLLIElement>(styles.step);
  }

  /**
   * The step with this number, counted from 1.
   */
  findStep(stepNumber: number): ElementWrapper<HTMLLIElement> | null {
    return this.findSteps()[stepNumber - 1] ?? null;
  }

  findStepNumber(step: ElementWrapper): ElementWrapper {
    return step.findByClassName(styles.number)!;
  }

  findStepTitle(step: ElementWrapper): ElementWrapper {
    return step.findByClassName(styles.title)!;
  }

  findStepDescription(step: ElementWrapper): ElementWrapper | null {
    return step.findByClassName(styles.description);
  }

  findStepMedia(step: ElementWrapper): ElementWrapper | null {
    return step.findByClassName(styles.media);
  }
}
