// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import type { AnnotationContextProps } from '../../annotation-context/interfaces';

/**
 * A step with its place in the tutorial.
 */
export interface TutorialStep {
  step: AnnotationContextProps.Step;
  /**
   * Position among all steps of the tutorial, from 0.
   */
  index: number;
  taskIndex: number;
  /**
   * Position within its task, from 0.
   */
  indexInTask: number;
  taskStepCount: number;
}

export type AnnotationFocusTarget = 'annotation' | 'panel';

/**
 * What `AnnotationContext` shares with the hotspots and the tutorial panel inside it: the
 * running tutorial, where it stands, and the actions that move it along.
 */
export interface AnnotationContextValue {
  currentTutorial: AnnotationContextProps.Tutorial | null;
  steps: ReadonlyArray<TutorialStep>;
  currentStepIndex: number;
  annotationOpen: boolean;
  i18nStrings?: AnnotationContextProps.I18nStrings;
  /**
   * Returns whether focus should move to `target` now, and clears the request if so. A user
   * action that replaces the element with focus asks for focus to go into the annotation that
   * mounts next, or to the heading of the tutorial panel's new view. Content shown on page
   * load leaves focus where it is.
   */
  takeFocusRequest: (target: AnnotationFocusTarget) => boolean;
  startTutorial: (tutorial: AnnotationContextProps.Tutorial) => void;
  exitTutorial: (tutorial: AnnotationContextProps.Tutorial) => void;
  goToStep: (index: number, reason: AnnotationContextProps.StepChangeReason) => void;
  setAnnotationOpen: (open: boolean) => void;
  finish: () => void;
}

export const AnnotationContextContext = createContext<AnnotationContextValue | null>(null);

/**
 * The tutorial state, or `null` outside an `AnnotationContext`.
 */
export function useAnnotationContext(): AnnotationContextValue | null {
  return useContext(AnnotationContextContext);
}

/**
 * Lists every step of a tutorial in order, each with its task and position.
 */
export function flattenSteps(tutorial: AnnotationContextProps.Tutorial | null): TutorialStep[] {
  if (!tutorial) {
    return [];
  }
  const steps: TutorialStep[] = [];
  tutorial.tasks.forEach((task, taskIndex) =>
    task.steps.forEach((step, indexInTask) =>
      steps.push({ step, index: steps.length, taskIndex, indexInTask, taskStepCount: task.steps.length })
    )
  );
  return steps;
}
