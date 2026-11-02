// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AlertWrapper from '../alert';
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import LinkWrapper from '../link';

import helpPanelStyles from '../../../help-panel/styles.css.js';
import styles from '../../../tutorial-panel/styles.css.js';

export class TutorialWrapper extends ElementWrapper {
  findTitle(): ElementWrapper {
    return this.findByClassName(styles['tutorial-title'])!;
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles['tutorial-description']);
  }

  /**
   * The badge shown once the tutorial is completed.
   */
  findCompletedBadge(): ElementWrapper | null {
    return this.findByClassName(styles['completed-badge']);
  }

  findPrerequisitesAlert(): AlertWrapper | null {
    return this.findByClassName(styles.prerequisites)?.findComponent(AlertWrapper) ?? null;
  }

  /**
   * The start button, which restarts a completed tutorial.
   */
  findStartButton(): ButtonWrapper {
    return this.findComponent(ButtonWrapper, `.${styles['start-button']}`)!;
  }

  findLearnMoreLink(): LinkWrapper | null {
    return this.findComponent(LinkWrapper, `.${styles['learn-more-link']}`);
  }
}

export class TutorialTaskWrapper extends ElementWrapper {
  findTitle(): ElementWrapper {
    return this.findByClassName(styles['task-title'])!;
  }

  /**
   * The task's progress in words: not started, in progress or done.
   */
  findStatus(): ElementWrapper {
    return this.findByClassName(styles['task-status'])!;
  }

  findTotalSteps(): ElementWrapper {
    return this.findByClassName(styles['total-steps'])!;
  }

  findSteps(): ElementWrapper[] {
    return this.findAllByClassName(styles.step);
  }

  /**
   * The S references of the task's steps, such as S1, in order.
   */
  findStepReferences(): ElementWrapper[] {
    return this.findAllByClassName(styles['step-reference']);
  }

  /**
   * The step the user is on, or `null` when it is in another task.
   */
  findCurrentStep(): ElementWrapper | null {
    return this.findByClassName(styles['step-in-progress']);
  }
}

export default class TutorialPanelWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The panel heading: the list title, or the title of the current tutorial.
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(helpPanelStyles.header);
  }

  findTutorials(): TutorialWrapper[] {
    return this.findAllByClassName(styles.tutorial).map(tutorial => new TutorialWrapper(tutorial.getElement()));
  }

  findDownloadLink(): ButtonWrapper | null {
    return this.findComponent(ButtonWrapper, `.${styles['download-link']}`);
  }

  findFeedbackLink(): LinkWrapper | null {
    return this.findComponent(LinkWrapper, `.${styles['feedback-link']}`);
  }

  /**
   * The tasks of the current tutorial, or none while the list is shown.
   */
  findTasks(): TutorialTaskWrapper[] {
    return this.findAllByClassName(styles.task).map(task => new TutorialTaskWrapper(task.getElement()));
  }

  /**
   * The progress measure of the current tutorial, such as "1 / 4". It is drawing only and hidden from
   * screen readers.
   */
  findProgress(): ElementWrapper | null {
    return this.findByClassName(styles['progress-measure']);
  }

  findExitButton(): ButtonWrapper | null {
    return this.findComponent(ButtonWrapper, `.${styles['exit-button']}`);
  }

  /**
   * The completion screen, shown while the current tutorial is completed.
   */
  findCompletionScreen(): ElementWrapper | null {
    return this.findByClassName(styles.completion);
  }

  findLoadingStatus(): ElementWrapper | null {
    return this.findByClassName(helpPanelStyles.loading);
  }
}
