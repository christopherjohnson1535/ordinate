// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';
import IconWrapper from '../icon';

import styles from '../../../button/styles.css.js';

export default class ButtonWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.button}`;

  /**
   * Whether the button ignores clicks, because it is disabled or loading.
   */
  isDisabled(): boolean {
    const element = this.getElement();
    return element instanceof HTMLButtonElement
      ? element.disabled || element.getAttribute('aria-disabled') === 'true'
      : element.getAttribute('aria-disabled') === 'true';
  }

  isLoading(): boolean {
    return this.findLoadingIndicator() !== null;
  }

  findLoadingIndicator(): ElementWrapper | null {
    return this.findByClassName(styles['loading-indicator']);
  }

  /**
   * The element holding the button text.
   */
  findTextRegion(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  /**
   * The icon set with `iconName` or `iconSvg`.
   */
  findIcon(): IconWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(`.${styles.icon}`);
    return element ? new IconWrapper(element) : null;
  }

  /**
   * The diagonal leader of an external link, which carries the "opens in a new tab" label.
   */
  findExternalIcon(): ElementWrapper | null {
    return this.findByClassName(styles['external-icon']);
  }

  /**
   * The leader at the end of a button that goes to another page of the application.
   */
  findLeader(): ElementWrapper | null {
    return this.findByClassName(styles.leader);
  }
}
