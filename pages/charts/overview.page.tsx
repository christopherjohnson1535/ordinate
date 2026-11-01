// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AreaChart from '~charts/area-chart';
import BarChart from '~charts/bar-chart';
import LineChart from '~charts/line-chart';
import MixedLineBarChart from '~charts/mixed-line-bar-chart';
import PieChart from '~charts/pie-chart';
import Container from '~components/container';
import Header from '~components/header';

import { hourFormatter, months, numberFormatter, quarters, requests, sitesByVisits, spendByTeam } from './data';

import styles from './styles.module.scss';

const share = (datum: { value: number }, sum: number) => `${Math.round((datum.value / sum) * 100)}%`;

// Every chart on one sheet, to check that they read alike in each mode, revision and density.
export default function ChartsOverview() {
  return (
    <article className={styles.page}>
      <h1>Charts</h1>
      <div className={styles.grid}>
        <Container header={<Header variant="h2">Line</Header>}>
          <LineChart
            series={[
              { title: 'North annex', type: 'line', data: requests.north, valueFormatter: numberFormatter },
              { title: 'South annex', type: 'line', data: requests.south, valueFormatter: numberFormatter },
              { title: 'East wing', type: 'line', data: requests.east, valueFormatter: numberFormatter },
              { title: 'Capacity', type: 'threshold', y: 1200 },
            ]}
            xScaleType="time"
            xTickFormatter={hourFormatter}
            yTitle="Requests per minute"
            hideFilter={true}
            height={220}
            ariaLabel="Requests per minute"
          />
        </Container>
        <Container header={<Header variant="h2">Area</Header>}>
          <AreaChart
            series={[
              { title: 'North annex', type: 'area', data: requests.north },
              { title: 'South annex', type: 'area', data: requests.south },
              { title: 'East wing', type: 'area', data: requests.east },
              { title: 'West wing', type: 'area', data: requests.west },
            ]}
            xScaleType="time"
            xTickFormatter={hourFormatter}
            yTitle="Requests per minute"
            hideFilter={true}
            height={220}
            ariaLabel="Requests per minute, stacked"
          />
        </Container>
        <Container header={<Header variant="h2">Bar</Header>}>
          <BarChart
            series={spendByTeam.map(team => ({
              title: team.title,
              type: 'bar' as const,
              data: quarters.map((x, index) => ({ x, y: team.values[index] })),
            }))}
            yTitle="Spend (thousands)"
            hideFilter={true}
            height={220}
            ariaLabel="Spend by team"
          />
        </Container>
        <Container header={<Header variant="h2">Stacked bar</Header>}>
          <BarChart
            series={spendByTeam.map(team => ({
              title: team.title,
              type: 'bar' as const,
              data: quarters.map((x, index) => ({ x, y: team.values[index] })),
            }))}
            stackedBars={true}
            yTitle="Spend (thousands)"
            hideFilter={true}
            height={220}
            ariaLabel="Spend by team, stacked"
          />
        </Container>
        <Container header={<Header variant="h2">Mixed</Header>}>
          <MixedLineBarChart
            series={[
              { title: 'Issued', type: 'bar', data: months.map((x, i) => ({ x, y: 40 + ((i * 7) % 30) })) },
              { title: 'Revised', type: 'bar', data: months.map((x, i) => ({ x, y: 10 + ((i * 5) % 14) })) },
              { title: 'Trend', type: 'line', data: months.map((x, i) => ({ x, y: 45 + i * 2 })) },
              { title: 'Target', type: 'threshold', y: 65 },
            ]}
            yTitle="Drawings"
            hideFilter={true}
            height={220}
            ariaLabel="Drawings per month"
          />
        </Container>
        <Container header={<Header variant="h2">Pie and donut</Header>}>
          <div className={styles.pair}>
            <PieChart
              data={sitesByVisits.slice(0, 4)}
              size="small"
              hideFilter={true}
              hideLegend={true}
              segmentDescription={share}
              ariaLabel="Visits by site"
            />
            <PieChart
              data={sitesByVisits}
              size="small"
              variant="donut"
              innerMetricValue="42K"
              innerMetricDescription="visits"
              hideFilter={true}
              hideTitles={true}
              ariaLabel="Visits by site, donut"
            />
          </div>
        </Container>
      </div>
    </article>
  );
}
