// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { PieChartProps } from './interfaces';
import { InternalPieChart } from './internal';

export type { PieChartProps };

export default function PieChart<T extends PieChartProps.Datum = PieChartProps.Datum>({
  variant = 'pie',
  size = 'medium',
  statusType = 'finished',
  detailPopoverSize = 'medium',
  hideFilter = false,
  hideLegend = false,
  hideTitles = false,
  hideDescriptions = false,
  ...props
}: PieChartProps<T>) {
  return (
    <InternalPieChart<T>
      {...props}
      variant={variant}
      size={size}
      statusType={statusType}
      detailPopoverSize={detailPopoverSize}
      hideFilter={hideFilter}
      hideLegend={hideLegend}
      hideTitles={hideTitles}
      hideDescriptions={hideDescriptions}
    />
  );
}
