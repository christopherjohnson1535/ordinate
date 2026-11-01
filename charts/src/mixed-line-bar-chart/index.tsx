// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { MixedLineBarChartProps } from './interfaces';
import { InternalMixedLineBarChart } from './internal';

export type { MixedLineBarChartProps };

export default function MixedLineBarChart<T extends MixedLineBarChartProps.DataTypes>({
  xScaleType = 'categorical',
  yScaleType = 'linear',
  height = 300,
  statusType = 'finished',
  detailPopoverSize = 'medium',
  hideFilter = false,
  hideLegend = false,
  stackedBars = false,
  ...props
}: MixedLineBarChartProps<T>) {
  return (
    <InternalMixedLineBarChart<T>
      {...props}
      xScaleType={xScaleType}
      yScaleType={yScaleType}
      height={height}
      statusType={statusType}
      detailPopoverSize={detailPopoverSize}
      hideFilter={hideFilter}
      hideLegend={hideLegend}
      stackedBars={stackedBars}
    />
  );
}
