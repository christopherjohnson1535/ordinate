// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';
import Figure from '@ordinate/components/figure';
import StyleScope from '@ordinate/components/style-scope';

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const kilos = [38, 52, 61, 74, 66, 41];

const series: BarChartProps.SeriesSpec<string>[] = [
  {
    title: 'Harvest',
    type: 'bar',
    data: months.map((x, index) => ({ x, y: kilos[index] })),
    valueFormatter: value => `${value} kg`,
  },
];

export default function Chart() {
  return (
    <StyleScope styleName="editorial">
      <Figure
        media={
          <BarChart
            series={series}
            height={220}
            hideFilter={true}
            hideLegend={true}
            yTitle="Kilograms"
            ariaLabel="Vegetables harvested on plot 14 each month, May to October 2026"
          />
        }
        label="Fig. 3"
        caption="What plot 14 gave up this year. August was the best month for courgettes, and the worst for slugs."
        credit="Figures: the plot 14 notebook"
      />
    </StyleScope>
  );
}
