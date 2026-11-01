// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AnnotationContextProps } from '../annotation-context/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TutorialPanelProps extends BaseComponentProps {
  /**
   * The tutorials offered on this page. Mark a tutorial `completed` once the user has finished
   * it, so the list offers to restart it. The panel must sit inside an `AnnotationContext`,
   * which starts the tutorials and tracks their progress.
   */
  tutorials: ReadonlyArray<TutorialPanelProps.Tutorial>;
  /**
   * Replaces the list with a loading indicator, for tutorials that are fetched on demand.
   */
  loading?: boolean;
  /**
   * Shows a feedback link at the end of the panel and is called when the user chooses it.
   */
  onFeedbackClick?: NonCancelableEventHandler<null>;
  /**
   * Address of a printable version of the tutorials, linked above the list.
   */
  downloadUrl?: string;
  /**
   * Text of the panel:
   *
   * * `loadingText` is shown while `loading` is set.
   * * `tutorialListTitle` and `tutorialListDescription` head the list of tutorials.
   * * `tutorialListDownloadLinkText` labels the link to `downloadUrl`.
   * * `tutorialCompletedText` marks a completed tutorial in the list.
   * * `learnMoreLinkText` labels the link to a tutorial's `learnMoreUrl`.
   * * `startTutorialButtonText` and `restartTutorialButtonText` label the start button.
   * * `exitTutorialButtonText` labels the button that leaves the current tutorial.
   * * `completionScreenTitle` heads the screen shown when the current tutorial is completed.
   * * `feedbackLinkText` labels the feedback link.
   * * `taskTitle` returns the title of a task, from its number and title.
   * * `totalStepsText` returns the number of steps in a task.
   * * `labelsTaskStatus` names the progress of a task for screen readers: `pending`,
   *   `inProgress` and `success`.
   */
  i18nStrings?: TutorialPanelProps.I18nStrings;
}

export namespace TutorialPanelProps {
  export type Tutorial = AnnotationContextProps.Tutorial;

  export interface I18nStrings {
    loadingText?: string;
    tutorialListTitle?: string;
    tutorialListDescription?: string;
    tutorialListDownloadLinkText?: string;
    tutorialCompletedText?: string;
    learnMoreLinkText?: string;
    startTutorialButtonText?: string;
    restartTutorialButtonText?: string;
    exitTutorialButtonText?: string;
    completionScreenTitle?: string;
    feedbackLinkText?: string;
    taskTitle?: (taskNumber: number, taskTitle: string) => string;
    totalStepsText?: (totalStepCount: number) => string;
    labelsTaskStatus?: TaskStatusLabels;
  }

  export interface TaskStatusLabels {
    pending?: string;
    inProgress?: string;
    success?: string;
  }
}
