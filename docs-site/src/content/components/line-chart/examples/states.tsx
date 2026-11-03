// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';
import Box from '@ordinate/components/box';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

const start = new Date(2026, 10, 2, 8, 0).getTime();
const queueDepth: LineChartProps.SeriesSpec<Date>[] = [
  {
    title: 'Queue depth, render-jobs',
    type: 'line',
    data: Array.from({ length: 25 }, (_, index) => ({
      x: new Date(start + index * 10 * 60 * 1000),
      y: Math.round(40 + 30 * Math.sin(index / 4) + (index % 3) * 4),
    })),
  },
];

type State = 'finished' | 'loading' | 'error' | 'empty';

export default function States() {
  const [state, setState] = useState<State>('error');
  const [retries, setRetries] = useState(0);

  // A retry loads again and then succeeds.
  useEffect(() => {
    if (retries === 0) {
      return;
    }
    const timer = window.setTimeout(() => setState('finished'), 1500);
    return () => window.clearTimeout(timer);
  }, [retries]);

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="State"
        selectedId={state}
        onChange={event => setState(event.detail.selectedId as State)}
        options={[
          { id: 'finished', text: 'Loaded' },
          { id: 'loading', text: 'Loading' },
          { id: 'error', text: 'Error' },
          { id: 'empty', text: 'Empty' },
        ]}
      />
      <LineChart
        series={state === 'empty' ? [] : queueDepth}
        statusType={state === 'empty' ? 'finished' : state}
        loadingText="Loading queue depth"
        errorText="The metrics service did not answer."
        recoveryText="Retry"
        onRecoveryClick={() => {
          setState('loading');
          setRetries(count => count + 1);
        }}
        empty={
          <Box textAlign="center" color="text-body-secondary">
            <b>No jobs queued</b>
            <Box variant="p" color="inherit">
              render-jobs has had no work since 08:00.
            </Box>
          </Box>
        }
        xScaleType="time"
        xTickFormatter={date => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        yTitle="Jobs waiting"
        hideFilter={true}
        hideLegend={true}
        height={200}
        ariaLabel="Queue depth of render-jobs, this morning"
      />
    </SpaceBetween>
  );
}
