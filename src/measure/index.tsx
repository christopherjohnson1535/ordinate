// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { MeasureProps } from './interfaces';
import { InternalMeasure } from './internal';

export type { MeasureProps };

export default function Measure({
  label,
  value,
  unit,
  description,
  max,
  current,
  limit,
  limitLabel,
  format,
  i18nStrings,
  ...props
}: MeasureProps) {
  return (
    <InternalMeasure
      {...getBaseProps(props)}
      label={label}
      value={value}
      unit={unit}
      description={description}
      max={max}
      current={current}
      limit={limit}
      limitLabel={limitLabel}
      format={format}
      i18nStrings={i18nStrings}
    />
  );
}
