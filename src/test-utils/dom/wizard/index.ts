// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import ExpandableSectionWrapper from '../expandable-section';

import formStyles from '../../../form/styles.css.js';
import styles from '../../../wizard/styles.css.js';

export default class WizardWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private wrapButton(className: string): ButtonWrapper | null {
    const element = this.findByClassName(className);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }

  /**
   * The heading area of the active step: its title, info and description.
   */
  findHeader(): ElementWrapper {
    return this.findByClassName(styles['step-header'])!;
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  /**
   * The error of the active step, while it has one.
   */
  findError(): ElementWrapper | null {
    return this.findByClassName(formStyles['error-text']);
  }

  findSecondaryActions(): ElementWrapper | null {
    return this.findByClassName(formStyles['secondary-actions']);
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
   * The next button, or the submit button on the last step.
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
   * The disclosure that holds the navigation when the wizard is too narrow to show it beside the step.
   */
  findNavigationToggle(): ExpandableSectionWrapper | null {
    const element = this.findByClassName(styles['navigation-toggle']);
    return element ? new ExpandableSectionWrapper(element.getElement()) : null;
  }

  /**
   * The steps in the navigation, in order.
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
