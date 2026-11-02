// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalForm } from '../form/internal';
import { InternalHeader } from '../header/internal';
import { breakpointMinWidths } from '../internal/breakpoints';
import { RuleEndMarks } from '../internal/components/construction';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerWidth } from '../internal/hooks/use-container-width';
import { useControllable } from '../internal/hooks/use-controllable';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalSpaceBetween } from '../space-between/internal';
import { WizardProps } from './interfaces';
import { WizardNavigation } from './navigation';
import { useFocusHeadingOnStepChange } from './use-focus-heading';
import { clampIndex, findSkipToTargetIndex, NavigationState, StepStatus } from './utils';

import styles from './styles.css.js';

export type StepsWizardProps = Omit<WizardProps, 'variant' | 'aside'>;

/**
 * One step at a time, under a step scale that runs across the top, with the previous and next buttons on a
 * rule at the foot. The step takes the full width.
 */
export function StepsWizard({
  steps,
  activeStepIndex: controlledActiveStepIndex,
  onNavigate,
  onSubmit,
  onCancel,
  isLoadingNextStep = false,
  allowSkipTo = false,
  submitButtonText,
  secondaryActions,
  i18nStrings,
  kind = 'neutral',
  reference,
  ...rest
}: StepsWizardProps) {
  const i18n = useInternalI18n('wizard');
  const [currentIndex, setCurrentIndex] = useControllable(controlledActiveStepIndex, 0);
  const activeStepIndex = clampIndex(currentIndex, steps.length);
  const step = steps[activeStepIndex];
  const isLastStep = activeStepIndex === steps.length - 1;

  // The navigation offers every step the user has reached, even after going back.
  const [farthestStepIndex, setFarthestStepIndex] = useState(activeStepIndex);
  if (activeStepIndex > farthestStepIndex) {
    setFarthestStepIndex(activeStepIndex);
  }

  const rootRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(rootRef);
  const compact = width !== null && width < breakpointMinWidths.xs;

  const headerRef = useFocusHeadingOnStepChange(activeStepIndex);

  const navigate = (requestedStepIndex: number, reason: WizardProps.NavigateReason) => {
    setCurrentIndex(requestedStepIndex);
    fireNonCancelableEvent(onNavigate, { requestedStepIndex, reason });
  };

  const state: NavigationState = { steps, activeStepIndex, farthestStepIndex, allowSkipTo, isLoadingNextStep };
  const skipToIndex = allowSkipTo ? findSkipToTargetIndex(steps, activeStepIndex) : -1;
  const stepsCount = steps.length;

  const stepNumberLabel = (stepNumber: number) =>
    i18n('stepNumberLabel', i18nStrings?.stepNumberLabel?.(stepNumber), { stepNumber });
  const stepCounter = i18n('collapsedStepsLabel', i18nStrings?.collapsedStepsLabel?.(activeStepIndex + 1, stepsCount), {
    stepNumber: activeStepIndex + 1,
    stepsCount,
  });
  const optionalLabel = i18n('optional', i18nStrings?.optional);
  const navigationAriaLabel = i18n('navigationAriaLabel', i18nStrings?.navigationAriaLabel);

  const actions = (
    <InternalSpaceBetween direction="horizontal" size="xs">
      <InternalButton
        className={styles['cancel-button']}
        variant="link"
        formAction="none"
        onClick={() => fireNonCancelableEvent(onCancel, null)}
      >
        {i18n('cancelButton', i18nStrings?.cancelButton)}
      </InternalButton>
      {skipToIndex >= 0 && (
        <InternalButton
          className={styles['skip-to-button']}
          formAction="none"
          disabled={isLoadingNextStep}
          onClick={() => navigate(skipToIndex, 'skip')}
        >
          {i18n('skipToButtonLabel', i18nStrings?.skipToButtonLabel?.(steps[skipToIndex], skipToIndex + 1), {
            title: steps[skipToIndex].title,
            stepNumber: skipToIndex + 1,
          })}
        </InternalButton>
      )}
      {activeStepIndex > 0 && (
        <InternalButton
          className={styles['previous-button']}
          formAction="none"
          disabled={isLoadingNextStep}
          onClick={() => navigate(activeStepIndex - 1, 'previous')}
        >
          {i18n('previousButton', i18nStrings?.previousButton)}
        </InternalButton>
      )}
      <InternalButton
        className={styles['primary-button']}
        variant="primary"
        formAction="none"
        loading={isLoadingNextStep}
        loadingText={i18n('loadingNextStepText', i18nStrings?.loadingNextStepText)}
        onClick={() => (isLastStep ? fireNonCancelableEvent(onSubmit, null) : navigate(activeStepIndex + 1, 'next'))}
      >
        {isLastStep
          ? (submitButtonText ?? i18n('submitButton', i18nStrings?.submitButton))
          : i18n('nextButton', i18nStrings?.nextButton)}
      </InternalButton>
    </InternalSpaceBetween>
  );

  return (
    <div {...rest} ref={rootRef} className={clsx(styles.root, styles['variant-steps'], styles[`kind-${kind}`])}>
      <nav className={styles.navigation} aria-label={navigationAriaLabel}>
        <WizardNavigation
          state={state}
          stepNumberLabel={stepNumberLabel}
          optionalLabel={optionalLabel}
          compact={compact}
          onStepClick={(index: number, status: StepStatus) => navigate(index, status === 'skippable' ? 'skip' : 'step')}
        />
      </nav>
      <div className={styles.main}>
        <InternalForm
          header={
            <div ref={headerRef} className={styles['step-header']}>
              <InternalHeader
                variant="h1"
                code={
                  <span className={styles['step-counter']}>
                    {reference && (
                      <>
                        {reference}
                        <span aria-hidden="true">{' \u00b7 '}</span>
                      </>
                    )}
                    {stepCounter}
                  </span>
                }
                info={step.info}
                description={step.description}
                counter={
                  step.isOptional ? <span className={styles['header-optional']}>- {optionalLabel}</span> : undefined
                }
              >
                {step.title}
              </InternalHeader>
            </div>
          }
          errorText={step.errorText}
          errorIconAriaLabel={i18n('errorIconAriaLabel', i18nStrings?.errorIconAriaLabel)}
        >
          <div className={styles.content}>{step.content}</div>
        </InternalForm>
        <div className={styles['footer-rule']}>
          <RuleEndMarks kind={kind} />
          {secondaryActions && <div className={styles['secondary-actions']}>{secondaryActions}</div>}
          <div className={styles['footer-actions']}>{actions}</div>
        </div>
      </div>
    </div>
  );
}
