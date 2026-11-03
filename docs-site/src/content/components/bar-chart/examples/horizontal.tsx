// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';

const sites = [
  'North annex reading room',
  'Survey office',
  'Fabrication hall, east bay',
  'Archive, lower ground floor',
  'Model shop',
];

const series: BarChartProps.SeriesSpec<string>[] = [
  {
    title: 'Open findings',
    type: 'bar',
    data: sites.map((x, index) => ({ x, y: [14, 9, 22, 4, 7][index] })),
  },
  {
    title: 'Closed in October',
    type: 'bar',
    data: sites.map((x, index) => ({ x, y: [6, 12, 10, 3, 8][index] })),
  },
];

export default function Horizontal() {
  return (
    <BarChart
      series={series}
      horizontalBars={true}
      xTitle="Site"
      yTitle="Inspection findings"
      hideFilter={true}
      height={280}
      ariaLabel="Inspection findings by site, October 2026"
    />
  );
}
