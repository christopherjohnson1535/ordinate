// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface JourneyProps extends BaseComponentProps {
  /**
   * The questions, in order, one per screen. Each step has:
   * * `id`: a name for the step that stays the same while the flow runs, such as `budget`.
   * * `question`: the question in plain words, such as "When would you like to start?". It is the
   *   heading of the screen.
   * * `description` (optional): a line under the question that helps answer it.
   * * `content`: how to answer, usually `Tiles` or a few form fields. `Tiles` placed here are drawn as
   *   large answer tiles and are named by the question.
   * * `errorText` (optional): what is wrong with the answer, shown above the buttons.
   * * `isOptional` (optional): marks a question that can be left unanswered.
   */
  steps: ReadonlyArray<JourneyProps.Step>;
  /**
   * The index of the question shown, starting at 0. Set it together with `onNavigate` to control the
   * flow, for example to check an answer before moving on. Without it the journey moves between
   * questions on its own.
   */
  activeStepIndex?: number;
  /**
   * Called when the visitor asks for the next or the previous question. `detail.requestedStepIndex` is
   * the question asked for and `detail.reason` is `next` or `back`.
   */
  onNavigate?: NonCancelableEventHandler<JourneyProps.NavigateDetail>;
  /**
   * Called when the visitor chooses the finish button on the last question.
   */
  onFinish?: NonCancelableEventHandler;
  /**
   * Shows the continue button as loading and stops navigation, for example while an answer is sent.
   */
  isLoading?: boolean;
  /**
   * Text of the button on the last question, such as "Send my request".
   */
  finishButtonText?: string;
  /**
   * The level of the question's heading, from 1 to 6. Choose the level that fits the page's outline.
   */
  headingLevel?: JourneyProps.HeadingLevel;
  /**
   * Replaces the built-in labels of the journey.
   */
  i18nStrings?: JourneyProps.I18nStrings;
}

export namespace JourneyProps {
  export interface Step {
    id: string;
    question: React.ReactNode;
    description?: React.ReactNode;
    content: React.ReactNode;
    errorText?: React.ReactNode;
    isOptional?: boolean;
  }

  export type NavigateReason = 'next' | 'back';

  export interface NavigateDetail {
    requestedStepIndex: number;
    reason: NavigateReason;
  }

  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export interface I18nStrings {
    backButton?: string;
    continueButton?: string;
    /**
     * Text of the button on the last question. `finishButtonText` takes precedence.
     */
    finishButton?: string;
    /**
     * The line above the question that says where the visitor is, such as "Question 2 of 5".
     */
    questionCounterText?: (questionNumber: number, questionsCount: number) => string;
    /**
     * Label shown next to the counter on an optional question.
     */
    optional?: string;
    /**
     * Accessible name of the icon next to a question's `errorText`.
     */
    errorIconAriaLabel?: string;
    /**
     * Announced while `isLoading` is set.
     */
    loadingText?: string;
  }
}
