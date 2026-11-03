// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AreaChart, { AreaChartProps } from '@ordinate/charts/area-chart';

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

// Storage used by each kind of record in the north-annex archive, in terabytes.
const kinds: Array<[string, number[]]> = [
  ['Drawings', [41, 43, 46, 48, 51, 55]],
  ['Photographs', [28, 30, 31, 35, 36, 38]],
  ['Survey data', [17, 18, 22, 23, 25, 28]],
  ['Models', [12, 12, 13, 15, 18, 19]],
  ['Correspondence', [9, 9, 10, 10, 11, 11]],
  ['Contracts', [6, 6, 7, 7, 7, 8]],
  ['Site video', [3, 5, 8, 9, 12, 14]],
  ['Other', [4, 4, 4, 5, 5, 5]],
];

const series: AreaChartProps.SeriesSpec<string>[] = kinds.map(([title, values]) => ({
  title,
  type: 'area',
  data: months.map((x, index) => ({ x, y: values[index] })),
  valueFormatter: value => `${value} TB`,
}));

export default function Patterns() {
  return (
    <AreaChart
      series={series}
      xScaleType="categorical"
      xDomain={months}
      yTitle="Storage used (TB)"
      hideFilter={true}
      height={260}
      ariaLabel="Storage used by kind of record, May to October 2026"
    />
  );
}
