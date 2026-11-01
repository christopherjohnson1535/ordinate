// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '~charts/bar-chart';
import Container from '~components/container';
import Header from '~components/header';

import { eightSeries, months, quarters, spendByTeam } from '../charts/data';
import { EmptyState, NoMatchState } from '../charts/states';

import styles from '../charts/styles.module.scss';

const currency = (value: number) => `$${value}K`;

const teamSeries: BarChartProps.SeriesSpec<string>[] = [
  ...spendByTeam.map((team): BarChartProps.SeriesSpec<string> => ({
    title: team.title,
    type: 'bar',
    data: quarters.map((quarter, index) => ({ x: quarter, y: team.values[index] })),
    valueFormatter: currency,
  })),
  { title: 'Budget per team', type: 'threshold', y: 60, valueFormatter: currency },
];

const eightBars: BarChartProps.SeriesSpec<string>[] = eightSeries.map(series => ({ ...series, type: 'bar' }));

const siteSeries: BarChartProps.SeriesSpec<string>[] = [
  {
    title: 'Open findings',
    type: 'bar',
    data: [
      { x: 'North annex reading room', y: 14 },
      { x: 'Survey office', y: 9 },
      { x: 'Fabrication hall, east bay', y: 22 },
      { x: 'Archive', y: 4 },
      { x: 'Model shop', y: 7 },
    ],
  },
  {
    title: 'Closed this month',
    type: 'bar',
    data: [
      { x: 'North annex reading room', y: 6 },
      { x: 'Survey office', y: 12 },
      { x: 'Fabrication hall, east bay', y: 10 },
      { x: 'Archive', y: 3 },
      { x: 'Model shop', y: 8 },
    ],
  },
];

const varianceSeries: BarChartProps.SeriesSpec<string>[] = [
  {
    title: 'Variance against plan',
    type: 'bar',
    data: months.slice(0, 8).map((month, index) => ({ x: month, y: [12, -8, 5, -14, 9, 3, -4, 16][index] })),
    valueFormatter: value => `${value > 0 ? '+' : ''}${value}%`,
  },
];

export default function BarChartPermutations() {
  return (
    <article className={styles.page}>
      <h1>Bar chart</h1>

      <Container header={<Header variant="h2">Spend by team, grouped</Header>}>
        <BarChart
          series={teamSeries}
          xTitle="Quarter"
          yTitle="Spend (thousands)"
          yTickFormatter={currency}
          legendTitle="Team"
          ariaLabel="Spend by team and quarter"
          empty={<EmptyState />}
          noMatch={<NoMatchState />}
        />
      </Container>

      <Container header={<Header variant="h2">Spend by team, stacked</Header>}>
        <BarChart
          series={teamSeries.slice(0, 4)}
          stackedBars={true}
          xTitle="Quarter"
          yTitle="Spend (thousands)"
          yTickFormatter={currency}
          hideFilter={true}
          height={260}
          ariaLabel="Spend by quarter, stacked by team"
        />
      </Container>

      <Container header={<Header variant="h2">Horizontal, long category names</Header>}>
        <BarChart
          series={siteSeries}
          horizontalBars={true}
          xTitle="Site"
          yTitle="Findings"
          hideFilter={true}
          height={260}
          ariaLabel="Findings by site"
        />
      </Container>

      <Container header={<Header variant="h2">Horizontal and stacked</Header>}>
        <BarChart
          series={siteSeries}
          horizontalBars={true}
          stackedBars={true}
          hideFilter={true}
          height={200}
          ariaLabel="Findings by site, stacked"
        />
      </Container>

      <Container header={<Header variant="h2">Eight series, every pattern</Header>}>
        <BarChart series={eightBars} hideFilter={true} height={260} ariaLabel="Eight series" />
      </Container>

      <div className={styles.grid}>
        <Container header={<Header variant="h2">Negative values</Header>}>
          <BarChart
            series={varianceSeries}
            hideFilter={true}
            hideLegend={true}
            yTickFormatter={value => `${value}%`}
            height={200}
            ariaLabel="Variance against plan by month"
          />
        </Container>
        <Container header={<Header variant="h2">Loading</Header>}>
          <BarChart series={[]} statusType="loading" loadingText="Loading spend" height={200} />
        </Container>
      </div>
    </article>
  );
}
