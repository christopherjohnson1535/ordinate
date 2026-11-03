// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'KeyValuePairs',
  folder: 'key-value-pairs',
  group: 'content',
  summary: 'Lists the properties of one thing as labels and values, in up to four columns.',
  description: (
    <>
      <p>
        Key-value pairs borrow Container’s margin at a small scale. Each label is set right-aligned in a margin column
        against a faint construction line, with its value to the right in ink. Rows meet edge to edge, so the line runs
        unbroken down each column.
      </p>
      <p>
        <code>columns</code> is the most columns the list may take. Columns drop away as the space narrows, so every
        column stays wide enough to read. A group of pairs under a title takes one cell of the grid.
      </p>
    </>
  ),
  marks: ['M4', 'M1'],
  examples: [
    {
      id: 'details',
      title: 'Details of a resource',
      description: (
        <p>
          The usual place for pairs is the details section of a page. Values can be more than text: a status, a link, a
          copyable ID or a progress bar with its <code>key-value</code> variant.
        </p>
      ),
    },
    {
      id: 'groups',
      title: 'Groups',
      description: (
        <p>
          Give an item <code>type: 'group'</code> to stack related pairs under a title in one cell.
        </p>
      ),
    },
    {
      id: 'columns',
      title: 'Columns',
      description: (
        <p>
          Pairs fill the columns in reading order, row by row. Narrow the window and the list drops columns before any
          of them gets too narrow.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the properties of one resource, such as its ID, state, region and owner.',
      'For a short summary at the top of a details page or in a review step.',
    ],
    avoid: [
      <>
        For many items with the same properties. Use a <a href="#/components/table">Table</a>.
      </>,
      <>
        For values people edit. Use a <a href="#/components/form-field">FormField</a> for each, which keeps the same
        margin layout.
      </>,
      'Long paragraphs as values. Link to them instead.',
    ],
    writing: [
      'Keep labels to a few words, in sentence case, without a colon.',
      'Write a dash or "None" for an empty value, so the row does not read as missing.',
      'Put the most important pairs first; they come first in reading order at every width.',
    ],
  },
  accessibility: [
    <>
      The list is a <code>&lt;dl&gt;</code>: each label is a <code>&lt;dt&gt;</code> and each value a{' '}
      <code>&lt;dd&gt;</code>. A group is a term whose description is a nested list, so the markup stays valid at every
      level.
    </>,
    <>
      Name the list with <code>ariaLabel</code>, or with <code>ariaLabelledby</code> pointing at a heading on the page.
    </>,
    <>
      Give a pair an <code>id</code> when another element, such as a progress bar in its value, needs to refer to its
      label.
    </>,
  ],
  related: ['container', 'form-field', 'table', 'status-indicator'],
};

export default doc;
