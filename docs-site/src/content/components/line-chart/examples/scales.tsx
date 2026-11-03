// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import LineChart, { LineChartProps } from '@ordinate/charts/line-chart';

// Upload time by file size, from 1 KB to 1 GB (1 MB = 1,000 KB), measured from two regions.
const sizes = [1, 3, 10, 30, 100, 300, 1000, 3000, 10000, 30000, 100000, 300000, 1000000];

function uploadTime(perMegabyte: number, overhead: number) {
  return sizes.map(kb => ({ x: kb, y: Math.round(overhead + (kb / 1000) * perMegabyte) }));
}

const ms = (value: number) => new Intl.NumberFormat('en', { notation: 'compact' }).format(value) + ' ms';
const size = (kb: number) => (kb >= 1e6 ? `${kb / 1e6} GB` : kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`);

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
