// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'BarChart',
  folder: 'bar-chart',
  group: 'charts',
  package: 'charts',
  summary: 'Compares values between named categories, such as teams, sites or quarters.',
  description: (
    <>
      <p>
        A bar chart draws one band per category and a bar per series in it. Bars of different series stand side by side,
        or on top of each other with <code>stackedBars</code>, and run sideways with <code>horizontalBars</code>. Each
        series fills its bars with its own color and pattern, edged in that color, so bars stay apart without color.
      </p>
      <p>
        The x axis is always categorical, in the order of <code>xDomain</code> or of the data. Bars grow from zero, and
        when values go below zero the zero line is drawn in ink as the baseline. Pointing at a band shades it and opens
        the detail popover for that category.
      </p>
    </>
  ),
  examples: [
    {
      id: 'grouped',
      title: 'Grouped',
      description: (
        <p>
          The default: the series of each category side by side, against a threshold. Use it to compare the series
          within each category as well as across them.
        </p>
      ),
    },
    {
      id: 'stacked',
      title: 'Stacked',
      description: (
        <p>
          <code>stackedBars</code> puts the series on top of each other, so the bar&apos;s height is the total and the
          detail popover adds a total row. List the series in the order they should stack from the axis.
        </p>
      ),
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: (
        <p>
          <code>horizontalBars</code> runs categories down the side, for long names. <code>xTitle</code> still names the
          categories and <code>yTitle</code> the values, wherever they are drawn. Names longer than about a third of the
          width are cut short, with the full name on hover.
        </p>
      ),
    },
    {
      id: 'negative-values',
      title: 'Negative values',
      description: (
        <p>
          Bars below zero hang from the ink baseline. A symmetric <code>yDomain</code> keeps the over and the under on
          the same scale.
        </p>
      ),
    },
    {
      id: 'loading',
      title: 'Loading and empty',
      description: (
        <p>
          Set <code>statusType=&quot;loading&quot;</code> while data is fetched. When the request returns no series, the
          chart shows your <code>empty</code> content in the plot&apos;s place.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To compare an amount between categories: spend by team, findings by site, deploys by region.',
      'To compare a few series within each category, grouped or stacked.',
      'Horizontally when category names are long or there are many categories.',
    ],
    avoid: [
      <>
        For a value that changes over a continuous axis with many points. Use a{' '}
        <a href="#/components/line-chart">LineChart</a>.
      </>,
      <>
        To show bars and a trend or average against the same categories. Use a{' '}
        <a href="#/components/mixed-line-bar-chart">MixedLineBarChart</a>.
      </>,
      <>
        For the shares of a single total. Use a <a href="#/components/pie-chart">PieChart</a>.
      </>,
      'Grouped bars with more than four series per category; the bars become too thin to compare.',
    ],
    writing: [
      'Keep category names short. Use horizontal bars when they cannot be.',
      'Name the value axis with the measure and its unit: "Spend (thousands of dollars)".',
      'Put categories with a natural order, such as quarters or weeks, in that order; otherwise sort by value.',
    ],
  },
  accessibility: [
    <>
      The plot is one tab stop with <code>role=&quot;application&quot;</code>. The arrow keys along the category axis
      move between categories (Up and Down when the bars are horizontal), the arrow keys across it move between series,
      Home and End jump to the first and last category, Enter or Space pins the detail popover, and Escape dismisses it.
    </>,
    'Each move with the keyboard is announced in a polite live region: the category, each series and its value, and the total for stacked bars.',
    <>
      Name the plot with <code>ariaLabel</code> or <code>ariaLabelledby</code>, and state the main finding in{' '}
      <code>ariaDescription</code>.
    </>,
    'Bars differ by fill pattern as well as color, so series stay apart for readers who do not tell the colors apart.',
    'The legend is a toolbar with one tab stop and arrow keys between items.',
  ],
  related: ['mixed-line-bar-chart', 'line-chart', 'pie-chart', 'area-chart'],
};

export default doc;
