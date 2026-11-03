// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';

const weeks = ['Week 40', 'Week 41', 'Week 42', 'Week 43', 'Week 44'];

// Incidents opened per week on the north-annex project, by severity.
const severities: Array<[string, number[]]> = [
  ['Critical', [1, 0, 2, 0, 1]],
  ['High', [4, 3, 6, 2, 3]],
  ['Medium', [9, 7, 11, 8, 6]],
  ['Low', [14, 12, 10, 15, 9]],
];

const series: BarChartProps.SeriesSpec<string>[] = severities.map(([title, values]) => ({
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
      yTitle="Incidents opened"
      legendTitle="Severity"
      hideFilter={true}
      height={240}
      ariaLabel="Incidents opened per week by severity, weeks 40 to 44 of 2026"
    />
  );
}
