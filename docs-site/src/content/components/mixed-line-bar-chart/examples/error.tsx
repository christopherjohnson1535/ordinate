// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import MixedLineBarChart, { MixedLineBarChartProps } from '@ordinate/charts/mixed-line-bar-chart';

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const series: MixedLineBarChartProps.SeriesSpec<string>[] = [
  { title: 'Builds', type: 'bar', data: months.map((x, i) => ({ x, y: [412, 438, 391, 455, 470, 498][i] })) },
  {
    title: 'Builds, same month in 2025',
    type: 'line',
    data: months.map((x, i) => ({ x, y: [350, 362, 340, 371, 388, 402][i] })),
  },
];

export default function ErrorState() {
  const [status, setStatus] = useState<'error' | 'loading' | 'finished'>('error');

  return (
    <MixedLineBarChart
      series={status === 'finished' ? series : []}
      statusType={status}
      loadingText="Loading the build history"
      errorText="The build history could not be loaded from ci.north-annex."
      recoveryText="Retry"
      onRecoveryClick={() => {
        setStatus('loading');
        window.setTimeout(() => setStatus('finished'), 1200);
      }}
      yTitle="Builds"
      hideFilter={true}
      height={200}
      ariaLabel="Builds per month, against the same months in 2025"
    />
  );
}
