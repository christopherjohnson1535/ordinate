// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { HowItWorksProps } from './interfaces';
import { InternalHowItWorks } from './internal';

export type { HowItWorksProps };

export default function HowItWorks({
  steps,
  headingLevel = 3,
  orientation = 'horizontal',
  ariaLabel,
  ...props
}: HowItWorksProps) {
  return (
    <InternalHowItWorks
      {...getBaseProps(props)}
      steps={steps}
      headingLevel={headingLevel}
      orientation={orientation}
      ariaLabel={ariaLabel}
    />
  );
}
