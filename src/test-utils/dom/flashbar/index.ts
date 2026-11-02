// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import alertStyles from '../../../alert/styles.css.js';
import styles from '../../../flashbar/styles.css.js';

type FlashType = 'note' | 'complete' | 'caution' | 'fault';
type LegacyFlashType = 'info' | 'success' | 'warning' | 'error' | 'in-progress';

const legacyTypes: Record<LegacyFlashType, FlashType> = {
  info: 'note',
  success: 'complete',
  warning: 'caution',
  error: 'fault',
  'in-progress': 'note',
};

export class FlashWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.flash}`;

  /**
   * The word in the item's margin that names its type, such as "Fault", or "Underway" while it is loading.
   */
  findCaption(): ElementWrapper {
    return this.findByClassName(alertStyles.label)!;
  }

  /**
   * Deprecated: items are no longer numbered. Returns the word in the margin, as `findCaption` does.
   */
  findMarker(): ElementWrapper {
    return this.findCaption();
  }

  findStatusIcon(): ElementWrapper {
    return this.findByClassName(alertStyles.icon)!;
  }

  findHeader(): ElementWrapper | null {
    return this.findByClassName(alertStyles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(alertStyles.content);
  }

  findActionSlot(): ElementWrapper | null {
    return this.findByClassName(alertStyles['action-slot']);
  }

  /**
   * Returns the close button, which is only rendered when the item is `dismissible`.
   */
  findDismissButton(): ButtonWrapper | null {
    return this.findByClassName(alertStyles.dismiss)?.findComponent(ButtonWrapper) ?? null;
  }

  /**
   * Whether the item is loading and shows the underway spinner.
   */
  isUnderway(): boolean {
    return this.getElement().classList.contains(styles.underway);
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
   * The shown items of one type. The old type names are accepted too.
   */
  findItemsByType(type: FlashType | LegacyFlashType): FlashWrapper[] {
    const current = legacyTypes[type as LegacyFlashType] ?? type;
    return this.findAllComponents(FlashWrapper, `.${styles[`type-${current}`]}:not([hidden])`);
  }

  /**
   * The summary row under a stack, with a count for each type. Only rendered when `stackItems` is set and
   * there are two or more items.
   */
  findSummary(): ElementWrapper | null {
    return this.findByClassName(styles.summary);
  }

  /**
   * The counts in the summary row, in order, such as "2 faults".
   */
  findSummaryCounts(): ElementWrapper[] {
    return this.findAllByClassName(styles.count);
  }

  /**
   * The button that shows every item of a stack and collapses it again. Only rendered when `stackItems` is
   * set and there are two or more items.
   */
  findNotificationBar(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(styles['notification-bar']);
  }

  isStackExpanded(): boolean {
    return this.findNotificationBar()?.getElement().getAttribute('aria-expanded') === 'true';
  }
}
