// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import ExpandableSectionWrapper from '../expandable-section';

import formStyles from '../../../form/styles.css.js';
import styles from '../../../wizard/styles.css.js';

function wrapButton(parent: ElementWrapper, className: string): ButtonWrapper | null {
  const element = parent.findByClassName(className);
  return element ? new ButtonWrapper(element.getElement()) : null;
}

/**
 * One item of a checklist sheet.
 */
export class WizardItemWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.item}`;

  findTitle(): ElementWrapper {
    return this.findByClassName(styles['item-title'])!;
  }

  /**
   * The one line shown while the item is folded: its summary once checked, or its description before.
   */
  findSummary(): ElementWrapper | null {
    return this.findByClassName(styles['item-summary']);
  }

  /**
   * The content of the item, shown while it is open.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  /**
   * The item's error, while it has one.
   */
  findError(): ElementWrapper | null {
    return this.findByClassName(styles['item-error-text']);
  }

  /**
   * The button that reopens a checked item.
   */
  findChangeButton(): ButtonWrapper | null {
    return wrapButton(this, styles['change-button']);
  }

  /**
   * The button that opens an item not opened yet.
   */
  findOpenButton(): ButtonWrapper | null {
    return wrapButton(this, styles['open-button']);
  }

  /**
   * The button that moves on to the next item, shown in the open item.
   */
  findNextButton(): ButtonWrapper | null {
    return wrapButton(this, styles['next-button']);
  }

  isActive(): boolean {
    return this.getElement().classList.contains(styles['item-active']);
  }

  /**
   * Whether the item has been opened and left without an error.
   */
  isChecked(): boolean {
    const classes = this.getElement().classList;
    return classes.contains(styles['item-visited']) && !classes.contains(styles['item-has-error']);
  }

  isOptional(): boolean {
    return this.getElement().classList.contains(styles['item-optional']);
  }
}

export default class WizardWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private wrapButton(className: string): ButtonWrapper | null {
    return wrapButton(this, className);
  }

  /**
   * The heading area of the active step: its title, info and description. On a checklist, the open
   * item's heading.
   */
  findHeader(): ElementWrapper {
    return this.findByClassName(styles['step-header'])!;
  }

  /**
   * The content of the active step, or of the open item of a checklist.
   */
  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  /**
   * The error of the active step, while it has one. On a checklist, the open item's error.
   */
  findError(): ElementWrapper | null {
    return this.findActiveItem()?.findError() ?? this.findByClassName(formStyles['error-text']);
  }

  /**
   * The rule at the foot of the `steps` variant that holds the actions.
   */
  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles['footer-rule']);
  }

  findSecondaryActions(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-actions']) ?? this.findByClassName(formStyles['secondary-actions']);
  }

  /**
   * The items of a checklist, in order.
   */
  findItems(): WizardItemWrapper[] {
    return this.findAllComponents(WizardItemWrapper);
  }

  /**
   * The item of a checklist with this number, counted from 1.
   */
  findItem(stepNumber: number): WizardItemWrapper | null {
    return this.findItems()[stepNumber - 1] ?? null;
  }

  /**
   * The open item of a checklist.
   */
  findActiveItem(): WizardItemWrapper | null {
    return this.findItems().find(item => item.isActive()) ?? null;
  }

  /**
   * The line in a checklist's footer that counts the checked items and the open errors.
   */
  findStatusLine(): ElementWrapper | null {
    return this.findByClassName(styles['status-line']);
  }

  /**
   * The side column of a checklist.
   */
  findAside(): ElementWrapper | null {
    return this.findByClassName(styles.aside);
  }

  findCancelButton(): ButtonWrapper {
    return this.wrapButton(styles['cancel-button'])!;
  }

  /**
   * The previous button. It is not shown on the first step.
   */
  findPreviousButton(): ButtonWrapper | null {
    return this.wrapButton(styles['previous-button']);
  }

  /**
   * The next button, or the submit button on the last step. On a checklist, the submit button in the
   * footer.
   */
  findPrimaryButton(): ButtonWrapper {
    return this.wrapButton(styles['primary-button'])!;
  }

  /**
   * The skip button, shown with `allowSkipTo` when optional steps follow the active one.
   */
  findSkipToButton(): ButtonWrapper | null {
    return this.wrapButton(styles['skip-to-button']);
  }

  /**
   * Deprecated: the step scale stays across the top at every width, so there is no disclosure. Always null.
   */
  findNavigationToggle(): ExpandableSectionWrapper | null {
    return null;
  }

  /**
   * The step scale across the top of the `steps` variant: the line with a tick for each step.
   */
  findStepScale(): ElementWrapper | null {
    return this.findByClassName(styles.scale);
  }

  /**
   * The steps in the navigation, in order. Each holds the step's reference, such as "S2", and its name.
   */
  findNavigationItems(): ElementWrapper[] {
    return this.findAllByClassName(styles['navigation-item']);
  }

  /**
   * The step in the navigation with this number, counted from 1.
   */
  findNavigationItem(stepNumber: number): ElementWrapper | null {
    return this.findNavigationItems()[stepNumber - 1] ?? null;
  }

  /**
   * The buttons in the navigation for the steps that can be chosen, in order.
   */
  findNavigationLinks(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(styles['navigation-link']);
  }

  findActiveNavigationItem(): ElementWrapper | null {
    return this.findNavigationItems().find(item => item.find('[aria-current="step"]') !== null) ?? null;
  }
}
