// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../popover/styles.css.js';

export default class PopoverWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The text trigger button, or the element wrapping a custom trigger.
   */
  findTrigger(): ElementWrapper {
    return this.findByClassName(styles.trigger)!;
  }

  /**
   * The open popover, also when it is rendered with a portal.
   */
  findBody(): ElementWrapper | null {
    const inside = this.findByClassName(styles.panel);
    if (inside) {
      return inside;
    }
    // A portal moves the panel out of the root; its ID follows the trigger's.
    const triggerId = this.findTrigger().getElement().id;
    const panel = triggerId ? document.getElementById(triggerId.replace(/trigger$/, 'panel')) : null;
    return panel ? new ElementWrapper(panel) : null;
  }

  findHeader(): ElementWrapper | null {
    return this.findBody()?.findByClassName(styles.header) ?? null;
  }

  findContent(): ElementWrapper | null {
    return this.findBody()?.findByClassName(styles.content) ?? null;
  }

  /**
   * The close button, or `null` when the popover is closed or has `dismissButton` set to `false`.
   */
  findDismissButton(): ButtonWrapper | null {
    return this.findBody()?.findByClassName(styles.dismiss)?.findComponent(ButtonWrapper) ?? null;
  }

  isOpen(): boolean {
    return this.findBody() !== null;
  }
}
