// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { NonCancelableEventHandler } from '../internal/events';

export interface AnnotationContextProps {
  /**
   * The tutorial in progress, or `null` when none is. Set it from `onStartTutorial` and clear
   * it from `onExitTutorial`. Mark it `completed` from `onFinish` to show the completion
   * screen in the tutorial panel.
   */
  currentTutorial: AnnotationContextProps.Tutorial | null;
  /**
   * The page the tutorial runs over. Place a `Hotspot` next to each element a step points at,
   * and a `TutorialPanel` in the help panel, anywhere inside.
   */
  children?: React.ReactNode;
  /**
   * Called when the user starts or restarts a tutorial from the tutorial panel, with the
   * tutorial in `detail.tutorial`. Set it as `currentTutorial`, with `completed` set to `false`
   * when it is restarted.
   */
  onStartTutorial?: NonCancelableEventHandler<AnnotationContextProps.TutorialDetail>;
  /**
   * Called when the user leaves the current tutorial from the tutorial panel, with the
   * tutorial in `detail.tutorial`. Set `currentTutorial` to `null`.
   */
  onExitTutorial?: NonCancelableEventHandler<AnnotationContextProps.TutorialDetail>;
  /**
   * Called when the current step changes, with its position among all steps of the tutorial
   * in `detail.step`, counted from 0, and the cause in `detail.reason`:
   *
   * * `next`: the user chose the next button.
   * * `previous`: the user chose the previous button.
   * * `open`: the user opened another step's hotspot.
   */
  onStepChange?: NonCancelableEventHandler<AnnotationContextProps.StepChangeDetail>;
  /**
   * Called when the user chooses the finish button on the last step. Mark the tutorial
   * `completed`.
   */
  onFinish?: NonCancelableEventHandler<null>;
  /**
   * Text of the annotations:
   *
   * * `nextButtonText`, `previousButtonText` and `finishButtonText` label the step buttons.
   * * `labelDismissAnnotation` is the accessible name of the close button.
   * * `labelHotspot` returns the accessible name of a hotspot, from whether its annotation is
   *   open and the step's number and the number of steps in its task.
   * * `stepCounterText` returns the step counter, from the step's number and the number of
   *   steps in its task.
   * * `taskTitle` returns the task line above the step title, from the task's number and title.
   */
  i18nStrings?: AnnotationContextProps.I18nStrings;
}

export namespace AnnotationContextProps {
  export interface Tutorial {
    /**
     * The tutorial's name, shown in the tutorial panel. It also identifies the tutorial, so keep
     * it unique on the page.
     */
    title: string;
    /**
     * A short explanation of what the tutorial teaches, shown in the tutorial list.
     */
    description?: React.ReactNode;
    tasks: ReadonlyArray<Task>;
    /**
     * Whether the user has finished the tutorial. The list shows it as completed with a restart
     * button, and the current tutorial shows the completion screen.
     */
    completed?: boolean;
    /**
     * Text of the completion screen.
     */
    completedScreenDescription?: React.ReactNode;
    /**
     * Shows `prerequisitesAlert` in the tutorial list and disables the start button.
     */
    prerequisitesNeeded?: boolean;
    /**
     * What the user has to do before the tutorial can start.
     */
    prerequisitesAlert?: React.ReactNode;
    /**
     * Address of further documentation, linked from the tutorial list.
     */
    learnMoreUrl?: string;
  }

  export interface Task {
    title: string;
    steps: ReadonlyArray<Step>;
  }

  export interface Step {
    title: string;
    content: React.ReactNode;
    /**
     * The `hotspotId` of the `Hotspot` the step's annotation points at.
     */
    hotspotId: string;
    /**
     * A warning shown in the annotation, for example when the user's last action undid an
     * earlier step.
     */
    warningAlert?: React.ReactNode;
  }

  export interface TutorialDetail {
    tutorial: Tutorial;
  }

  export type StepChangeReason = 'next' | 'previous' | 'open';

  export interface StepChangeDetail {
    step: number;
    reason: StepChangeReason;
  }

  export interface I18nStrings {
    nextButtonText?: string;
    previousButtonText?: string;
    finishButtonText?: string;
    labelDismissAnnotation?: string;
    labelHotspot?: (open: boolean, stepNumber: number, totalStepCount: number) => string;
    stepCounterText?: (stepNumber: number, totalStepCount: number) => string;
    taskTitle?: (taskNumber: number, taskTitle: string) => string;
  }
}
