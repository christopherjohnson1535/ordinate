// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PieChart, { PieChartProps } from '@ordinate/charts/pie-chart';

const storageByKind: PieChartProps.Datum[] = [
  { title: 'Drawings', value: 412 },
  { title: 'Photographs', value: 268 },
  { title: 'Survey data', value: 154 },
  { title: 'Models', value: 96 },
];

const total = storageByKind.reduce((sum, item) => sum + item.value, 0);
const share = (datum: PieChartProps.Datum, sum: number) => `${Math.round((datum.value / sum) * 100)}%`;

export default function Donut() {
  return (
    <PieChart
      data={storageByKind}
      variant="donut"
      size="large"
      innerMetricValue={`${total} GB`}
      innerMetricDescription="stored"
      segmentDescription={share}
      detailPopoverContent={(datum, sum) => [
        { key: 'Stored', value: `${datum.value} GB` },
        { key: 'Share of archive', value: share(datum, sum) },
      ]}
      hideFilter={true}
      ariaLabel="Storage used in the north-annex archive, by kind of record"
    />
  );
}
