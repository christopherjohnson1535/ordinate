// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../app-layout-toolbar/styles.css.js';

export default class AppLayoutToolbarWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findNavigationToggle(): ButtonWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(`.${styles['navigation-toggle']} button`);
    return element ? new ButtonWrapper(element) : null;
  }

  findBreadcrumbs(): ElementWrapper | null {
    return this.findByClassName(styles.breadcrumbs);
  }

  findDrawerTriggers(): ButtonWrapper[] {
    return Array.from(
      this.getElement().querySelectorAll<HTMLElement>(`.${styles.drawers} button[data-trigger-id]`),
      element => new ButtonWrapper(element)
    );
  }

  findDrawerTriggerById(id: string): ButtonWrapper | null {
    return this.findDrawerTriggers().find(trigger => trigger.getElement().dataset.triggerId === id) ?? null;
  }
}
