// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import MixedLineBarChart, { MixedLineBarChartProps } from '@ordinate/charts/mixed-line-bar-chart';

const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

// Drawings issued and revised each month on the north-annex project.
const issued = [42, 38, 51, 47, 60, 58, 64, 70, 66, 74, 69, 81];
const revised = [12, 15, 9, 14, 18, 11, 16, 20, 17, 13, 19, 22];

// The average of the current and the two months before it.
const average = issued.map((_, index) => {
  const window = issued.slice(Math.max(0, index - 2), index + 1);
  return Math.round(window.reduce((sum, value) => sum + value, 0) / window.length);
});

const series: MixedLineBarChartProps.SeriesSpec<string>[] = [
  { title: 'Drawings issued', type: 'bar', data: months.map((x, index) => ({ x, y: issued[index] })) },
  { title: 'Drawings revised', type: 'bar', data: months.map((x, index) => ({ x, y: revised[index] })) },
  { title: 'Issued, 3-month average', type: 'line', data: months.map((x, index) => ({ x, y: average[index] })) },
  { title: 'Monthly target', type: 'threshold', y: 65 },
];

export default function BarsAndTrend() {
  return (
    <MixedLineBarChart
      series={series}
      xTitle="Month, November 2025 to October 2026"
      yTitle="Drawings"
      legendTitle="Measure"
      ariaLabel="Drawings issued and revised per month, north-annex project"
      ariaDescription="Drawings issued rise from 42 in November to 81 in October. The 3-month average reached the target of 65 in June."
    />
  );
}
