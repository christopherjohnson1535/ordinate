// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { WizardProps } from './interfaces';
import { InternalWizard } from './internal';

export type { WizardProps };

export default function Wizard({
  steps,
  activeStepIndex,
  onNavigate,
  onSubmit,
  onCancel,
  isLoadingNextStep = false,
  allowSkipTo = false,
  submitButtonText,
  secondaryActions,
  i18nStrings,
  ...props
}: WizardProps) {
  return (
    <InternalWizard
      {...getBaseProps(props)}
      steps={steps}
      activeStepIndex={activeStepIndex}
      onNavigate={onNavigate}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoadingNextStep={isLoadingNextStep}
      allowSkipTo={allowSkipTo}
      submitButtonText={submitButtonText}
      secondaryActions={secondaryActions}
      i18nStrings={i18nStrings}
    />
  );
}
