// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PieChart, { PieChartProps } from '@ordinate/charts/pie-chart';
import Button from '@ordinate/components/button';

const visitsBySite: PieChartProps.Datum[] = [
  { title: 'North annex reading room', value: 18240 },
  { title: 'Survey office', value: 9120 },
  { title: 'Fabrication hall', value: 7420 },
  { title: 'Archive', value: 3860 },
  { title: 'Model shop', value: 2150 },
  { title: 'Other', value: 1310 },
];

const share = (datum: PieChartProps.Datum, sum: number) => `${((datum.value / sum) * 100).toFixed(1)}%`;

export default function Pie() {
  return (
    <PieChart
      data={visitsBySite}
      segmentDescription={(datum, sum) =>
        `${new Intl.NumberFormat('en').format(datum.value)} visits, ${share(datum, sum)}`
      }
      legendTitle="Site"
      detailPopoverFooter={() => (
        <Button variant="link" href="#/components/pie-chart">
          Open site report
        </Button>
      )}
      ariaLabel="Visits by site, October 2026"
      ariaDescription="The north annex reading room has 43% of all visits, twice as many as the survey office."
    />
  );
}
