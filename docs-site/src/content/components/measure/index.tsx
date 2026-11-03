// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Measure',
  folder: 'measure',
  group: 'status',
  summary: 'Shows one reading, such as a count or a latency, with its unit and, if it has one, its scale.',
  description: (
    <>
      <p>
        A measure sets its reading large, with the unit in mono beside it. With a <code>max</code>, the reading says
        &quot;of&quot; the maximum, as in &quot;20 of 32 nodes&quot;, and a ruler is drawn under it: ticks at round
        numbers from zero to the maximum, with the run up to the reading filled in. A <code>limit</code> is a dashed
        mark across the ruler, named in mono below it.
      </p>
      <p>
        Numbers are formatted for the locale of the <code>I18nProvider</code> or the page, or with your own{' '}
        <code>format</code>. Text values, such as &quot;99.98%&quot;, are shown as they are; set <code>current</code> to
        place them on the ruler.
      </p>
    </>
  ),
  marks: ['M3'],
  examples: [
    {
      id: 'dashboard',
      title: 'Readings on a dashboard',
      description: (
        <p>
          Four measures in a <a href="#/components/column-layout">ColumnLayout</a>: with a scale, without one, with a
          limit and with a text value placed by <code>current</code>.
        </p>
      ),
    },
    {
      id: 'limit',
      title: 'A reading against a limit',
      description: (
        <p>
          The ruler shows how close the reading is to the limit, but only in drawing. Say in words when the reading
          crosses it, here with a <a href="#/components/status-indicator">StatusIndicator</a>.
        </p>
      ),
    },
    {
      id: 'key-value',
      title: 'In key-value pairs',
      description: (
        <p>
          Leave out <code>label</code> when the key already names the measure. <code>format</code> turns a fraction into
          a percentage.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the few numbers that sum up a resource or a page, such as capacity, load or uptime.',
      'With max when the reading has a natural ceiling, so the reader sees how full it is.',
      'With limit for a target or an alarm level on the same scale.',
    ],
    avoid: [
      <>
        For the progress of an operation that ends. Use a <a href="#/components/progress-bar">ProgressBar</a>.
      </>,
      <>
        For a reading over time. Use a <a href="#/components/line-chart">LineChart</a>.
      </>,
      'For a long list of numbers. Use a table with figures aligned to the end.',
    ],
    writing: [
      'Name what is measured in the label, not the unit: "Nodes in service", with "nodes" as the unit.',
      'Use description for the period or the source: "last 24 hours", "measured at the load balancer".',
      'Name a limit by what it is for: "target 200 ms", "alarm at 90 GB".',
    ],
  },
  accessibility: [
    'The label, reading, maximum, unit, limit name and description are text, read in that order.',
    'The ruler is hidden from screen readers because it repeats the numbers in the text. Keep value and current saying the same thing.',
    'The ruler does not say whether a limit is crossed. Say so in words next to the measure.',
  ],
  related: ['progress-bar', 'key-value-pairs', 'status-indicator'],
};

export default doc;
