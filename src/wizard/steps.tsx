// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InternalExpandableSection } from '../expandable-section/internal';
import { InternalForm } from '../form/internal';
import { InternalHeader } from '../header/internal';
import { breakpointMinWidths } from '../internal/breakpoints';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerWidth } from '../internal/hooks/use-container-width';
import { useControllable } from '../internal/hooks/use-controllable';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { InternalSpaceBetween } from '../space-between/internal';
import { WizardProps } from './interfaces';
import { WizardNavigation } from './navigation';
import { findSkipToTargetIndex, NavigationState, StepStatus } from './utils';

import styles from './styles.css.js';

function clampIndex(index: number, count: number): number {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0));
}

/**
 * Moves focus to the step's heading whenever the step changes, so keyboard and screen reader users
 * start reading the new step from its top.
 */
function useFocusHeadingOnStepChange(activeStepIndex: number) {
  const headerRef = useRef<HTMLDivElement>(null);
  const shownIndex = useRef(activeStepIndex);
  useEffect(() => {
    if (shownIndex.current === activeStepIndex) {
      return;
    }
    shownIndex.current = activeStepIndex;
    const heading = headerRef.current?.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }, [activeStepIndex]);
  return headerRef;
}

export function InternalWizard({
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
  ...rest
}: WizardProps) {
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
  const collapsed = width !== null && width < breakpointMinWidths.xs;
  const [navigationExpanded, setNavigationExpanded] = useState(false);

  const headerRef = useFocusHeadingOnStepChange(activeStepIndex);

  if (steps.length === 0) {
    warnOnce('Wizard', 'The wizard needs at least one step.');
    return null;
  }

  const navigate = (requestedStepIndex: number, reason: WizardProps.NavigateReason) => {
    setCurrentIndex(requestedStepIndex);
    setNavigationExpanded(false);
    fireNonCancelableEvent(onNavigate, { requestedStepIndex, reason });
  };

  const state: NavigationState = { steps, activeStepIndex, farthestStepIndex, allowSkipTo, isLoadingNextStep };
  const skipToIndex = allowSkipTo ? findSkipToTargetIndex(steps, activeStepIndex) : -1;
  const stepsCount = steps.length;

  const stepNumberLabel = (stepNumber: number) =>
    i18n('stepNumberLabel', i18nStrings?.stepNumberLabel?.(stepNumber), { stepNumber });
  const collapsedStepsLabel = i18n(
    'collapsedStepsLabel',
    i18nStrings?.collapsedStepsLabel?.(activeStepIndex + 1, stepsCount),
    { stepNumber: activeStepIndex + 1, stepsCount }
  );
  const optionalLabel = i18n('optional', i18nStrings?.optional);
  const navigationAriaLabel = i18n('navigationAriaLabel', i18nStrings?.navigationAriaLabel);

  const navigation = (
    <WizardNavigation
      state={state}
      stepNumberLabel={stepNumberLabel}
      optionalLabel={optionalLabel}
      onStepClick={(index: number, status: StepStatus) => navigate(index, status === 'skippable' ? 'skip' : 'step')}
    />
  );

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
    <div {...rest} ref={rootRef} className={clsx(styles.root, collapsed && styles.collapsed)}>
      <nav className={styles.navigation} aria-label={navigationAriaLabel}>
        {collapsed ? (
          <InternalExpandableSection
            className={styles['navigation-toggle']}
            headerText={collapsedStepsLabel}
            expanded={navigationExpanded}
            onChange={event => setNavigationExpanded(event.detail.expanded)}
          >
            {navigation}
          </InternalExpandableSection>
        ) : (
          navigation
        )}
      </nav>
      <div className={styles.main}>
        <InternalForm
          header={
            <div ref={headerRef} className={styles['step-header']}>
              <InternalHeader
                variant="h1"
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
          secondaryActions={secondaryActions}
          actions={actions}
        >
          <div className={styles.content}>{step.content}</div>
        </InternalForm>
      </div>
    </div>
  );
}
