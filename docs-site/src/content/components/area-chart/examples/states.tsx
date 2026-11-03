// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AreaChart, { AreaChartProps } from '@ordinate/charts/area-chart';
import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import SpaceBetween from '@ordinate/components/space-between';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const series: AreaChartProps.SeriesSpec<string>[] = [
  { title: 'Reads', type: 'area', data: days.map((x, i) => ({ x, y: [120, 134, 128, 141, 150][i] })) },
  { title: 'Writes', type: 'area', data: days.map((x, i) => ({ x, y: [40, 38, 45, 52, 47][i] })) },
];

export default function States() {
  const [retrying, setRetrying] = useState(false);
  const [visible, setVisible] = useState<ReadonlyArray<AreaChartProps.SeriesSpec<string>>>([]);

  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={2}>
        <AreaChart
          series={[]}
          statusType="loading"
          loadingText="Loading traffic"
          height={140}
          ariaLabel="Traffic, loading"
        />
        <AreaChart
          series={[]}
          statusType={retrying ? 'loading' : 'error'}
          loadingText="Trying again"
          errorText="Traffic for us-mountain-1 could not be loaded."
          recoveryText="Retry"
          onRecoveryClick={() => setRetrying(true)}
          height={140}
          ariaLabel="Traffic, failed to load"
        />
      </ColumnLayout>
      <AreaChart
        series={series}
        visibleSeries={visible}
        onFilterChange={event => setVisible(event.detail.visibleSeries)}
        yTitle="Requests per second"
        height={160}
        ariaLabel="Read and write traffic, us-mountain-1, this week"
        noMatch={
          <Box textAlign="center" color="text-body-secondary">
            <b>No series shown</b>
            <Box variant="p" color="inherit">
              Choose reads or writes in the filter.
            </Box>
          </Box>
        }
      />
    </SpaceBetween>
  );
}
