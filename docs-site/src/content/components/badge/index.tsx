// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Badge',
  folder: 'badge',
  group: 'status',
  summary: 'Labels an item with a short word or number, such as a category or a severity.',
  description: (
    <>
      <p>
        A badge is set in small mono capitals in ink, with a key square before it like the key of a legend. The square
        carries the <code>tone</code>; the text never changes color.
      </p>
      <p>
        The status tones <code>note</code>, <code>complete</code> and <code>fault</code> share their colors with Alert
        and StatusIndicator. There is no <code>caution</code> or <code>underway</code> tone, because those describe how
        something is going rather than what it is: use a StatusIndicator for them. The severity scale,{' '}
        <code>critical</code>, <code>high</code>, <code>medium</code> and <code>low</code>, is also told by the fill of
        the square (solid, solid, half, open) and by bold type for critical, so the levels stay apart without color.
      </p>
    </>
  ),
  marks: ['M6'],
  examples: [
    {
      id: 'tones',
      title: 'Tones',
      description: (
        <p>
          <code>neutral</code>, the default, for plain labels and counts. <code>note</code>, <code>complete</code> and{' '}
          <code>fault</code> when the label says something is new, done or failed.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'severity',
      title: 'Severity scale',
      description: <p>The four levels of a severity scale. Each level has its own square, so it reads in grayscale.</p>,
      layout: 'centered',
    },
    {
      id: 'in-a-table',
      title: 'In a table',
      description: <p>Badges are short enough to scan down a column.</p>,
    },
  ],
  guidelines: {
    use: [
      'For a short, fixed label on an item: a category, a severity, a count.',
      'For a severity scale, with the four severity tones in order.',
    ],
    avoid: [
      <>
        For the state of something that changes, such as Running or Failed. Use a{' '}
        <a href="#/components/status-indicator">StatusIndicator</a>.
      </>,
      <>
        For a value the user can remove or pick. Use a <a href="#/components/token-group">TokenGroup</a>.
      </>,
      <>
        For a stamp of approval on a whole page or document. Use a <a href="#/components/stamp">Stamp</a>.
      </>,
    ],
    writing: [
      'Keep it to one word or a number. It is drawn in capitals, so write it in sentence case and let the style do the rest.',
      'Use the same word for the same thing everywhere in the product.',
    ],
  },
  accessibility: [
    'The badge is a plain span. Its text is read as written, so it must carry the meaning on its own.',
    'The key square is hidden from screen readers. Never let the color or the fill of the square be the only difference between two badges.',
  ],
  related: ['status-indicator', 'stamp', 'token-group'],
};

export default doc;
