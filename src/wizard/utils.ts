// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { WizardProps } from './interfaces';

/**
 * How a step appears in the navigation: the step shown, a step the user has reached before, a
 * later step that can be reached by skipping optional steps, or a step out of reach.
 */
export type StepStatus = 'active' | 'visited' | 'skippable' | 'unvisited';

export interface NavigationState {
  steps: ReadonlyArray<WizardProps.Step>;
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  isLoadingNextStep: boolean;
}

function allOptional(steps: ReadonlyArray<WizardProps.Step>, from: number, to: number): boolean {
  return steps.slice(from, to).every(step => step.isOptional);
}

export function getStepStatus(index: number, state: NavigationState): StepStatus {
  const { steps, activeStepIndex, farthestStepIndex, allowSkipTo } = state;
  if (index === activeStepIndex) {
    return 'active';
  }
  if (index <= farthestStepIndex) {
    return 'visited';
  }
  // Every step a skip passes over, between the farthest step reached and the one chosen, must be optional.
  if (allowSkipTo && allOptional(steps, farthestStepIndex + 1, index)) {
    return 'skippable';
  }
  return 'unvisited';
}

/**
 * The step the skip button jumps to: the first required step after the optional steps that
 * follow the active one, or the last step. Returns -1 when the next step is required, since
 * there is nothing to skip.
 */
export function findSkipToTargetIndex(steps: ReadonlyArray<WizardProps.Step>, activeStepIndex: number): number {
  let target = activeStepIndex + 1;
  while (target < steps.length - 1 && steps[target].isOptional) {
    target++;
  }
  return target > activeStepIndex + 1 && target < steps.length ? target : -1;
}
