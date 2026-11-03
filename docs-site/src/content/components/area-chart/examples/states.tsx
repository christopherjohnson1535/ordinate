// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AreaChart, { AreaChartProps } from '@ordinate/charts/area-chart';
import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';

const series: AreaChartProps.SeriesSpec<string>[] = [
  { title: 'Reads', type: 'area', data: [{ x: 'Mon', y: 120 }] },
  { title: 'Writes', type: 'area', data: [{ x: 'Mon', y: 40 }] },
];

export default function States() {
  const [retrying, setRetrying] = useState(false);

  return (
    <ColumnLayout columns={3}>
      <AreaChart
        series={[]}
        statusType="loading"
        loadingText="Loading traffic"
        height={160}
        ariaLabel="Traffic, loading"
      />
      <AreaChart
        series={[]}
        statusType={retrying ? 'loading' : 'error'}
        loadingText="Trying again"
        errorText="Traffic for us-mountain-1 could not be loaded."
        recoveryText="Retry"
        onRecoveryClick={() => setRetrying(true)}
        height={160}
        ariaLabel="Traffic, failed to load"
      />
      <AreaChart
        series={series}
        visibleSeries={[]}
        height={160}
        ariaLabel="Traffic, every series filtered out"
        noMatch={
          <Box textAlign="center" color="text-body-secondary">
            <b>No series shown</b>
            <Box variant="p" color="inherit">
              Choose reads or writes in the filter.
            </Box>
          </Box>
        }
      />
    </ColumnLayout>
  );
}
