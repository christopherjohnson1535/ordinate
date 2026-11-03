// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import MixedLineBarChart, { MixedLineBarChartProps } from '@ordinate/charts/mixed-line-bar-chart';

const days = ['Mon 26', 'Tue 27', 'Wed 28', 'Thu 29', 'Fri 30', 'Sat 31', 'Sun 1'];

// Support tickets closed per day by channel, and the tickets still open at the end of each day.
const email = [34, 41, 38, 29, 44, 12, 9];
const chat = [22, 27, 31, 25, 30, 8, 6];
const phone = [11, 9, 14, 12, 10, 3, 2];
const open = [58, 52, 47, 49, 41, 46, 50];

const series: MixedLineBarChartProps.SeriesSpec<string>[] = [
  { title: 'Closed by email', type: 'bar', data: days.map((x, index) => ({ x, y: email[index] })) },
  { title: 'Closed in chat', type: 'bar', data: days.map((x, index) => ({ x, y: chat[index] })) },
  { title: 'Closed by phone', type: 'bar', data: days.map((x, index) => ({ x, y: phone[index] })) },
  { title: 'Still open', type: 'line', data: days.map((x, index) => ({ x, y: open[index] })) },
];

export default function Stacked() {
  return (
    <MixedLineBarChart
      series={series}
      stackedBars={true}
      xTitle="Day, 26 October to 1 November 2026"
      yTitle="Tickets"
      hideFilter={true}
      height={240}
      ariaLabel="Support tickets closed per day by channel, and tickets still open"
    />
  );
}
