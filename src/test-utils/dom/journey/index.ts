// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../journey/styles.css.js';

export default class JourneyWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The heading of the question shown.
   */
  findQuestion(): ElementWrapper<HTMLHeadingElement> {
    return this.findByClassName<HTMLHeadingElement>(styles.question)!;
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  /**
   * The line that says which question is shown, such as "Question 2 of 5".
   */
  findCounter(): ElementWrapper {
    return this.findByClassName(styles.counter)!;
  }

  /**
   * The label shown next to the counter on an optional question.
   */
  findOptionalLabel(): ElementWrapper | null {
    return this.findByClassName(styles.optional);
  }

  /**
   * The drawn progress ruler. It is hidden from assistive technology.
   */
  findProgress(): ElementWrapper {
    return this.findByClassName(styles.ruler)!;
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  /**
   * The error of the question shown, while it has one.
   */
  findError(): ElementWrapper | null {
    return this.findByClassName(styles['error-text']);
  }

  /**
   * The back button. It is not shown on the first question.
   */
  findBackButton(): ButtonWrapper | null {
    const element = this.findByClassName(styles['back-button']);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  /**
   * The continue button, or the finish button on the last question.
   */
  findContinueButton(): ButtonWrapper {
    return new ButtonWrapper(this.findByClassName(styles['continue-button'])!.getElement());
  }
}
