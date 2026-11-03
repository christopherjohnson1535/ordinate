// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PieChart, { PieChartProps } from '@ordinate/charts/pie-chart';
import ColumnLayout from '@ordinate/components/column-layout';

const nodesByState: PieChartProps.Datum[] = [
  { title: 'Running', value: 14 },
  { title: 'Draining', value: 3 },
  { title: 'Stopped', value: 2 },
  { title: 'Failed', value: 1 },
];

export default function Sizes() {
  return (
    <ColumnLayout columns={2}>
      <PieChart
        data={nodesByState}
        size="small"
        hideTitles={true}
        hideFilter={true}
        ariaLabel="Nodes by state, north-annex, without labels"
      />
      <PieChart
        data={nodesByState}
        size="small"
        variant="donut"
        innerMetricValue="20"
        innerMetricDescription="nodes"
        hideFilter={true}
        hideLegend={true}
        ariaLabel="Nodes by state, north-annex, labels only"
      />
    </ColumnLayout>
  );
}
