// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Header',
  folder: 'header',
  group: 'content',
  summary: 'Names a page or a section, with its count, an info link, a description and its actions.',
  description: (
    <>
      <p>
        A header is a heading row: the heading text and an optional <code>counter</code>, an <code>info</code> link
        after it, and <code>actions</code> at the end of the row. A <code>description</code> sits under it in
        secondary ink.
      </p>
      <p>
        The <code>h1</code> variant is a sheet heading, large and light. A <code>code</code> sets a short reference
        above the heading in small mono capitals, like the sheet number of a drawing.
      </p>
    </>
  ),
  marks: ['M8'],
  examples: [
    {
      id: 'actions',
      title: 'Counter, info and actions',
      description: (
        <p>
          The most common header: a section name with a count of what it holds, an info link and the section’s
          actions at the end of the row.
        </p>
      ),
    },
    {
      id: 'variants',
      title: 'Variants',
      description: (
        <p>
          <code>h1</code> is for the page title, <code>h2</code> for containers and modals, <code>h3</code> for
          sections inside a container.
        </p>
      ),
    },
    {
      id: 'sheet-code',
      title: 'Sheet code',
      description: (
        <p>
          <code>code</code> names the sheet above its title. It is not part of the heading’s text, so screen readers
          read the title alone as the heading.
        </p>
      ),
    },
    {
      id: 'heading-level',
      title: 'Heading level',
      description: (
        <p>
          <code>headingTagOverride</code> changes the element without changing the look, to keep the page outline in
          order.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the title of a page, with the h1 variant.',
      'For the heading of a container, modal or form section, with its actions.',
      'With a counter, for a section that holds a list of things.',
    ],
    avoid: [
      <>
        For a heading inside running text. Use <a href="#/components/text-content">TextContent</a> or a{' '}
        <a href="#/components/box">Box</a> heading variant.
      </>,
      'More than one h1 header on a page.',
      <>
        More than three actions. Put the rest in a <a href="#/components/button-dropdown">ButtonDropdown</a>.
      </>,
    ],
    writing: [
      'Name the thing, as a noun: "Nodes", "Service schedule".',
      'Write the counter in brackets: "(12)". When only some items are shown, say how many of how many: "(3/12)".',
      'Keep the description to one sentence that says what the section holds or why it matters.',
    ],
  },
  accessibility: [
    <>
      The heading is a real <code>h1</code>, <code>h2</code> or <code>h3</code>, set by <code>variant</code>. Use{' '}
      <code>headingTagOverride</code> to keep the levels in order; <code>div</code> removes the heading.
    </>,
    'The counter is inside the heading element, so screen readers read it with the heading text. The info link and the actions are outside it.',
    <>
      The <code>code</code> sits before the heading, outside it, so it is read before the heading and not as part of
      its name.
    </>,
  ],
  related: ['container', 'box', 'button', 'link'],
};

export default doc;
