// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';
import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';
import ColumnLayout from '@ordinate/components/column-layout';

// Eight series, so every color and every pattern, dash and marker shows once.
const names = ['Drafting', 'Survey', 'Fabrication', 'Inspection', 'Archive', 'Model shop', 'Logistics', 'Studio'];
const quarters = ['Q1', 'Q2', 'Q3'];

const value = (series: number, position: number) => 30 + ((series * 17 + position * 23) % 50);

const bars: BarChartProps.SeriesSpec<string>[] = names.map((title, series) => ({
  title,
  type: 'bar',
  data: quarters.map((x, position) => ({ x, y: value(series, position) })),
}));

const lines: LineChartProps.SeriesSpec<string>[] = names.map((title, series) => ({
  title,
  type: 'line',
  data: quarters.map((x, position) => ({ x, y: value(series, position) + series * 12 })),
}));

export default function Patterns() {
  return (
    <ColumnLayout columns={2}>
      <BarChart
        series={bars}
        hideFilter={true}
        height={200}
        legendTitle="Fill"
        ariaLabel="Eight bar series, one for each color and fill pattern"
      />
      <LineChart
        series={lines}
        xScaleType="categorical"
        hideFilter={true}
        height={200}
        legendTitle="Line"
        ariaLabel="Eight line series, one for each color, dash and marker"
      />
    </ColumnLayout>
  );
}
