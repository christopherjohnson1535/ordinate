// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';
import Box from '@ordinate/components/box';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

const deploysByRegion: Record<string, Array<[string, number]>> = {
  today: [],
  week: [
    ['us-mountain-1', 18],
    ['us-coast-2', 11],
    ['eu-harbor-2', 7],
  ],
  month: [
    ['us-mountain-1', 64],
    ['us-coast-2', 52],
    ['eu-harbor-2', 31],
  ],
};

export default function Loading() {
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  // Each change of period fetches again; here a timer stands in for the request.
  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => setLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [loading, period]);

  const series: BarChartProps.SeriesSpec<string>[] = deploysByRegion[period].length
    ? [{ title: 'Deploys', type: 'bar', data: deploysByRegion[period].map(([x, y]) => ({ x, y })) }]
    : [];

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="Period"
        selectedId={period}
        onChange={event => {
          setPeriod(event.detail.selectedId);
          setLoading(true);
        }}
        options={[
          { id: 'today', text: 'Today' },
          { id: 'week', text: 'This week' },
          { id: 'month', text: 'This month' },
        ]}
      />
      <BarChart
        series={series}
        statusType={loading ? 'loading' : 'finished'}
        loadingText="Loading deploys"
        empty={
          <Box textAlign="center" color="text-body-secondary">
            <b>No deploys yet</b>
            <Box variant="p" color="inherit">
              Nothing has been deployed today. Deploys open at 10:00.
            </Box>
          </Box>
        }
        yTitle="Deploys"
        hideFilter={true}
        hideLegend={true}
        height={200}
        ariaLabel="Deploys by region"
      />
    </SpaceBetween>
  );
}
