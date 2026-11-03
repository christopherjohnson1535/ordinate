// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';
import Button from '@ordinate/components/button';

// p95 latency every five minutes from 09:00 to 15:00. The deploy at 10:10 raises it for a while.
const start = new Date(2026, 9, 30, 9, 0).getTime();
const fiveMinutes = 5 * 60 * 1000;
const deployedAt = new Date(start + 14 * fiveMinutes);

const latency = Array.from({ length: 73 }, (_, index) => {
  const sinceDeploy = index - 14;
  const bump = sinceDeploy >= 0 ? 140 * Math.exp(-sinceDeploy / 9) : 0;
  const noise = Math.sin(index * 7.31) * 18;
  return { x: new Date(start + index * fiveMinutes), y: Math.round(165 + bump + noise) };
});

const ms = (value: number) => `${value} ms`;
const time = (date: Date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const series: LineChartProps.SeriesSpec<Date>[] = [
  { title: 'p95 latency, checkout-api', type: 'line', data: latency, valueFormatter: ms },
  { title: 'Latency budget', type: 'threshold', y: 250, valueFormatter: ms },
  { title: 'Deploy 2026.10.30-3', type: 'threshold', x: deployedAt },
];

export default function Thresholds() {
  return (
    <LineChart
      series={series}
      xScaleType="time"
      yDomain={[0, 400]}
      xTitle="Time (local)"
      yTitle="Latency"
      xTickFormatter={time}
      yTickFormatter={ms}
      hideFilter={true}
      height={240}
      detailPopoverFooter={() => (
        <Button variant="link" href="#/components/line-chart">
          Open the trace view
        </Button>
      )}
      ariaLabel="p95 latency of checkout-api"
      ariaDescription="Latency stays near 165 ms, passes the 250 ms budget after the deploy at 10:10 and settles again within an hour."
    />
  );
}
