// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';

// Requests per minute every half hour on 30 October 2026, with a little noise on a daily curve.
function requestsPerMinute(base: number, swing: number, seed: number) {
  const start = new Date(2026, 9, 30).getTime();
  return Array.from({ length: 49 }, (_, index) => {
    const hour = index / 2;
    const curve = Math.sin(((hour - 8) / 24) * 2 * Math.PI);
    const noise = Math.sin(index * 12.9898 + seed) * 0.08;
    return { x: new Date(start + index * 30 * 60 * 1000), y: Math.round(base + swing * curve + base * noise) };
  });
}

const count = (value: number) => new Intl.NumberFormat('en').format(value);
const time = (date: Date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const series: LineChartProps.SeriesSpec<Date>[] = [
  { title: 'North annex', type: 'line', data: requestsPerMinute(820, 360, 1), valueFormatter: count },
  { title: 'South annex', type: 'line', data: requestsPerMinute(560, 240, 2), valueFormatter: count },
  { title: 'East wing', type: 'line', data: requestsPerMinute(340, 140, 3), valueFormatter: count },
  { title: 'Capacity', type: 'threshold', y: 1200, valueFormatter: count },
];

export default function TimeSeries() {
  return (
    <LineChart
      series={series}
      xScaleType="time"
      xTitle="Time, 30 October 2026"
      yTitle="Requests per minute"
      xTickFormatter={time}
      yTickFormatter={count}
      legendTitle="Building"
      ariaLabel="Requests per minute by building, 30 October 2026"
      ariaDescription="Requests rise through the morning, peak in the early afternoon and fall overnight. The north annex comes closest to capacity."
    />
  );
}
