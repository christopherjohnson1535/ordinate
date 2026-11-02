// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import LineChart, { LineChartProps } from '~charts/line-chart';
import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';

import { eightSeries, hourFormatter, latency, months, numberFormatter, requests } from '../charts/data';
import { EmptyState, NoMatchState } from '../charts/states';

import styles from '../charts/styles.module.scss';

const requestSeries: LineChartProps.SeriesSpec<Date>[] = [
  { title: 'North annex', type: 'line', data: requests.north, valueFormatter: numberFormatter },
  { title: 'South annex', type: 'line', data: requests.south, valueFormatter: numberFormatter },
  { title: 'East wing', type: 'line', data: requests.east, valueFormatter: numberFormatter },
  { title: 'Capacity', type: 'threshold', y: 1200, valueFormatter: numberFormatter },
];

const eightLines: LineChartProps.SeriesSpec<string>[] = eightSeries.map(series => ({ ...series, type: 'line' }));

const latencySeries: LineChartProps.SeriesSpec<number>[] = [
  { title: 'p95 latency', type: 'line', data: latency, valueFormatter: value => `${value} ms` },
  { title: 'Budget', type: 'threshold', y: 60, valueFormatter: value => `${value} ms` },
];

export default function LineChartPermutations() {
  const [visibleSeries, setVisibleSeries] = useState<ReadonlyArray<LineChartProps.SeriesSpec<Date>>>(requestSeries);
  const [highlighted, setHighlighted] = useState<LineChartProps.SeriesSpec<Date> | null>(null);

  return (
    <article className={styles.page}>
      <h1>Line chart</h1>

      <Container heading="Requests per minute">
        <LineChart
          series={requestSeries}
          xScaleType="time"
          xTitle="Time"
          yTitle="Requests per minute"
          xTickFormatter={hourFormatter}
          yTickFormatter={numberFormatter}
          legendTitle="Building"
          ariaLabel="Requests per minute by building"
          ariaDescription="Requests rise through the morning, peak in the early afternoon and fall overnight."
          detailPopoverFooter={() => <Button variant="link">View log</Button>}
          empty={<EmptyState />}
          noMatch={<NoMatchState />}
        />
      </Container>

      <Container heading="Controlled filter and highlight">
        <div className={styles.stack}>
          <Box color="text-body-secondary" fontSize="body-s">
            Visible: {visibleSeries.map(series => series.title).join(', ') || 'none'} · Highlighted:{' '}
            {highlighted?.title ?? 'none'}
          </Box>
          <LineChart
            series={requestSeries}
            visibleSeries={visibleSeries}
            onFilterChange={event => setVisibleSeries(event.detail.visibleSeries)}
            highlightedSeries={highlighted}
            onHighlightChange={event => setHighlighted(event.detail.highlightedSeries)}
            xScaleType="time"
            xTickFormatter={hourFormatter}
            height={220}
            ariaLabel="Requests, controlled"
            noMatch={<NoMatchState />}
          />
        </div>
      </Container>

      <Container heading="Eight series on a categorical axis">
        <LineChart
          series={eightLines}
          xScaleType="categorical"
          xDomain={months.slice(0, 6)}
          yTitle="Index"
          hideFilter={true}
          height={260}
          ariaLabel="Eight series"
        />
      </Container>

      <div className={styles.grid}>
        <Container heading="Log x axis">
          <LineChart
            series={latencySeries}
            xScaleType="log"
            xTitle="Payload (KB)"
            yTitle="Latency"
            hideFilter={true}
            height={200}
            ariaLabel="Latency by payload size"
          />
        </Container>
        <Container heading="Narrow">
          <div className={styles.narrow}>
            <LineChart
              series={requestSeries.slice(0, 2)}
              xScaleType="time"
              xTickFormatter={hourFormatter}
              hideFilter={true}
              height={180}
              ariaLabel="Requests, narrow"
            />
          </div>
        </Container>
      </div>

      <div className={styles.grid}>
        <Container heading="Loading">
          <LineChart series={[]} statusType="loading" loadingText="Loading requests" height={160} />
        </Container>
        <Container heading="Error">
          <LineChart
            series={[]}
            statusType="error"
            errorText="The requests could not be loaded."
            recoveryText="Retry"
            height={160}
          />
        </Container>
        <Container heading="Empty">
          <LineChart series={[]} empty={<EmptyState />} height={160} />
        </Container>
        <Container heading="No match">
          <LineChart series={requestSeries} visibleSeries={[]} noMatch={<NoMatchState />} height={160} />
        </Container>
      </div>
    </article>
  );
}
