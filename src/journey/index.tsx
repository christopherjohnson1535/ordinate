// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { JourneyProps } from './interfaces';
import { InternalJourney } from './internal';

export type { JourneyProps };

export default function Journey({
  steps,
  activeStepIndex,
  onNavigate,
  onFinish,
  isLoading = false,
  finishButtonText,
  headingLevel = 2,
  i18nStrings,
  ...props
}: JourneyProps) {
  return (
    <InternalJourney
      {...getBaseProps(props)}
      steps={steps}
      activeStepIndex={activeStepIndex}
      onNavigate={onNavigate}
      onFinish={onFinish}
      isLoading={isLoading}
      finishButtonText={finishButtonText}
      headingLevel={headingLevel}
      i18nStrings={i18nStrings}
    />
  );
}
