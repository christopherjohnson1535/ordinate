// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { BarChartProps } from './interfaces';
import { InternalBarChart } from './internal';

export type { BarChartProps };

export default function BarChart<T extends BarChartProps.DataTypes>({
  xScaleType = 'categorical',
  yScaleType = 'linear',
  height = 300,
  statusType = 'finished',
  detailPopoverSize = 'medium',
  hideFilter = false,
  hideLegend = false,
  stackedBars = false,
  horizontalBars = false,
  ...props
}: BarChartProps<T>) {
  return (
    <InternalBarChart<T>
      {...props}
      xScaleType={xScaleType}
      yScaleType={yScaleType}
      height={height}
      statusType={statusType}
      detailPopoverSize={detailPopoverSize}
      hideFilter={hideFilter}
      hideLegend={hideLegend}
      stackedBars={stackedBars}
      horizontalBars={horizontalBars}
    />
  );
}
