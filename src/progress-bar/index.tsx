// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '../internal/logging';
import { ProgressBarProps } from './interfaces';
import { InternalProgressBar } from './internal';

export type { ProgressBarProps };

const legacyStatuses: Record<ProgressBarProps.LegacyStatus, ProgressBarProps.Status> = {
  'in-progress': 'underway',
  success: 'complete',
  error: 'fault',
};

function resolveStatus(status: ProgressBarProps.Status | ProgressBarProps.LegacyStatus): ProgressBarProps.Status {
  if (Object.prototype.hasOwnProperty.call(legacyStatuses, status)) {
    const current = legacyStatuses[status as ProgressBarProps.LegacyStatus];
    warnOnce(
      'ProgressBar',
      `The status "${status}" is now called "${current}". The old name stops working in the next major version.`
    );
    return current;
  }
  return status as ProgressBarProps.Status;
}

export default function ProgressBar({
  value = 0,
  label,
  description,
  additionalInfo,
  status = 'underway',
  resultText,
  resultButtonText,
  onResultButtonClick,
  variant = 'standalone',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ...props
}: ProgressBarProps) {
  return (
    <InternalProgressBar
      {...getBaseProps(props)}
      value={value}
      label={label}
      description={description}
      additionalInfo={additionalInfo}
      status={resolveStatus(status)}
      resultText={resultText}
      resultButtonText={resultButtonText}
      onResultButtonClick={onResultButtonClick}
      variant={variant}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    />
  );
}
