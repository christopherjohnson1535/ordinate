// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';

const days = Array.from({ length: 14 }, (_, index) => new Date(2026, 9, 19 + index));

// Free disk space per node over two weeks; node-3 is filling up.
function freeSpace(start: number, perDay: number) {
  return days.map((x, index) => ({ x, y: Math.round(start - perDay * index + Math.sin(index * 2.1) * 3) }));
}

const percent = (value: number) => `${value}%`;
const day = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const series: LineChartProps.SeriesSpec<Date>[] = [
  { title: 'node-1', type: 'line', data: freeSpace(72, 0.4), valueFormatter: percent },
  { title: 'node-2', type: 'line', data: freeSpace(64, 0.6), valueFormatter: percent },
  { title: 'node-3', type: 'line', data: freeSpace(58, 3.1), valueFormatter: percent },
  { title: 'node-4', type: 'line', data: freeSpace(81, 0.2), valueFormatter: percent },
  { title: 'Alarm at 20% free', type: 'threshold', y: 20, valueFormatter: percent },
];

export default function ControlledFilter() {
  const [visible, setVisible] = useState<ReadonlyArray<LineChartProps.SeriesSpec<Date>>>(series);
  const [highlighted, setHighlighted] = useState<LineChartProps.SeriesSpec<Date> | null>(series[2]);

  return (
    <SpaceBetween size="s">
      <LineChart
        series={series}
        visibleSeries={visible}
        onFilterChange={event => setVisible(event.detail.visibleSeries)}
        highlightedSeries={highlighted}
        onHighlightChange={event => setHighlighted(event.detail.highlightedSeries)}
        xScaleType="time"
        yDomain={[0, 100]}
        xTickFormatter={day}
        yTickFormatter={percent}
        yTitle="Free disk space"
        legendTitle="Node"
        height={240}
        ariaLabel="Free disk space per node, 19 October to 1 November 2026"
        noMatch={
          <Box textAlign="center" color="text-body-secondary">
            Choose at least one node in the filter.
          </Box>
        }
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Showing {visible.length} of {series.length} series. Highlighted: {highlighted?.title ?? 'none'}.
      </Box>
    </SpaceBetween>
  );
}
