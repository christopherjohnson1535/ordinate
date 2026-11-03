// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';

const weeks = ['Week 40', 'Week 41', 'Week 42', 'Week 43', 'Week 44'];

// Drawings issued per week on the north-annex project, by discipline.
const disciplines: Array<[string, number[]]> = [
  ['Architectural', [14, 12, 18, 15, 11]],
  ['Structural', [9, 7, 11, 8, 6]],
  ['Mechanical', [5, 6, 4, 9, 7]],
  ['Electrical', [3, 4, 6, 5, 8]],
];

const series: BarChartProps.SeriesSpec<string>[] = disciplines.map(([title, values]) => ({
  title,
  type: 'bar',
  data: weeks.map((x, index) => ({ x, y: values[index] })),
}));

export default function Stacked() {
  return (
    <BarChart
      series={series}
      stackedBars={true}
      xTitle="Week of 2026"
      yTitle="Drawings issued"
      legendTitle="Discipline"
      hideFilter={true}
      height={240}
      ariaLabel="Drawings issued per week by discipline, weeks 40 to 44 of 2026"
    />
  );
}
