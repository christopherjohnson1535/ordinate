// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ColumnLayout',
  folder: 'column-layout',
  group: 'layout',
  summary: 'Places short pieces of content side by side in up to four equal columns that drop away as space narrows.',
  description: (
    <>
      <p>
        A column layout puts each child in its own cell, filling the rows in reading order. Columns are equal and
        drop away as the layout narrows: below 465 pixels everything stacks, and below 688 pixels at most two remain.
        The width is measured on the layout itself, so it adapts inside a narrow panel as it would on a narrow screen.
      </p>
      <p>
        Hairline rules can run between columns, between rows or both. They sit in the middle of the gutters and stop
        at the outer edges, so every column keeps the same width for its content.
      </p>
    </>
  ),
  marks: ['M1'],
  examples: [
    {
      id: 'text-grid',
      title: 'Text grid',
      description: (
        <p>
          <code>variant="text-grid"</code> rules off the columns with vertical lines. Use it for a row of figures or
          short facts inside a container.
        </p>
      ),
    },
    {
      id: 'borders',
      title: 'Borders',
      description: (
        <p>
          <code>borders</code> draws lines between columns, between rows, or both. Rows that wrap keep their rules
          lined up.
        </p>
      ),
    },
    {
      id: 'min-column-width',
      title: 'Minimum column width',
      description: (
        <p>
          With <code>minColumnWidth</code>, the layout fits as many columns as that width allows, up to{' '}
          <code>columns</code>, instead of following the built-in breakpoints. Change the window width to see the
          columns drop away.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For two to four short, similar pieces of content side by side: figures, facts, short descriptions.',
      'Inside a container, to divide its content without nesting more containers.',
    ],
    avoid: [
      <>
        For labels and values. Use <a href="#/components/key-value-pairs">KeyValuePairs</a>, which aligns them.
      </>,
      <>
        For columns of different widths. Use a <a href="#/components/grid">Grid</a>.
      </>,
      'For long text side by side. Columns of running text are hard to read on screen.',
    ],
  },
  accessibility: [
    'The layout adds no roles: cells are read in reading order, row by row, which is also the order they appear in on narrow screens.',
    'The rules between cells are drawing only. Use headings or labels in the cells for anything a reader needs to tell them apart.',
  ],
  related: ['grid', 'space-between', 'key-value-pairs', 'container'],
};

export default doc;
