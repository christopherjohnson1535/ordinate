// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { StepTrack } from '../internal/components/step-track';
import { InternalStatusIndicator } from '../status-indicator/internal';
import { StepsProps } from './interfaces';

import styles from './styles.css.js';

export function InternalSteps({ steps, orientation = 'vertical', ariaLabel, ariaLabelledby, ...rest }: StepsProps) {
  return (
    <div {...rest} className={styles.root}>
      <StepTrack
        orientation={orientation}
        markerSize="icon"
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        items={steps.map((step, index) => ({
          key: String(index),
          upcoming: step.status === 'pending',
          itemProps: { className: styles.step },
          // The header keeps the ink color; only the icon takes the status color.
          head: (
            <InternalStatusIndicator type={step.status} iconAriaLabel={step.statusIconAriaLabel}>
              <span className={styles.header}>{step.header}</span>
            </InternalStatusIndicator>
          ),
          details: step.details ? <div className={styles.details}>{step.details}</div> : undefined,
        }))}
      />
    </div>
  );
}
