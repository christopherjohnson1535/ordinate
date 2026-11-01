// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { StepTrack } from '../internal/components/step-track';
import { WizardProps } from './interfaces';
import { getStepStatus, NavigationState, StepStatus } from './utils';

import styles from './styles.css.js';

export interface WizardNavigationProps {
  state: NavigationState;
  stepNumberLabel: (stepNumber: number) => string | undefined;
  optionalLabel: string | undefined;
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
  const content = (
    <>
      <span className={styles['screenreader-only']}>{stepNumberLabel}</span> {step.title}
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
 * The list of steps beside the form. Steps the user has reached, and later ones that can be
 * skipped to, are buttons; the rest are plain text.
 */
export function WizardNavigation({ state, stepNumberLabel, optionalLabel, onStepClick }: WizardNavigationProps) {
  return (
    <StepTrack
      className={styles['navigation-list']}
      markerSize="balloon"
      items={state.steps.map((step, index) => {
        const status = getStepStatus(index, state);
        return {
          key: String(index),
          upcoming: index > state.farthestStepIndex,
          itemProps: { className: styles['navigation-item'] },
          marker: (
            <span className={clsx(styles.balloon, styles[`balloon-${status}`])} aria-hidden="true">
              {index + 1}
            </span>
          ),
          head: (
            <StepTitle
              step={step}
              index={index}
              status={status}
              // While the next step loads, the steps keep their look but cannot be chosen.
              inert={state.isLoadingNextStep}
              stepNumberLabel={stepNumberLabel(index + 1)}
              onStepClick={onStepClick}
            />
          ),
          details: step.isOptional ? <span className={styles['navigation-optional']}>{optionalLabel}</span> : null,
        };
      })}
    />
  );
}
