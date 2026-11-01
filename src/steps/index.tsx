// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { StepsProps } from './interfaces';
import { InternalSteps } from './internal';

export type { StepsProps };

export default function Steps({ steps, orientation = 'vertical', ariaLabel, ariaLabelledby, ...props }: StepsProps) {
  return (
    <InternalSteps
      {...getBaseProps(props)}
      steps={steps}
      orientation={orientation}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
    />
  );
}
