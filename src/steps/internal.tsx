// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { StepTrack } from '../internal/components/step-track';
import { InternalStatusIndicator } from '../status-indicator/internal';
import { resolveState } from '../status-indicator/legacy';
import { StepsProps } from './interfaces';

import styles from './styles.css.js';

export function InternalSteps({ steps, orientation = 'vertical', ariaLabel, ariaLabelledby, ...rest }: StepsProps) {
  return (
    <div {...rest} className={styles.root}>
      <StepTrack
        orientation={orientation}
        markerSize="icon"
        line="construction"
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        items={steps.map((step, index) => {
          const state = resolveState('Steps', step.status) ?? 'queued';
          return {
            key: String(index),
            upcoming: state === 'waiting' || state === 'queued',
            itemProps: { className: styles.step },
            // The header keeps the ink color; only the icon takes the status color. The reference numbers the
            // step as Wizard does, so a step can be pointed at in words.
            head: (
              <InternalStatusIndicator state={state} iconAriaLabel={step.statusIconAriaLabel}>
                <span className={styles.reference}>S{index + 1}</span>{' '}
                <span className={styles.header}>{step.header}</span>
              </InternalStatusIndicator>
            ),
            details: step.details ? <div className={styles.details}>{step.details}</div> : undefined,
          };
        })}
      />
    </div>
  );
}
