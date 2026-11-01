// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AlertWrapper from '../alert';
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../annotation-context/styles.css.js';

/**
 * The annotation of the current tutorial step, which `AnnotationContext` opens at the
 * step's hotspot.
 */
export default class AnnotationContextWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.annotation}`;

  findTaskTitle(): ElementWrapper {
    return this.findByClassName(styles['task-title'])!;
  }

  findStepTitle(): ElementWrapper {
    return this.findByClassName(styles['step-title'])!;
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  findWarningAlert(): AlertWrapper | null {
    return this.findByClassName(styles.warning)?.findComponent(AlertWrapper) ?? null;
  }

  findStepCounter(): ElementWrapper {
    return this.findByClassName(styles['step-counter'])!;
  }

  findDismissButton(): ButtonWrapper {
    return this.findByClassName(styles.dismiss)!.findComponent(ButtonWrapper)!;
  }

  /**
   * The previous button, or `null` on the first step of the tutorial.
   */
  findPreviousButton(): ButtonWrapper | null {
    return this.findComponent(ButtonWrapper, `.${styles['previous-button']}`);
  }

  /**
   * The next button, or `null` on the last step of the tutorial.
   */
  findNextButton(): ButtonWrapper | null {
    return this.findComponent(ButtonWrapper, `.${styles['next-button']}`);
  }

  /**
   * The finish button, shown on the last step of the tutorial.
   */
  findFinishButton(): ButtonWrapper | null {
    return this.findComponent(ButtonWrapper, `.${styles['finish-button']}`);
  }
}
