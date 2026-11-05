// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'LineChart',
  folder: 'line-chart',
  group: 'charts',
  package: 'charts',
  summary: 'Shows how one or more values change along a continuous axis, such as time.',
  description: (
    <>
      <p>
        A line chart draws each series as a line of <code>{'{ x, y }'}</code> points on ink axes with faint grid rules.
        Every line has its own color, dash and point marker, so lines stay apart in print, in grayscale and for readers
        who do not tell the colors apart. A band of background runs under each line where it crosses another.
      </p>
      <p>
        Above the plot sits a filter that chooses which series are drawn, and below it a legend keyed like the lines.
        Pointing at the plot, or moving through it with the arrow keys, opens a detail popover with every series&apos;
        value at that x position. A <code>threshold</code> series draws a dashed ink reference line, such as a limit or
        the moment of a deploy.
      </p>
    </>
  ),
  examples: [
    {
      id: 'time-series',
      title: 'Time series',
      description: (
        <p>
          With <code>xScaleType=&quot;time&quot;</code> the x values are <code>Date</code> objects and the ticks fall on
          calendar boundaries. Pass a <code>valueFormatter</code> on each series so the detail popover shows values in
          their unit, and a threshold to show the limit the lines approach.
        </p>
      ),
    },
    {
      id: 'thresholds',
      title: 'Thresholds',
      description: (
        <p>
          A threshold with <code>y</code> draws a horizontal line at that value; one with <code>x</code> draws a
          vertical line at that position, here the time of a deploy. Each threshold has its own dash.{' '}
          <code>detailPopoverFooter</code> adds a link to the popover, which stays open when the plot is clicked.
        </p>
      ),
    },
    {
      id: 'controlled-filter',
      title: 'Controlled filter and highlight',
      description: (
        <p>
          Set <code>visibleSeries</code> with <code>onFilterChange</code>, and <code>highlightedSeries</code> with{' '}
          <code>onHighlightChange</code>, to keep the filter and the emphasized series in your own state. A series keeps
          its color and dash when others are hidden.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Loading, error and empty',
      description: (
        <p>
          <code>statusType</code> replaces the plot with a status at the same height, so the page does not jump. The
          error state shows <code>errorText</code> and a <code>recoveryText</code> button; the empty state shows your{' '}
          <code>empty</code> content when there is no data.
        </p>
      ),
    },
    {
      id: 'scales',
      title: 'Logarithmic scales',
      description: (
        <p>
          <code>log</code> spaces each power of ten evenly, for values that span several orders of magnitude. Both axes
          take it; only positive values are drawn. By default the ticks fall on powers of ten, with 2 and 5 times each
          power when the axis spans only a few. File sizes here are in binary units, so <code>xTicks</code> puts a tick
          at every 32 times the last, where each label is a whole number of KiB, MiB or GiB. <code>yTicks</code> sets
          the ticks of the y axis the same way.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To show a trend over time: requests, latency, free space, temperatures.',
      'To compare a few series that share a unit and an x axis.',
      'With a threshold to show how close values come to a limit.',
    ],
    avoid: [
      <>
        To show how parts add up to a total over time. Use an <a href="#/components/area-chart">AreaChart</a>.
      </>,
      <>
        To compare values between named categories. Use a <a href="#/components/bar-chart">BarChart</a>.
      </>,
      'More than about six lines in one chart. Split them over several charts, or start with the filter set to the few that matter.',
      'Series in different units on one y axis. Draw a chart for each unit.',
    ],
    writing: [
      'Give each axis a title that names the measure and its unit: "Requests per minute", "Latency".',
      'Name series by the thing they measure, such as a building, a node or a region, not "Series 1".',
      'Name thresholds by what they mean: "Capacity", "Latency budget", "Alarm at 20% free".',
      'Write the errorText as what failed, such as "The metrics service did not answer.", and the recoveryText as a verb.',
    ],
  },
  accessibility: [
    <>
      The plot is one tab stop with <code>role=&quot;application&quot;</code>. Left and Right move between x positions
      (mirrored in right-to-left layout), Up and Down move between series at that position, Home and End jump to the
      ends, Enter or Space pins the detail popover and moves focus to its dismiss button, and Escape dismisses it.
    </>,
    'Each move with the keyboard is announced in a polite live region as the x value followed by every series and its value.',
    <>
      Name the plot with <code>ariaLabel</code> or <code>ariaLabelledby</code>, and describe what it shows in{' '}
      <code>ariaDescription</code>, such as the trend and where it peaks. The chart cannot write that sentence for you.
    </>,
    'The legend is a toolbar: one tab stop, the arrow keys move between items, and focusing or pointing at an item emphasizes its series. Each item reports whether it is pressed.',
    'Lines differ by dash and marker as well as color, so no information rests on color alone.',
    'The filter is a Multiselect in a FormField, labelled "Filter displayed data" unless you replace it with i18nStrings.',
  ],
  related: ['area-chart', 'mixed-line-bar-chart', 'bar-chart', 'pie-chart'],
};

export default doc;
