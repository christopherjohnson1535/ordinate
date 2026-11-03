// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Grid',
  folder: 'grid',
  group: 'layout',
  summary: 'Places content on a 12-column grid, with a span, offset and order that can change with the width.',
  description: (
    <>
      <p>
        A grid gives each child an entry in <code>gridDefinition</code>: how many of the 12 columns it spans, how many
        to leave empty before it, and whether to push or pull it along the row. A child that does not fit in the rest
        of a row starts a new one. The grid draws nothing of its own.
      </p>
      <p>
        Every value can be a number or an object with a value per breakpoint: <code>default</code>, <code>xxs</code>{' '}
        (465 pixels), <code>xs</code> (688), <code>s</code> (912), <code>m</code> (1120), <code>l</code> (1280) and{' '}
        <code>xl</code> (1840). Breakpoints compare against the width of the grid itself, not the window, and one
        without a value takes the next smaller one.
      </p>
    </>
  ),
  examples: [
    {
      id: 'responsive',
      title: 'Main and side',
      description: (
        <p>
          The most common grid: a wide section and a narrow one side by side, stacked when the grid is narrower than
          688 pixels.
        </p>
      ),
    },
    {
      id: 'spans',
      title: 'Spans and offsets',
      description: (
        <p>
          <code>colspan</code> sets how many columns a child takes, and <code>offset</code> leaves columns empty
          before it. Rows wrap when the next child does not fit.
        </p>
      ),
    },
    {
      id: 'push-pull',
      title: 'Push and pull',
      description: (
        <p>
          <code>push</code> and <code>pull</code> move a child along the row without moving the others. Here the side
          note comes second in reading order, and first on the row at wide widths.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For columns of different widths, such as a main section and a side section.',
      'When the arrangement should change at given widths.',
    ],
    avoid: [
      <>
        For equal columns. Use a <a href="#/components/column-layout">ColumnLayout</a>, which also draws rules
        between them.
      </>,
      <>
        For a single row or column of items with even gaps. Use{' '}
        <a href="#/components/space-between">SpaceBetween</a>.
      </>,
      'Push and pull to change the meaning of the order. Screen readers and keyboards follow the source order.',
    ],
  },
  accessibility: [
    'Children are read and focused in source order, whatever their visual position. Put the content in the order it should be read, and use push and pull only for visual arrangement.',
    'Give gridDefinition one entry per child; the grid warns in the console when the counts differ.',
  ],
  related: ['column-layout', 'space-between', 'container'],
};

export default doc;
