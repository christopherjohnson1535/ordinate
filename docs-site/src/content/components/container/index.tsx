// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Container',
  folder: 'container',
  group: 'layout',
  summary: 'Groups the content of one section of a page under a heading, with its actions and a measure of what it holds.',
  description: (
    <>
      <p>
        A container is drawn like a detail on a drawing, not as a box. A construction line runs along its top and down
        the side of the content, past the corners, with a hash mark wherever a line ends. The heading, reference and
        description sit in a margin column to the start of that line, and the content to the end of it. Below 688
        pixels the margin stacks above the content and the side line is left out.
      </p>
      <p>
        <code>kind</code> says what the section holds and colors its lines, hash marks, reference and dimension line:
        configuration blue, resource teal, policy plum or neutral graphite. <code>measure</code> sets a dimension line
        on the top construction line with a count of what is inside, such as “8 nodes”.
      </p>
    </>
  ),
  marks: ['M1', 'M2', 'M3', 'M4', 'M8'],
  examples: [
    {
      id: 'section',
      title: 'A section of a page',
      description: (
        <p>
          The usual container: a reference and a heading in the margin, a description under them, a measure on the top
          line, the section’s actions at the top of the content and a footer under a hash-marked rule.
        </p>
      ),
    },
    {
      id: 'kinds',
      title: 'Kinds and references',
      description: (
        <p>
          Give each section the kind of what it holds, and a reference whose letter says the same thing: C for
          configuration, R for resource, P for policy. The letter carries the meaning for anyone who cannot tell the
          colors apart, and other parts of the page can point back to the section with it.
        </p>
      ),
    },
    {
      id: 'measure',
      title: 'Measure and actions',
      description: (
        <p>
          The measure is a count of what the section holds, set on a dimension line. Keep it up to date with the
          content: attach and detach volumes and the measure follows.
        </p>
      ),
    },
    {
      id: 'without-margin',
      title: 'Without a margin',
      description: (
        <p>
          With no heading, reference or description, the margin column and the side line are left out and the content
          takes the full width. Use it under a <code>Header</code> that already names the section.
        </p>
      ),
    },
    {
      id: 'fit-height',
      title: 'Same height in a row',
      description: (
        <p>
          <code>fitHeight</code> makes a container fill the height of its parent, so sections side by side in a{' '}
          <code>Grid</code> line up at the bottom. Content longer than the parent scrolls inside the container.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For each section of a details page, settings page or dashboard: one container per thing the reader might look for.',
      'With a kind and a reference when a page holds sections of different kinds, so readers can tell settings from resources from rules.',
      'With a measure when the section holds a countable set, such as nodes, rules or volumes.',
    ],
    avoid: [
      <>
        Containers inside containers. Use a <a href="#/components/header">Header</a> with the <code>h3</code> variant
        or a <a href="#/components/column-layout">ColumnLayout</a> to divide one section.
      </>,
      <>
        For a list of similar items the user picks from. Use <a href="#/components/cards">Cards</a> or a{' '}
        <a href="#/components/table">Table</a>.
      </>,
      'Kind colors as decoration. Leave a section neutral when it holds a mix, or nothing in particular.',
      <>
        For content that can be shown and hidden. Use an{' '}
        <a href="#/components/expandable-section">ExpandableSection</a>.
      </>,
    ],
    writing: [
      'Name the section with a noun: "Environment", "Volumes", not "Configure your environment".',
      'Keep references short and stable: a letter for the kind and a number, such as C1 or R2.',
      'Write the measure as a count with its noun, "4 volumes", and update it with the content.',
      'Use the description for one sentence of context. Put instructions next to the fields they are about.',
    ],
  },
  accessibility: [
    <>
      With a <code>heading</code>, the container is a <code>&lt;section&gt;</code> labelled by its heading, so it
      appears as a region in the screen reader’s landmarks. Without one it is a plain <code>&lt;div&gt;</code>.
    </>,
    <>
      The heading is an <code>h2</code> by default. Set <code>headingLevel</code> to keep the page’s outline in order,
      for example 3 for containers under an <code>h2</code>.
    </>,
    'The construction lines, hash marks and dimension rules are drawing only and hidden from screen readers. The reference, the measure label and the footer are read as text.',
    'The kind is shown by color and by the reference letter. Give a reference whenever the kind matters to the reader.',
    <>
      Content of a <code>fitHeight</code> container that overflows scrolls inside it. Make sure that content holds
      something focusable, or keep it short enough to fit, so keyboard users can reach all of it.
    </>,
  ],
  related: ['header', 'key-value-pairs', 'column-layout', 'content-layout', 'expandable-section'],
};

export default doc;
