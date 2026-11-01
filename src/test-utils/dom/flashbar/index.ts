// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../flashbar/styles.css.js';

type FlashType = 'success' | 'error' | 'warning' | 'info' | 'in-progress';

export class FlashWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.flash}`;

  /**
   * The numbered circle in the item's margin. It shows the item's place in the list and is hidden from
   * screen readers.
   */
  findMarker(): ElementWrapper {
    return this.findByClassName(styles['marker-number'])!;
  }

  findStatusIcon(): ElementWrapper {
    return this.findByClassName(styles['status-icon'])!;
  }

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findActionSlot(): ElementWrapper | null {
    return this.findByClassName(styles['action-slot']);
  }

  /**
   * Returns the close button, which is only rendered when the item is `dismissible`.
   */
  findDismissButton(): ButtonWrapper | null {
    return this.findByClassName(styles.dismiss)?.findComponent(ButtonWrapper) ?? null;
  }
}

export default class FlashbarWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The items that are shown. While a stack is collapsed, that is only the first item.
   */
  findItems(): FlashWrapper[] {
    return this.findAllComponents(FlashWrapper, ':not([hidden])');
  }

  /**
   * The shown items of one type.
   */
  findItemsByType(type: FlashType): FlashWrapper[] {
    return this.findAllComponents(FlashWrapper, `.${styles[`type-${type}`]}:not([hidden])`);
  }

  /**
   * The button that expands and collapses a stack. Only rendered when `stackItems` is set and there are two
   * or more items.
   */
  findNotificationBar(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(styles['notification-bar']);
  }

  isStackExpanded(): boolean {
    return this.findNotificationBar()?.getElement().getAttribute('aria-expanded') === 'true';
  }
}
