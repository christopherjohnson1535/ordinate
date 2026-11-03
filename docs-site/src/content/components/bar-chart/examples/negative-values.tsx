// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';

const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const variance = [12, -8, 5, -14, 9, 3, -4, 16];

const signed = (value: number) => `${value > 0 ? '+' : ''}${value}%`;

const series: BarChartProps.SeriesSpec<string>[] = [
  {
    title: 'Hours against plan',
    type: 'bar',
    data: months.map((x, index) => ({ x, y: variance[index] })),
    valueFormatter: signed,
  },
];

export default function NegativeValues() {
  return (
    <BarChart
      series={series}
      yDomain={[-20, 20]}
      yTickFormatter={signed}
      yTitle="Hours against plan"
      hideFilter={true}
      hideLegend={true}
      height={220}
      ariaLabel="Drafting hours against plan by month, March to October 2026"
      ariaDescription="Hours ran over plan in five months and under in three. June was furthest under, at 14%; October furthest over, at 16%."
    />
  );
}
