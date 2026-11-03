// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import MixedLineBarChart, { MixedLineBarChartProps } from '@ordinate/charts/mixed-line-bar-chart';
import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';

const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

const series: MixedLineBarChartProps.SeriesSpec<string>[] = [
  { title: 'Orders', type: 'bar', data: quarters.map((x, i) => ({ x, y: [310, 342, 365, 401][i] })) },
  { title: 'Returns', type: 'bar', data: quarters.map((x, i) => ({ x, y: [22, 19, 27, 24][i] })) },
  { title: 'Orders forecast', type: 'line', data: quarters.map((x, i) => ({ x, y: [300, 330, 370, 410][i] })) },
  { title: 'Break-even', type: 'threshold', y: 280 },
];

export default function Filter() {
  const [visible, setVisible] = useState<ReadonlyArray<MixedLineBarChartProps.SeriesSpec<string>>>(
    series.filter(item => item.title !== 'Returns')
  );

  return (
    <SpaceBetween size="s">
      <MixedLineBarChart
        series={series}
        visibleSeries={visible}
        onFilterChange={event => setVisible(event.detail.visibleSeries)}
        yTitle="Orders per quarter"
        height={220}
        i18nStrings={{ filterLabel: 'Measures shown', filterPlaceholder: 'Choose measures' }}
        ariaLabel="Orders, returns and forecast per quarter, 2026"
        noMatch={
          <Box textAlign="center" color="text-body-secondary">
            Choose at least one measure.
          </Box>
        }
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Shown: {visible.map(item => item.title).join(', ') || 'nothing'}.
      </Box>
    </SpaceBetween>
  );
}
