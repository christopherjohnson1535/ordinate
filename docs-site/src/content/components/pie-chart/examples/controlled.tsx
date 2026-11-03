// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PieChart, { PieChartProps } from '@ordinate/charts/pie-chart';
import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';

const costByService: PieChartProps.Datum[] = [
  { title: 'Compute', value: 18400 },
  { title: 'Storage', value: 7200 },
  { title: 'Database', value: 6100 },
  { title: 'Network', value: 2900 },
  { title: 'Monitoring', value: 1100 },
];

const dollars = (value: number) => `$${new Intl.NumberFormat('en').format(value)}`;

export default function Controlled() {
  const [visible, setVisible] = useState<ReadonlyArray<PieChartProps.Datum>>(costByService);
  const [highlighted, setHighlighted] = useState<PieChartProps.Datum | null>(null);
  const shownTotal = visible.reduce((sum, item) => sum + item.value, 0);

  return (
    <SpaceBetween size="s">
      <PieChart
        data={costByService}
        variant="donut"
        visibleSegments={visible}
        onFilterChange={event => setVisible(event.detail.visibleSegments)}
        highlightedSegment={highlighted}
        onHighlightChange={event => setHighlighted(event.detail.highlightedSegment)}
        innerMetricValue={dollars(shownTotal)}
        innerMetricDescription="this month"
        segmentDescription={datum => dollars(datum.value)}
        legendTitle="Service"
        i18nStrings={{ filterLabel: 'Services shown', filterPlaceholder: 'Choose services' }}
        ariaLabel="Cost by service, us-mountain-1, October 2026"
        noMatch={
          <Box textAlign="center" color="text-body-secondary">
            Choose at least one service.
          </Box>
        }
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {highlighted ? `${highlighted.title}: ${dollars(highlighted.value)}.` : 'No segment highlighted.'}
      </Box>
    </SpaceBetween>
  );
}
