// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { AreaChartProps } from './interfaces';
import { InternalAreaChart } from './internal';

export type { AreaChartProps };

export default function AreaChart<T extends AreaChartProps.DataTypes>({
  xScaleType = 'linear',
  yScaleType = 'linear',
  height = 300,
  statusType = 'finished',
  detailPopoverSize = 'medium',
  hideFilter = false,
  hideLegend = false,
  ...props
}: AreaChartProps<T>) {
  return (
    <InternalAreaChart<T>
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
