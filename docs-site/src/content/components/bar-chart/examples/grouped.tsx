// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';

const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

// Cloud spend by team, in thousands of dollars. Q4 is the forecast.
const teams: Array<[string, number[]]> = [
  ['Drafting', [42, 48, 51, 58]],
  ['Survey', [31, 29, 35, 38]],
  ['Fabrication', [55, 61, 49, 66]],
  ['Inspection', [18, 22, 26, 24]],
];

const thousands = (value: number) => `$${value}K`;

const series: BarChartProps.SeriesSpec<string>[] = [
  ...teams.map(([title, values]): BarChartProps.SeriesSpec<string> => ({
    title,
    type: 'bar',
    data: quarters.map((x, index) => ({ x, y: values[index] })),
    valueFormatter: thousands,
  })),
  { title: 'Budget per team', type: 'threshold', y: 60, valueFormatter: thousands },
];

export default function Grouped() {
  return (
    <BarChart
      series={series}
      xTitle="Quarter"
      yTitle="Spend (thousands of dollars)"
      yTickFormatter={thousands}
      legendTitle="Team"
      ariaLabel="Cloud spend by team and quarter, 2026"
      ariaDescription="Fabrication spends the most and passes the budget in Q2 and Q4. Inspection spends the least."
    />
  );
}
