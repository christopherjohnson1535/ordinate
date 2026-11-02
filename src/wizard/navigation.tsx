// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { WizardProps } from './interfaces';
import { getStepStatus, NavigationState, StepStatus } from './utils';

import styles from './styles.css.js';

export interface WizardNavigationProps {
  state: NavigationState;
  stepNumberLabel: (stepNumber: number) => string | undefined;
  optionalLabel: string | undefined;
  /**
   * Shows the references only, with the names kept for screen readers, when the wizard is too narrow for them.
   */
  compact: boolean;
  onStepClick: (index: number, status: StepStatus) => void;
}

function StepTitle({
  step,
  index,
  status,
  inert,
  stepNumberLabel,
  onStepClick,
}: {
  step: WizardProps.Step;
  index: number;
  status: StepStatus;
  inert: boolean;
  stepNumberLabel: string | undefined;
  onStepClick: WizardNavigationProps['onStepClick'];
}) {
  // The step number is read from the hidden label, so the reference beside it is drawing only.
  const content = (
    <>
      <span className={styles['screenreader-only']}>{stepNumberLabel}</span>
      <span className={styles['navigation-reference']} aria-hidden="true">
        S{index + 1}
      </span>{' '}
      <span className={styles['navigation-name']}>{step.title}</span>
    </>
  );
  if (inert && status !== 'active') {
    return <span className={clsx(styles['navigation-title'], styles[`navigation-title-${status}`])}>{content}</span>;
  }
  switch (status) {
    case 'active':
      return (
        <span className={clsx(styles['navigation-title'], styles['navigation-title-active'])} aria-current="step">
          {content}
        </span>
      );
    case 'visited':
    case 'skippable':
      return (
        <button
          type="button"
          className={clsx(styles['navigation-title'], styles['navigation-link'])}
          onClick={() => onStepClick(index, status)}
        >
          {content}
        </button>
      );
    case 'unvisited':
      return <span className={clsx(styles['navigation-title'], styles['navigation-title-unvisited'])}>{content}</span>;
  }
}

/**
 * The step scale across the top of the wizard: a dimension line with a tick for each step, inked up to the
 * current step, whose tick stands tallest. Each tick is labelled with the step's reference and name. Steps
 * the user has reached, and later ones that can be skipped to, are buttons; the rest are plain text.
 */
export function WizardNavigation({
  state,
  stepNumberLabel,
  optionalLabel,
  compact,
  onStepClick,
}: WizardNavigationProps) {
  const count = state.steps.length;
  // Each step owns an equal share of the line, with its tick in the middle of the share.
  const tickAt = (index: number) => `${((index + 0.5) / count) * 100}%`;

  return (
    <div className={clsx(styles.scale, compact && styles['scale-compact'])}>
      <div className={styles['scale-line']} aria-hidden="true">
        <span className={styles['scale-done']} style={{ inlineSize: tickAt(state.activeStepIndex) }} />
        {state.steps.map((_, index) => (
          <span
            key={index}
            className={clsx(
              styles['scale-tick'],
              index < state.activeStepIndex && styles['scale-tick-done'],
              index === state.activeStepIndex && styles['scale-tick-active']
            )}
            style={{ insetInlineStart: tickAt(index) }}
          />
        ))}
      </div>
      <ol className={styles['navigation-list']} style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {state.steps.map((step, index) => {
          const status = getStepStatus(index, state);
          return (
            <li
              key={index}
              className={clsx(styles['navigation-item'], index < state.activeStepIndex && styles['navigation-done'])}
            >
              <StepTitle
                step={step}
                index={index}
                status={status}
                // While the next step loads, the steps keep their look but cannot be chosen.
                inert={state.isLoadingNextStep}
                stepNumberLabel={stepNumberLabel(index + 1)}
                onStepClick={onStepClick}
              />
              {step.isOptional && <span className={styles['navigation-optional']}>{optionalLabel}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
