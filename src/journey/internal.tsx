// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef } from 'react';

import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { QuestionContext } from '../internal/context/question-context';
import { fireNonCancelableEvent } from '../internal/events';
import { getHeadingTag } from '../internal/heading-level';
import { useControllable } from '../internal/hooks/use-controllable';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { JourneyProps } from './interfaces';
import { ProgressRuler } from './progress-ruler';

import styles from './styles.css.js';

function clampIndex(index: number, count: number): number {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}

/**
 * Moves focus to the question whenever the step changes, so keyboard and screen reader users start
 * on the new question instead of on a button that may have moved or gone.
 */
function useFocusOnStepChange(activeStepIndex: number) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownIndex = useRef(activeStepIndex);
  useEffect(() => {
    if (shownIndex.current !== activeStepIndex) {
      shownIndex.current = activeStepIndex;
      headingRef.current?.focus();
    }
  }, [activeStepIndex]);
  return headingRef;
}

export function InternalJourney({
  steps,
  activeStepIndex: controlledActiveStepIndex,
  onNavigate,
  onFinish,
  isLoading = false,
  finishButtonText,
  headingLevel,
  i18nStrings,
  ...rest
}: JourneyProps) {
  const i18n = useInternalI18n('journey');
  const [currentIndex, setCurrentIndex] = useControllable(controlledActiveStepIndex, 0);
  const activeStepIndex = clampIndex(currentIndex, steps.length);
  const headingRef = useFocusOnStepChange(activeStepIndex);
  const baseId = useId();

  if (steps.length === 0) {
    warnOnce('Journey', 'The journey needs at least one step.');
    return null;
  }

  const step = steps[activeStepIndex];
  const isLastStep = activeStepIndex === steps.length - 1;
  const questionId = `${baseId}question`;
  const counterId = `${baseId}counter`;
  const descriptionId = step.description ? `${baseId}description` : undefined;

  const navigate = (requestedStepIndex: number, reason: JourneyProps.NavigateReason) => {
    setCurrentIndex(requestedStepIndex);
    fireNonCancelableEvent(onNavigate, { requestedStepIndex, reason });
  };

  // The journey is a form so that Enter in a text field continues, as visitors expect on a website.
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    if (isLastStep) {
      fireNonCancelableEvent(onFinish, null);
    } else {
      navigate(activeStepIndex + 1, 'next');
    }
  };

  const counterText = i18n(
    'questionCounterText',
    i18nStrings?.questionCounterText?.(activeStepIndex + 1, steps.length),
    { questionNumber: activeStepIndex + 1, questionsCount: steps.length }
  );

  return (
    <form {...rest} className={styles.root} noValidate={true} onSubmit={handleSubmit}>
      <div className={styles.progress}>
        <ProgressRuler count={steps.length} activeIndex={activeStepIndex} />
        <p id={counterId} className={styles.counter}>
          <span className={styles['counter-text']}>{counterText}</span>
          {step.isOptional && <span className={styles.optional}>{i18n('optional', i18nStrings?.optional)}</span>}
        </p>
      </div>
      <div className={styles.header}>
        {React.createElement(
          getHeadingTag('Journey', headingLevel, 2),
          {
            ref: headingRef,
            id: questionId,
            className: styles.question,
            tabIndex: -1,
            'aria-describedby': counterId,
          },
          step.question
        )}
        {step.description && (
          <div id={descriptionId} className={styles.description}>
            {step.description}
          </div>
        )}
      </div>
      <QuestionContext.Provider value={{ questionId, descriptionId }}>
        <div key={step.id} className={styles.content}>
          {step.content}
        </div>
      </QuestionContext.Provider>
      <div role="alert" className={styles['error-region']}>
        {step.errorText && (
          <div className={styles.error}>
            <InternalIcon
              className={styles['error-icon']}
              name="status-negative"
              variant="error"
              ariaLabel={i18n('errorIconAriaLabel', i18nStrings?.errorIconAriaLabel)}
            />
            <div className={styles['error-text']}>{step.errorText}</div>
          </div>
        )}
      </div>
      <div className={styles.actions}>
        {activeStepIndex > 0 && (
          <InternalButton
            className={styles['back-button']}
            variant="link"
            iconName="angle-left"
            formAction="none"
            disabled={isLoading}
            onClick={() => navigate(activeStepIndex - 1, 'back')}
          >
            {i18n('backButton', i18nStrings?.backButton)}
          </InternalButton>
        )}
        <InternalButton
          className={styles['continue-button']}
          variant="primary"
          formAction="submit"
          loading={isLoading}
          loadingText={i18n('loadingText', i18nStrings?.loadingText)}
        >
          {isLastStep
            ? (finishButtonText ?? i18n('finishButton', i18nStrings?.finishButton))
            : i18n('continueButton', i18nStrings?.continueButton)}
        </InternalButton>
      </div>
    </form>
  );
}
