// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { warnOnce } from '../internal/logging';
import { ChecklistWizard } from './checklist';
import { WizardProps } from './interfaces';
import { StepsWizard } from './steps';

export function InternalWizard({ variant = 'checklist', aside, allowSkipTo, kind, reference, ...props }: WizardProps) {
  if (props.steps.length === 0) {
    warnOnce('Wizard', 'The wizard needs at least one step.');
    return null;
  }
  return variant === 'steps' ? (
    <StepsWizard {...props} allowSkipTo={allowSkipTo} kind={kind} reference={reference} />
  ) : (
    <ChecklistWizard {...props} aside={aside} />
  );
}
