// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PieChart, { PieChartProps } from '~charts/pie-chart';
import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';

import { sitesByVisits, storageByKind } from '../charts/data';
import { EmptyState, NoMatchState } from '../charts/states';

import styles from '../charts/styles.module.scss';

const share = (datum: PieChartProps.Datum, sum: number) => `${((datum.value / sum) * 100).toFixed(1)}%`;
const visits = (datum: PieChartProps.Datum, sum: number) =>
  `${new Intl.NumberFormat('en').format(datum.value)} visits, ${share(datum, sum)}`;
const storageTotal = storageByKind.reduce((sum, item) => sum + item.value, 0);

export default function PieChartPermutations() {
  const [highlighted, setHighlighted] = useState<PieChartProps.Datum | null>(null);

  return (
    <article className={styles.page}>
      <h1>Pie chart</h1>

      <Container heading="Visits by site">
        <PieChart
          data={sitesByVisits}
          segmentDescription={visits}
          legendTitle="Site"
          ariaLabel="Visits by site"
          ariaDescription="The north annex reading room has about half of all visits."
          detailPopoverFooter={() => <Button variant="link">Open site report</Button>}
          empty={<EmptyState />}
          noMatch={<NoMatchState />}
        />
      </Container>

      <Container heading="Donut with an inner metric">
        <div className={styles.stack}>
          <Box color="text-body-secondary" fontSize="body-s">
            Highlighted: {highlighted?.title ?? 'none'}
          </Box>
          <PieChart
            data={storageByKind}
            variant="donut"
            size="large"
            innerMetricValue={`${storageTotal} GB`}
            innerMetricDescription="stored"
            segmentDescription={share}
            highlightedSegment={highlighted}
            onHighlightChange={event => setHighlighted(event.detail.highlightedSegment)}
            detailPopoverContent={(datum, sum) => [
              { key: 'Stored', value: `${datum.value} GB` },
              { key: 'Share', value: share(datum, sum) },
            ]}
            hideFilter={true}
            ariaLabel="Storage by kind"
          />
        </div>
      </Container>

      <div className={styles.grid}>
        <Container heading="Small, no titles">
          <PieChart data={storageByKind} size="small" hideTitles={true} hideFilter={true} ariaLabel="Storage, small" />
        </Container>
        <Container heading="Small donut, titles only">
          <PieChart
            data={storageByKind}
            size="small"
            variant="donut"
            innerMetricValue="930"
            segmentDescription={share}
            hideDescriptions={true}
            hideFilter={true}
            hideLegend={true}
            ariaLabel="Storage, small donut"
          />
        </Container>
        <Container heading="Loading">
          <PieChart data={[]} size="small" statusType="loading" loadingText="Loading visits" />
        </Container>
        <Container heading="Empty">
          <PieChart data={[]} size="small" empty={<EmptyState />} />
        </Container>
      </div>
    </article>
  );
}
