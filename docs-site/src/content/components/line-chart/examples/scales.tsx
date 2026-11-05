// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';

// Upload time by file size, from 1 KiB to 1 GiB (1 MiB = 1,024 KiB), measured from two regions.
const sizes = [1, 4, 16, 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576];

// A tick at every 32 times the last, so each label is a whole number of KiB, MiB or GiB.
const sizeTicks = [1, 32, 1024, 32768, 1048576];

function uploadTime(perMebibyte: number, overhead: number) {
  return sizes.map(kib => ({ x: kib, y: Math.round(overhead + (kib / 1024) * perMebibyte) }));
}

const ms = (value: number) => new Intl.NumberFormat('en', { notation: 'compact' }).format(value) + ' ms';
const size = (kib: number) =>
  kib >= 1048576 ? `${kib / 1048576} GiB` : kib >= 1024 ? `${kib / 1024} MiB` : `${kib} KiB`;

const series: LineChartProps.SeriesSpec<number>[] = [
  { title: 'us-mountain-1', type: 'line', data: uploadTime(9, 40), valueFormatter: value => `${value} ms` },
  { title: 'eu-harbor-2', type: 'line', data: uploadTime(14, 95), valueFormatter: value => `${value} ms` },
];

export default function Scales() {
  return (
    <LineChart
      series={series}
      xScaleType="log"
      yScaleType="log"
      xTicks={sizeTicks}
      xTitle="File size"
      yTitle="Upload time"
      xTickFormatter={size}
      yTickFormatter={ms}
      hideFilter={true}
      height={240}
      ariaLabel="Upload time by file size and region"
    />
  );
}
