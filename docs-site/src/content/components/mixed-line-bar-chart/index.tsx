// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'MixedLineBarChart',
  folder: 'mixed-line-bar-chart',
  group: 'charts',
  package: 'charts',
  summary: 'Draws bars and lines against the same categories, such as monthly totals and their average.',
  description: (
    <>
      <p>
        A mixed chart draws <code>bar</code> and <code>line</code> series on one categorical x axis and one y axis. Bars
        are filled with a color and a pattern; lines take a color, a dash and a point marker, and run through the middle
        of each category over the bars. A band of background under each line keeps it readable where it crosses a bar.
      </p>
      <p>
        Bar and line series share one palette in the order they are listed, so the first line after two bar series takes
        the third color. Bars stand side by side by default, or stack with <code>stackedBars</code>; lines are never
        stacked.
      </p>
    </>
  ),
  examples: [
    {
      id: 'bars-and-trend',
      title: 'Bars with a trend line',
      description: (
        <p>
          Monthly counts as bars, their running average as a line and a target as a threshold. The line makes the trend
          easy to follow when the bars go up and down.
        </p>
      ),
    },
    {
      id: 'stacked',
      title: 'Stacked bars with a line',
      description: (
        <p>
          With <code>stackedBars</code> the bars of each category stack into one column whose height is their sum. The
          line here is a separate measure in the same unit, the tickets still open at the end of each day.
        </p>
      ),
    },
    {
      id: 'filter',
      title: 'Controlled filter',
      description: (
        <p>
          The filter lists bars, lines and thresholds together. This chart starts with returns hidden, and{' '}
          <code>i18nStrings</code> renames the filter for what it holds.
        </p>
      ),
    },
    {
      id: 'error',
      title: 'Error and retry',
      description: (
        <p>
          <code>statusType=&quot;error&quot;</code> shows <code>errorText</code> with a fault mark and a link button
          with <code>recoveryText</code>. Click Retry to load the data.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To show amounts per category with a trend, average, forecast or comparison period over them.',
      'When the bars and the line share a unit, so one y axis reads for both.',
    ],
    avoid: [
      'Bars and a line in different units, such as a count and a percentage. There is one y axis; draw two charts.',
      <>
        For bars alone. Use a <a href="#/components/bar-chart">BarChart</a>, which can also run sideways.
      </>,
      <>
        For lines over a continuous axis such as time with many points. Use a{' '}
        <a href="#/components/line-chart">LineChart</a>.
      </>,
    ],
    writing: [
      'Name the line by how it relates to the bars: "Issued, 3-month average", "Builds, same month in 2025".',
      'Use a legendTitle that covers both kinds of series, such as "Measure".',
    ],
  },
  accessibility: [
    <>
      The plot is one tab stop with <code>role=&quot;application&quot;</code>. Left and Right move between categories,
      Up and Down move between the bar and line series, Home and End jump to the ends, Enter or Space pins the detail
      popover, and Escape dismisses it.
    </>,
    'Each move with the keyboard is announced in a polite live region with the category and every value at it.',
    <>
      Name the plot with <code>ariaLabel</code> or <code>ariaLabelledby</code>, and say how the bars and the line relate
      in <code>ariaDescription</code>.
    </>,
    'The legend draws bars as patterned squares and lines as short dashed strokes with their marker, so the two kinds read apart without color.',
  ],
  related: ['bar-chart', 'line-chart', 'area-chart'],
};

export default doc;
