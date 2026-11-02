// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import MixedLineBarChart, { MixedLineBarChartProps } from '~charts/mixed-line-bar-chart';
import Container from '~components/container';

import { months } from '../charts/data';
import { EmptyState, NoMatchState } from '../charts/states';

import styles from '../charts/styles.module.scss';

const issued = [42, 38, 51, 47, 60, 58, 64, 70, 66, 74, 69, 81];
const revised = [12, 15, 9, 14, 18, 11, 16, 20, 17, 13, 19, 22];
const average = issued.map((_, index) => {
  const window = issued.slice(Math.max(0, index - 2), index + 1);
  return Math.round(window.reduce((sum, value) => sum + value, 0) / window.length);
});

const drawingSeries: MixedLineBarChartProps.SeriesSpec<string>[] = [
  { title: 'Drawings issued', type: 'bar', data: months.map((x, index) => ({ x, y: issued[index] })) },
  { title: 'Drawings revised', type: 'bar', data: months.map((x, index) => ({ x, y: revised[index] })) },
  { title: 'Issued, 3-month average', type: 'line', data: months.map((x, index) => ({ x, y: average[index] })) },
  { title: 'Target', type: 'threshold', y: 65 },
];

export default function MixedLineBarChartPermutations() {
  return (
    <article className={styles.page}>
      <h1>Mixed line and bar chart</h1>

      <Container heading="Drawings per month">
        <MixedLineBarChart
          series={drawingSeries}
          xTitle="Month"
          yTitle="Drawings"
          legendTitle="Measure"
          ariaLabel="Drawings issued and revised per month"
          empty={<EmptyState />}
          noMatch={<NoMatchState />}
        />
      </Container>

      <Container heading="Stacked bars with a line">
        <MixedLineBarChart
          series={drawingSeries}
          stackedBars={true}
          yTitle="Drawings"
          hideFilter={true}
          height={260}
          ariaLabel="Drawings per month, stacked"
        />
      </Container>

      <div className={styles.grid}>
        <Container heading="Narrow">
          <div className={styles.narrow}>
            <MixedLineBarChart
              series={
                drawingSeries.slice(0, 3).map(series => ({
                  ...series,
                  data: series.type === 'threshold' ? [] : series.data.slice(0, 6),
                })) as MixedLineBarChartProps.SeriesSpec<string>[]
              }
              hideFilter={true}
              height={180}
              ariaLabel="Drawings, first half"
            />
          </div>
        </Container>
        <Container heading="Error">
          <MixedLineBarChart
            series={[]}
            statusType="error"
            errorText="The drawing register could not be loaded."
            recoveryText="Retry"
            height={180}
          />
        </Container>
      </div>
    </article>
  );
}
