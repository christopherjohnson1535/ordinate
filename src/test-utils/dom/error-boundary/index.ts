// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../error-boundary/styles.css.js';

/**
 * Wraps the fallback. An error boundary adds no element of its own until its content throws, so
 * `findErrorBoundary()` returns `null` while the content renders normally.
 */
export default class ErrorBoundaryWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findRefreshButton(): ButtonWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(`.${styles['refresh-button']}`);
    return element ? new ButtonWrapper(element) : null;
  }

  findFeedbackLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName<HTMLAnchorElement>(styles['feedback-link']);
  }
}
