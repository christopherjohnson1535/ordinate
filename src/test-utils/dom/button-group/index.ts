// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import ButtonDropdownWrapper from '../button-dropdown';
import { ComponentWrapper, ElementWrapper } from '../core';
import TooltipWrapper from '../tooltip';

import dropdownStyles from '../../../button-dropdown/styles.css.js';
import styles from '../../../button-group/styles.css.js';
import feedbackStyles from '../../../internal/components/feedback-panel/styles.css.js';

export default class ButtonGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private findControl(id: string): ElementWrapper | null {
    return this.findAll(`[data-toolbar-item]`).find(item => item.getElement().dataset.toolbarItem === id) ?? null;
  }

  /**
   * The button of an icon button, toggle button or menu dropdown, by the action's `id`.
   */
  findButtonById(id: string): ButtonWrapper | null {
    const button = this.findControl(id)?.find('button');
    return button ? new ButtonWrapper(button.getElement()) : null;
  }

  /**
   * The menu dropdown with this `id`, for opening it and choosing its items.
   */
  findMenuById(id: string): ButtonDropdownWrapper | null {
    const control = this.findControl(id)?.getElement();
    const root = control?.closest<HTMLElement>(`.${dropdownStyles.root}`);
    return root ? new ButtonDropdownWrapper(root) : null;
  }

  /**
   * The tooltip of the action with this `id`. It shows the action's text on hover and focus.
   */
  findTooltipById(id: string): TooltipWrapper | null {
    return this.findControl(id)?.findComponent(TooltipWrapper) ?? null;
  }

  /**
   * The feedback message of the action with this `id`, while it is shown.
   */
  findPopoverFeedbackById(id: string): ElementWrapper | null {
    const item = this.findControl(id)?.getElement().parentElement;
    const panel = item?.querySelector<HTMLElement>(`.${feedbackStyles.panel}`);
    return panel ? new ElementWrapper(panel) : null;
  }

  /**
   * The labelled groups of actions, in order.
   */
  findGroups(): ElementWrapper[] {
    return this.findAllByClassName(styles.group);
  }
}
