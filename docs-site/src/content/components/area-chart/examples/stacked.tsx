// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AreaChart, { AreaChartProps } from '@ordinate/charts/area-chart';

// Power drawn by each building every hour on 30 October 2026, in kilowatts.
function load(base: number, swing: number, seed: number) {
  const start = new Date(2026, 9, 30).getTime();
  return Array.from({ length: 25 }, (_, hour) => {
    const working = Math.max(0, Math.sin(((hour - 6) / 14) * Math.PI));
    const noise = Math.sin(hour * 3.7 + seed) * base * 0.05;
    return { x: new Date(start + hour * 60 * 60 * 1000), y: Math.round(base + swing * working + noise) };
  });
}

const kw = (value: number) => `${new Intl.NumberFormat('en').format(value)} kW`;
const time = (date: Date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const series: AreaChartProps.SeriesSpec<Date>[] = [
  { title: 'North annex', type: 'area', data: load(180, 420, 1), valueFormatter: kw },
  { title: 'South annex', type: 'area', data: load(120, 260, 2), valueFormatter: kw },
  { title: 'East wing', type: 'area', data: load(90, 150, 3), valueFormatter: kw },
  { title: 'Plant room', type: 'area', data: load(140, 40, 4), valueFormatter: kw },
  { title: 'Supply limit', type: 'threshold', y: 1100, valueFormatter: kw },
];

export default function Stacked() {
  return (
    <AreaChart
      series={series}
      xScaleType="time"
      xTitle="Time, 30 October 2026"
      yTitle="Power drawn (kW)"
      xTickFormatter={time}
      yTickFormatter={value => new Intl.NumberFormat('en').format(value)}
      legendTitle="Building"
      ariaLabel="Power drawn by building, stacked, 30 October 2026"
      ariaDescription="The site draws about 530 kW overnight and peaks near 1,400 kW at 13:00, above the supply limit from about 09:00 to 17:00. The north annex draws the most."
    />
  );
}
