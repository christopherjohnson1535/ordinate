// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { WizardProps } from './interfaces';

export function clampIndex(index: number, count: number): number {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}

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

/**
 * Where an item of a checklist stands: open, opened before, or not opened yet.
 */
export type ChecklistItemStatus = 'active' | 'visited' | 'unvisited';

export interface ChecklistItemState {
  status: ChecklistItemStatus;
  /**
   * The item's number among the items with an error, counted from 1, as in "△2". Null without an error.
   */
  revision: number | null;
}

export interface ChecklistState {
  items: ReadonlyArray<ChecklistItemState>;
  requiredCount: number;
  checkedCount: number;
  errorCount: number;
  canSubmit: boolean;
}

/**
 * Works out the marks of a checklist. A required item is checked once it has been opened and left
 * without an error. The sheet can be submitted when every required item has been opened, including
 * the open one, and no item has an error; at that point every required item counts as checked.
 */
export function getChecklistState(
  steps: ReadonlyArray<WizardProps.Step>,
  activeStepIndex: number,
  visited: ReadonlySet<number>
): ChecklistState {
  let errorCount = 0;
  const items = steps.map((step, index): ChecklistItemState => {
    const status: ChecklistItemStatus =
      index === activeStepIndex ? 'active' : visited.has(index) ? 'visited' : 'unvisited';
    return { status, revision: step.errorText ? ++errorCount : null };
  });
  const required = items.filter((_, index) => !steps[index].isOptional);
  const canSubmit = errorCount === 0 && required.every(item => item.status !== 'unvisited');
  const checkedCount = canSubmit
    ? required.length
    : required.filter(item => item.status === 'visited' && item.revision === null).length;
  return { items, requiredCount: required.length, checkedCount, errorCount, canSubmit };
}
