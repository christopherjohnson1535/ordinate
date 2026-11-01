// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AppLayoutToolbarWrapper from '../app-layout-toolbar';
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import SplitPanelWrapper from '../split-panel';

import styles from '../../../app-layout/styles.css.js';
import toolbarStyles from '../../../app-layout-toolbar/styles.css.js';

// Matches the ID the layout gives the help panel among its drawers.
const toolsId = 'ord-app-layout-tools';

export default class AppLayoutWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private buttonAt(selector: string): ButtonWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(selector);
    return element ? new ButtonWrapper(element) : null;
  }

  private panelElement(): ElementWrapper | null {
    return this.findByClassName(styles.panel);
  }

  /**
   * Whether the layout is in its narrow arrangement, with a toolbar and overlay panels.
   */
  isMobile(): boolean {
    return this.getElement().classList.contains(styles.mobile);
  }

  /**
   * The navigation region. It stays in the page with `hidden` while closed.
   */
  findNavigation(): ElementWrapper | null {
    return this.findByClassName(styles.navigation);
  }

  /**
   * The button that opens the navigation, in the rail or in the toolbar.
   */
  findNavigationToggle(): ButtonWrapper | null {
    return this.buttonAt(`.${styles['navigation-rail']} button, .${toolbarStyles['navigation-toggle']} button`);
  }

  findNavigationClose(): ButtonWrapper | null {
    return this.buttonAt(`.${styles['navigation-header']} button`);
  }

  findToolbar(): AppLayoutToolbarWrapper | null {
    return this.findComponent(AppLayoutToolbarWrapper);
  }

  findBreadcrumbs(): ElementWrapper | null {
    return this.findByClassName(styles.breadcrumbs) ?? this.findToolbar()?.findBreadcrumbs() ?? null;
  }

  findNotifications(): ElementWrapper | null {
    return this.findByClassName(styles.notifications);
  }

  /**
   * Whether the notifications are drawn in the margin column beside the sheet rather than above it.
   */
  isNotificationsInMargin(): boolean {
    return this.findNotifications()?.getElement().classList.contains(styles['notifications-margin']) ?? false;
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  /**
   * The framed sheet that holds the content, its grid reference letters and the title block.
   */
  findSheet(): ElementWrapper | null {
    return this.findByClassName(styles.sheet);
  }

  /**
   * The grid reference letters along the top edge of the sheet, in order.
   */
  findGridReferenceLetters(): ElementWrapper[] {
    return this.findAllByClassName(styles['grid-reference-cell']);
  }

  /**
   * The slot at the foot of the sheet that holds the `titleBlock`, or `null` when it is not set.
   */
  findTitleBlockSlot(): ElementWrapper | null {
    return this.findByClassName(styles['title-block']);
  }

  /**
   * The open help panel, or `null` while it is closed.
   */
  findTools(): ElementWrapper | null {
    const panel = this.panelElement();
    return panel?.getElement().dataset.panelId === toolsId ? panel : null;
  }

  findToolsToggle(): ButtonWrapper | null {
    return this.findDrawerTriggerById(toolsId);
  }

  findToolsClose(): ButtonWrapper | null {
    return this.findTools() ? this.buttonAt(`.${styles['panel-close']}`) : null;
  }

  /**
   * The open drawer, or `null` while no drawer is open.
   */
  findActiveDrawer(): ElementWrapper | null {
    const panel = this.panelElement();
    return panel && panel.getElement().dataset.panelId !== toolsId ? panel : null;
  }

  findActiveDrawerCloseButton(): ButtonWrapper | null {
    return this.findActiveDrawer() ? this.buttonAt(`.${styles['panel-close']}`) : null;
  }

  findActiveDrawerResizeHandle(): ElementWrapper | null {
    return this.findActiveDrawer()?.find('[role="separator"]') ?? null;
  }

  /**
   * The triggers of the drawers, in the rail or in the toolbar. The help panel's toggle is not included.
   */
  findDrawerTriggers(): ButtonWrapper[] {
    return Array.from(
      this.getElement().querySelectorAll<HTMLElement>('button[data-trigger-id]'),
      element => new ButtonWrapper(element)
    ).filter(trigger => trigger.getElement().dataset.triggerId !== toolsId);
  }

  findDrawerTriggerById(id: string): ButtonWrapper | null {
    const element = Array.from(this.getElement().querySelectorAll<HTMLElement>('button[data-trigger-id]')).find(
      button => button.dataset.triggerId === id
    );
    return element ? new ButtonWrapper(element) : null;
  }

  findSplitPanel(): SplitPanelWrapper | null {
    return this.findComponent(SplitPanelWrapper);
  }
}
