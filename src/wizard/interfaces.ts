// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface WizardProps extends BaseComponentProps {
  /**
   * How the flow is laid out:
   * * `checklist` (the default): a checklist sheet. Every step is an item on one sheet, numbered in
   *   the margin, and items can be filled in any order. The open item shows its content, checked
   *   items fold to a one-line summary with a Change button, and the sheet is submitted from its
   *   footer once every required item has been opened and no item has an error.
   * * `steps`: one step at a time, under a step scale that runs across the top: a tick for each step,
   *   labelled with its reference (S1, S2…) and name, inked up to the current step. The step takes the
   *   full width, with the previous and next buttons on a rule at its foot. The last step's primary
   *   button submits the flow.
   */
  variant?: WizardProps.Variant;
  /**
   * What the flow sets up, as for Container. The kind colors the step scale, the step references and the
   * hash marks on the footer rule. Only the `steps` variant uses it.
   * - `configuration` for settings people change, drawn in drafting blue.
   * - `resource` for things that exist or run, drawn in teal.
   * - `policy` for rules the system follows, drawn in plum.
   * - `neutral` for anything else, drawn in graphite.
   */
  kind?: WizardProps.Kind;
  /**
   * A short reference for the flow, such as `C4`, set before the step count above each step's heading, so
   * other parts of the page can point at it. Only the `steps` variant uses it.
   */
  reference?: string;
  /**
   * The steps of the flow, in order.
   */
  steps: ReadonlyArray<WizardProps.Step>;
  /**
   * The index of the step shown, starting at 0: the open item of a checklist. Set it together with
   * `onNavigate` to control the wizard, for example to validate a step before moving on. Without it
   * the wizard moves between steps on its own.
   */
  activeStepIndex?: number;
  /**
   * Called when the user asks for another step. `detail.requestedStepIndex` is the step asked for
   * and `detail.reason` says how: `next` or `previous` from those buttons, `step` from a step in the
   * navigation or from an item's Open or Change button in a checklist, and `skip` from the skip
   * button or a skipped-to step.
   */
  onNavigate?: NonCancelableEventHandler<WizardProps.NavigateDetail>;
  /**
   * Called when the user chooses the submit button: the primary button on the last step, or the
   * button in the footer of a checklist.
   */
  onSubmit?: NonCancelableEventHandler;
  /**
   * Called when the user chooses the cancel button. Ask before discarding what the user entered.
   */
  onCancel?: NonCancelableEventHandler;
  /**
   * Shows the next button as loading and stops navigation and submitting, while the next step is
   * checked or prepared, for example by a request to a server.
   */
  isLoadingNextStep?: boolean;
  /**
   * Lets the user skip ahead past optional steps: a skip button jumps to the next required step,
   * and a later step in the navigation can be chosen when every step between the farthest step
   * reached and it is optional. Choosing one fires `onNavigate` with the reason `skip`.
   * A checklist lets every item be opened at any time, so it does not use this.
   */
  allowSkipTo?: boolean;
  /**
   * Text of the submit button, such as "Create cluster". It defaults to "Submit" in the `steps`
   * variant and to "Issue" on a checklist.
   */
  submitButtonText?: string;
  /**
   * Less important actions, shown at the start of the footer, such as "Save draft".
   */
  secondaryActions?: React.ReactNode;
  /**
   * A side column beside the checklist sheet, such as a summary of the choices so far and a title
   * block. It moves below the sheet when the wizard is narrow. Only shown on a checklist.
   */
  aside?: React.ReactNode;
  /**
   * Replaces the built-in labels of the wizard.
   */
  i18nStrings?: WizardProps.I18nStrings;
}

export namespace WizardProps {
  export type Variant = 'checklist' | 'steps';

  export type Kind = 'configuration' | 'resource' | 'policy' | 'neutral';

  export interface Step {
    /**
     * The name of the step, shown as its heading and in the navigation.
     */
    title: string;
    /**
     * Content shown after the heading, usually an info link that opens help.
     */
    info?: React.ReactNode;
    /**
     * Supporting text shown below the heading.
     */
    description?: React.ReactNode;
    /**
     * The fields of the step, usually form fields in containers.
     */
    content: React.ReactNode;
    /**
     * One line shown for a checked item of a checklist, such as the values chosen. Defaults to "Done".
     */
    summary?: React.ReactNode;
    /**
     * An error for the whole step. Say what went wrong and what to do. The `steps` variant shows it
     * above the buttons; a checklist circles the item with a revision cloud, numbers it in the
     * footer's count of open errors, and cannot be submitted until it is cleared.
     */
    errorText?: React.ReactNode;
    /**
     * Marks the step as optional. It is labelled as such, and with `allowSkipTo` it can be skipped.
     * A checklist can be submitted without opening it.
     */
    isOptional?: boolean;
  }

  export type NavigateReason = 'next' | 'previous' | 'step' | 'skip';

  export interface NavigateDetail {
    requestedStepIndex: number;
    reason: NavigateReason;
  }

  export interface I18nStrings {
    /**
     * Accessible label of a step in the navigation, given the step's number counted from 1.
     */
    stepNumberLabel?: (stepNumber: number) => string;
    /**
     * The step count set above the heading of each step, such as "Step 2 of 4".
     */
    collapsedStepsLabel?: (stepNumber: number, stepsCount: number) => string;
    /**
     * Text of the skip button, given the step it skips to and that step's number.
     */
    skipToButtonLabel?: (step: Step, stepNumber: number) => string;
    /**
     * Accessible name of the navigation.
     */
    navigationAriaLabel?: string;
    cancelButton?: string;
    previousButton?: string;
    nextButton?: string;
    /**
     * Text of the submit button. `submitButtonText` takes precedence.
     */
    submitButton?: string;
    /**
     * Label added to the title of an optional step.
     */
    optional?: string;
    /**
     * Accessible name of the icon next to a step's `errorText`.
     */
    errorIconAriaLabel?: string;
    /**
     * Announced while `isLoadingNextStep` is set.
     */
    loadingNextStepText?: string;
    /**
     * Accessible name of the list of items on a checklist.
     */
    checklistAriaLabel?: string;
    /**
     * Summary of a checked item that has no `summary`.
     */
    doneSummary?: string;
    /**
     * Text of the button that reopens a checked item.
     */
    changeButton?: string;
    /**
     * Accessible name of the button that reopens a checked item, given the step and its number.
     */
    changeButtonAriaLabel?: (step: Step, stepNumber: number) => string;
    /**
     * Text of the button that opens an item not opened yet.
     */
    openButton?: string;
    /**
     * Accessible name of the button that opens an item not opened yet, given the step and its number.
     */
    openButtonAriaLabel?: (step: Step, stepNumber: number) => string;
    /**
     * The count of required items checked, at the start of a checklist's footer.
     */
    checkedStatusText?: (checkedCount: number, requiredCount: number) => string;
    /**
     * The count of items with an error, drawn after a revision mark in a checklist's footer.
     */
    openErrorsMarkText?: (errorCount: number) => string;
    /**
     * The count of items with an error, as read by screen readers.
     */
    openErrorsText?: (errorCount: number) => string;
  }
}
