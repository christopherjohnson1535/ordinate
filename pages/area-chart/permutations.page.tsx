// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AreaChart, { AreaChartProps } from '~charts/area-chart';
import Container from '~components/container';

import { eightSeries, hourFormatter, months, numberFormatter, requests } from '../charts/data';
import { EmptyState, NoMatchState } from '../charts/states';

import styles from '../charts/styles.module.scss';

const buildingSeries: AreaChartProps.SeriesSpec<Date>[] = [
  { title: 'North annex', type: 'area', data: requests.north, valueFormatter: numberFormatter },
  { title: 'South annex', type: 'area', data: requests.south, valueFormatter: numberFormatter },
  { title: 'East wing', type: 'area', data: requests.east, valueFormatter: numberFormatter },
  { title: 'West wing', type: 'area', data: requests.west, valueFormatter: numberFormatter },
  { title: 'Site capacity', type: 'threshold', y: 2400, valueFormatter: numberFormatter },
];

const eightAreas: AreaChartProps.SeriesSpec<string>[] = eightSeries.map(series => ({ ...series, type: 'area' }));

export default function AreaChartPermutations() {
  return (
    <article className={styles.page}>
      <h1>Area chart</h1>

      <Container heading="Requests per minute, stacked by building">
        <AreaChart
          series={buildingSeries}
          xScaleType="time"
          xTitle="Time"
          yTitle="Requests per minute"
          xTickFormatter={hourFormatter}
          yTickFormatter={numberFormatter}
          legendTitle="Building"
          ariaLabel="Requests per minute, stacked by building"
          empty={<EmptyState />}
          noMatch={<NoMatchState />}
        />
      </Container>

      <Container heading="Eight series, every pattern">
        <AreaChart
          series={eightAreas}
          xScaleType="categorical"
          xDomain={months.slice(0, 6)}
          yTitle="Index"
          hideFilter={true}
          height={280}
          ariaLabel="Eight stacked series"
        />
      </Container>

      <div className={styles.grid}>
        <Container heading="Two series, no filter or legend">
          <AreaChart
            series={buildingSeries.slice(2, 4)}
            xScaleType="time"
            xTickFormatter={hourFormatter}
            hideFilter={true}
            hideLegend={true}
            height={180}
            ariaLabel="Two buildings"
          />
        </Container>
        <Container heading="Loading">
          <AreaChart series={[]} statusType="loading" loadingText="Loading requests" height={180} />
        </Container>
        <Container heading="Error">
          <AreaChart
            series={[]}
            statusType="error"
            errorText="The requests could not be loaded."
            recoveryText="Retry"
            height={180}
          />
        </Container>
        <Container heading="Empty">
          <AreaChart series={[]} empty={<EmptyState />} height={180} />
        </Container>
      </div>
    </article>
  );
}
