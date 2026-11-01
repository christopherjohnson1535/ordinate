// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { ProgressBarProps } from './interfaces';
import { InternalProgressBar } from './internal';

export type { ProgressBarProps };

export default function ProgressBar({
  value = 0,
  label,
  description,
  additionalInfo,
  status = 'in-progress',
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
      status={status}
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
