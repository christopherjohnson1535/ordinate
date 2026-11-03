// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'AreaChart',
  folder: 'area-chart',
  group: 'charts',
  package: 'charts',
  summary: 'Shows how parts add up to a total along a continuous axis, such as time.',
  description: (
    <>
      <p>
        An area chart stacks its series as filled areas, in the order they are listed from the axis up, so the top edge
        reads as the total. Each area is filled with its own color and pattern (solid, hatched, dotted, ruled or
        cross-hatched) and edged with a line in its color, so neighbors stay apart without color.
      </p>
      <p>
        It shares its filter, legend, detail popover, states and keyboard model with the line chart. The detail popover
        lists each area&apos;s own value, not its stacked height, and ends with a total row.
      </p>
    </>
  ),
  examples: [
    {
      id: 'stacked',
      title: 'Stacked over time',
      description: (
        <p>
          Four buildings stack into the site&apos;s total power draw over a day, against the supply limit. Put the
          steadiest or largest series first, so it lies along the axis and the others ride on it.
        </p>
      ),
    },
    {
      id: 'patterns',
      title: 'Every pattern',
      description: (
        <p>
          Series take the eight categorical colors and the eight patterns in the order they are listed. Eight series is
          the most a chart should hold; past that colors repeat with a shifted pattern. With{' '}
          <code>xScaleType=&quot;categorical&quot;</code> the areas run between named positions such as months.
        </p>
      ),
    },
    {
      id: 'controlled-highlight',
      title: 'Controlled highlight',
      description: (
        <p>
          Pointing at a legend item emphasizes its area and dims the rest; clicking keeps the emphasis, for touch
          screens. Hold it in your own state with <code>highlightedSeries</code> and <code>onHighlightChange</code>.
          Here <code>i18nStrings.detailTotalLabel</code> renames the total row.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Loading, error and no match',
      description: (
        <p>
          The status stands in the plot&apos;s place between its axis rules, at the same height. <code>noMatch</code>{' '}
          shows when the filter hides every series; the filter stays above it so the reader can undo that.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To show how a total over time splits into parts: power by building, traffic by region, storage by kind.',
      'When the total matters as much as the parts.',
    ],
    avoid: [
      <>
        To compare the trends of series that do not add up to anything. Use a{' '}
        <a href="#/components/line-chart">LineChart</a>, where every series starts from the axis.
      </>,
      <>
        For the parts of one total at a single moment. Use a <a href="#/components/pie-chart">PieChart</a>, or a stacked{' '}
        <a href="#/components/bar-chart">BarChart</a> for a few moments.
      </>,
      'Series with negative values, which do not stack into a readable total.',
      'More than eight series. The upper areas become thin bands that are hard to read.',
    ],
    writing: [
      'Give the y axis a title that names the total and its unit: "Power drawn (kW)".',
      'Name each series by the part it stands for: a building, a team, a kind of record.',
      'Rename the total row with i18nStrings.detailTotalLabel when "Total" is not the clearest word, such as "All teams".',
    ],
  },
  accessibility: [
    <>
      The plot is one tab stop with <code>role=&quot;application&quot;</code>. Left and Right move between x positions,
      Up and Down move between series, Home and End jump to the ends, Enter or Space pins the detail popover and moves
      focus into it, and Escape dismisses it.
    </>,
    'Each move with the keyboard is announced in a polite live region: the x value, every area and its value, and the total.',
    <>
      Name the plot with <code>ariaLabel</code> or <code>ariaLabelledby</code>, and say what the reader should see in{' '}
      <code>ariaDescription</code>, such as when the total peaks.
    </>,
    'The legend is a toolbar with one tab stop and arrow keys between items; each item is a toggle button that emphasizes its series.',
    'Areas differ by fill pattern as well as color.',
  ],
  related: ['line-chart', 'bar-chart', 'pie-chart', 'mixed-line-bar-chart'],
};

export default doc;
