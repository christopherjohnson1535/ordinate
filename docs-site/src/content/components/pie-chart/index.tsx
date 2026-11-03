// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'PieChart',
  folder: 'pie-chart',
  group: 'charts',
  package: 'charts',
  summary: 'Shows how one whole splits into a few parts.',
  description: (
    <>
      <p>
        A pie chart draws each datum as a segment, clockwise from twelve o&apos;clock in the order given, in proportion
        to its value. Each segment is filled with its own color and pattern, and hairlines of background separate
        neighbors. A label sits beside each segment on a leader line, with an optional second line from{' '}
        <code>segmentDescription</code>.
      </p>
      <p>
        The <code>donut</code> variant leaves a hole for a headline number, <code>innerMetricValue</code>, and a short{' '}
        <code>innerMetricDescription</code> below it. Like the other charts it has a filter above, a legend below, and a
        detail popover that shows a segment&apos;s value and share by default.
      </p>
    </>
  ),
  marks: ['M7'],
  examples: [
    {
      id: 'pie',
      title: 'Pie with labels',
      description: (
        <p>
          Labels name each segment, and <code>segmentDescription</code> adds its value and share as a second line.
          Labels longer than the room beside the pie are cut short, with the full title on hover.
        </p>
      ),
    },
    {
      id: 'donut',
      title: 'Donut with an inner metric',
      description: (
        <p>
          Put the total, or the one number the reader came for, in the middle. <code>detailPopoverContent</code>{' '}
          replaces the popover&apos;s default value and percentage rows with your own.
        </p>
      ),
    },
    {
      id: 'controlled',
      title: 'Controlled filter and highlight',
      description: (
        <p>
          Hold the filter in <code>visibleSegments</code> and the emphasis in <code>highlightedSegment</code>. Here the
          inner metric adds up only the services shown, and the line below names the highlighted one.
        </p>
      ),
    },
    {
      id: 'sizes',
      title: 'Small, without labels',
      description: (
        <p>
          <code>size=&quot;small&quot;</code> fits a pie into a dashboard tile. <code>hideTitles</code> drops the labels
          and leaves the legend to name segments; <code>hideLegend</code> does the reverse. Keep at least one of the
          two.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Loading, error and empty',
      description: (
        <p>
          The status takes the pie&apos;s height for its <code>size</code>. The chart counts as empty when no datum has
          a value above zero.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the parts of a single total, such as cost by service or storage by kind, when there are up to about six parts.',
      'As a donut when one number, such as the total, matters most.',
    ],
    avoid: [
      <>
        To compare values that do not add up to a whole. Use a <a href="#/components/bar-chart">BarChart</a>.
      </>,
      <>
        To show how the parts change over time. Use a stacked <a href="#/components/bar-chart">BarChart</a> or an{' '}
        <a href="#/components/area-chart">AreaChart</a>.
      </>,
      'More than about six segments. Group the smallest into "Other".',
      'Parts that are close in size, where the reader has to judge angles. A bar chart reads more exactly.',
    ],
    writing: [
      'Order segments from largest to smallest, with "Other" last.',
      'Keep segment titles short enough to fit beside the pie: "Survey office", not "Survey office, second floor, west".',
      'Keep innerMetricDescription to a word or two: "stored", "nodes", "this month".',
    ],
  },
  accessibility: [
    <>
      The chart is one tab stop with <code>role=&quot;application&quot;</code>. The arrow keys move between segments in
      either direction and wrap around, Home and End jump to the first and last, Enter or Space pins the detail popover
      and moves focus into it, and Escape dismisses it.
    </>,
    'Each segment is an image with its title and value as its accessible name; each move with the keyboard is announced in a polite live region with the popover rows.',
    'The inner metric of a donut is repeated in visually hidden text, so screen readers read it as one phrase.',
    <>
      Name the chart with <code>ariaLabel</code> or <code>ariaLabelledby</code>, and state what stands out in{' '}
      <code>ariaDescription</code>.
    </>,
    'Segments differ by fill pattern as well as color, and the labels and legend name each one.',
  ],
  related: ['bar-chart', 'area-chart', 'line-chart'],
};

export default doc;
