// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { OpeningHoursProps } from './interfaces';
import { InternalOpeningHours } from './internal';

export type { OpeningHoursProps };

export default function OpeningHours({
  days,
  rows,
  highlightToday = false,
  caption,
  closedText,
  todayText,
  timeFormat,
  locale,
  variant = 'default',
  ...props
}: OpeningHoursProps) {
  return (
    <InternalOpeningHours
      {...getBaseProps(props)}
      days={days}
      rows={rows}
      highlightToday={highlightToday}
      caption={caption}
      closedText={closedText}
      todayText={todayText}
      timeFormat={timeFormat}
      locale={locale}
      variant={variant}
    />
  );
}
