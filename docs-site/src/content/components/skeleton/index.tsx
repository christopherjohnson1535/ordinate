// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Skeleton',
  folder: 'skeleton',
  group: 'status',
  summary: 'Holds the place of content that is still loading, in roughly its shape.',
  description: (
    <>
      <p>
        A skeleton is drawn as construction lines where the text will land: a faint line between two end ticks for each
        line of text, shorter for the last line of a paragraph. The <code>block</code> variant is a faint frame crossed
        corner to corner, the drafting mark for a space kept for a picture. The lines breathe slowly while they wait.
      </p>
      <p>
        Wrap the content in the skeleton and set <code>loading</code>. While it is true the shapes stand in its place;
        when it turns false the content is shown and the skeleton adds no box of its own.
      </p>
    </>
  ),
  marks: ['M1'],
  examples: [
    {
      id: 'loading-a-section',
      title: 'Loading a section',
      description: (
        <p>
          The usual pattern: the content inside, <code>loading</code> from the request, and <code>lines</code> close to
          the length of the text that will arrive.
        </p>
      ),
    },
    {
      id: 'shapes',
      title: 'Shapes and sizes',
      description: (
        <p>
          <code>heading</code> and <code>text</code> lines, the four widths, and <code>block</code> in its three heights
          for images and charts.
        </p>
      ),
    },
    {
      id: 'details',
      title: 'Several skeletons in one region',
      description: (
        <p>
          Give the loading text to one skeleton and set it to an empty string on the others, so a screen reader hears
          &quot;Loading&quot; once.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For content that takes more than a moment to load and whose shape you know, such as a paragraph, a list of details or a chart.',
      'To keep the layout from jumping when the content arrives.',
    ],
    avoid: [
      <>
        For a whole table or a set of cards. Use their own <code>loading</code> state, as{' '}
        <a href="#/components/table">Table</a> does.
      </>,
      <>
        For a short wait on one control, such as a button. Use the button&apos;s <code>loading</code>, or a{' '}
        <a href="#/components/spinner">Spinner</a>.
      </>,
      'For content that failed to load. Replace the skeleton with a message that says so.',
    ],
    writing: ['Make loadingText say what is loading: "Loading usage", not just "Loading".'],
  },
  accessibility: [
    <>
      While loading, the region is marked <code>aria-busy=&quot;true&quot;</code>, the shapes are hidden from screen
      readers and <code>loadingText</code> is read in their place. It defaults to &quot;Loading&quot;.
    </>,
    'The content replaces the skeleton without being announced. If its arrival matters, say so in a LiveRegion.',
    'Under reduced motion the lines stop breathing.',
  ],
  related: ['spinner', 'progress-bar', 'live-region'],
};

export default doc;
