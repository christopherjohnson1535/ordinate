// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '~charts/bar-chart';

import { quarters, spendByTeam } from '../../charts/data';
import { Cell, Group } from './specimen';

const currency = (value: number) => `$${value}K`;

const series: BarChartProps.SeriesSpec<string>[] = spendByTeam.slice(0, 2).map(team => ({
  title: team.title,
  type: 'bar',
  data: quarters.map((quarter, index) => ({ x: quarter, y: team.values[index] })),
  valueFormatter: currency,
}));

export default function ChartsGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Charts, from @ordinate-ui/charts">
      <Cell name="BarChart" wide={true} note="One chart stands for the package; the chart pages show the rest.">
        <BarChart
          series={series}
          height={220}
          xTitle="Quarter"
          yTitle="Spend (thousands)"
          yTickFormatter={currency}
          legendTitle="Team"
          ariaLabel="Spend by team and quarter"
        />
      </Cell>
    </Group>
  );
}
