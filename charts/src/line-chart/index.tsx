// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { LineChartProps } from './interfaces';
import { InternalLineChart } from './internal';

export type { LineChartProps };

export default function LineChart<T extends LineChartProps.DataTypes>({
  xScaleType = 'linear',
  yScaleType = 'linear',
  height = 300,
  statusType = 'finished',
  detailPopoverSize = 'medium',
  hideFilter = false,
  hideLegend = false,
  ...props
}: LineChartProps<T>) {
  return (
    <InternalLineChart<T>
      {...props}
      xScaleType={xScaleType}
      yScaleType={yScaleType}
      height={height}
      statusType={statusType}
      detailPopoverSize={detailPopoverSize}
      hideFilter={hideFilter}
      hideLegend={hideLegend}
    />
  );
}
