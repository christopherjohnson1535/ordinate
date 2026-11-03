// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AreaChart, { AreaChartProps } from '@ordinate/charts/area-chart';
import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';

const days = Array.from({ length: 21 }, (_, index) => new Date(2026, 9, 12 + index));

// Build minutes used per day by each team, lower at weekends.
function minutes(base: number, seed: number) {
  return days.map(x => {
    const weekend = x.getDay() === 0 || x.getDay() === 6;
    const noise = Math.sin(x.getDate() * 1.7 + seed) * base * 0.2;
    return { x, y: Math.round((weekend ? base * 0.25 : base) + noise) };
  });
}

const series: AreaChartProps.SeriesSpec<Date>[] = [
  { title: 'Platform', type: 'area', data: minutes(640, 1) },
  { title: 'Web', type: 'area', data: minutes(420, 2) },
  { title: 'Data', type: 'area', data: minutes(260, 3) },
];

export default function ControlledHighlight() {
  const [highlighted, setHighlighted] = useState<AreaChartProps.SeriesSpec<Date> | null>(null);

  return (
    <SpaceBetween size="s">
      <AreaChart
        series={series}
        highlightedSeries={highlighted}
        onHighlightChange={event => setHighlighted(event.detail.highlightedSeries)}
        xScaleType="time"
        xTickFormatter={date => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        yTitle="Build minutes per day"
        legendTitle="Team"
        hideFilter={true}
        height={220}
        i18nStrings={{ detailTotalLabel: 'All teams' }}
        ariaLabel="Build minutes per day by team, 12 October to 1 November 2026"
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {highlighted
          ? `${highlighted.title} is highlighted. Click its legend item again to clear it.`
          : 'Point at a legend item, or click it to keep the highlight.'}
      </Box>
    </SpaceBetween>
  );
}
