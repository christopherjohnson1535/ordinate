// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface WizardProps extends BaseComponentProps {
  /**
   * The steps of the flow, in order. The last step's primary button submits the flow.
   */
  steps: ReadonlyArray<WizardProps.Step>;
  /**
   * The index of the step shown, starting at 0. Set it together with `onNavigate` to control the
   * wizard, for example to validate a step before moving on. Without it the wizard moves between
   * steps on its own.
   */
  activeStepIndex?: number;
  /**
   * Called when the user asks for another step: with the next or previous button, a step in the
   * navigation, or the skip button. `detail.requestedStepIndex` is the step asked for and
   * `detail.reason` says how.
   */
  onNavigate?: NonCancelableEventHandler<WizardProps.NavigateDetail>;
  /**
   * Called when the user chooses the primary button on the last step.
   */
  onSubmit?: NonCancelableEventHandler;
  /**
   * Called when the user chooses the cancel button. Ask before discarding what the user entered.
   */
  onCancel?: NonCancelableEventHandler;
  /**
   * Shows the primary button as loading and stops navigation, while the next step is checked or
   * prepared, for example by a request to a server.
   */
  isLoadingNextStep?: boolean;
  /**
   * Lets the user skip ahead past optional steps: a skip button jumps to the next required step,
   * and a later step in the navigation can be chosen when every step between the farthest step
   * reached and it is optional. Choosing one fires `onNavigate` with the reason `skip`.
   */
  allowSkipTo?: boolean;
  /**
   * Text of the primary button on the last step, such as "Create cluster".
   */
  submitButtonText?: string;
  /**
   * Less important actions, shown at the start of the footer, such as "Save draft".
   */
  secondaryActions?: React.ReactNode;
  /**
   * Replaces the built-in labels of the wizard.
   */
  i18nStrings?: WizardProps.I18nStrings;
}

export namespace WizardProps {
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
     * An error for the whole step, shown above the buttons. Say what went wrong and what to do.
     */
    errorText?: React.ReactNode;
    /**
     * Marks the step as optional. It is labelled as such, and with `allowSkipTo` it can be skipped.
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
     * Heading of the navigation when the wizard is too narrow to show it beside the step.
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
     * Text of the primary button on the last step. `submitButtonText` takes precedence.
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
  }
}
