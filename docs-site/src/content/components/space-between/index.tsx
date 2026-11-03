// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'SpaceBetween',
  folder: 'space-between',
  group: 'layout',
  summary: 'Puts the same space between items in a column or a row.',
  description: (
    <>
      <p>
        Space between stacks its children in a column, or lays them in a row that wraps, with one of eight sizes of
        space between them, from <code>xxxs</code> to <code>xxl</code>. The sizes are spacing tokens, so they follow the
        revision. It draws nothing.
      </p>
      <p>
        Each child takes its own slot, including each child of a fragment. <code>null</code>, <code>false</code> and{' '}
        <code>undefined</code> children are left out, and a child that renders nothing takes no space, so you can write
        conditions inline.
      </p>
    </>
  ),
  examples: [
    {
      id: 'stack',
      title: 'Sections of a page',
      description: (
        <p>
          The most common use: the heading and sections of a page in a column, with <code>l</code> between them.
        </p>
      ),
    },
    {
      id: 'row',
      title: 'A row of items',
      description: (
        <p>
          <code>direction="horizontal"</code> lays the items in a row that wraps when it runs out of room. Use{' '}
          <code>xs</code> between buttons, and <code>alignItems="center"</code> to line up items of different heights.
        </p>
      ),
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: <p>Pick a size to compare the steps of the scale.</p>,
    },
  ],
  guidelines: {
    use: [
      'For the space between the parts of a page, a form or a group of buttons.',
      <>
        <code>xs</code> between buttons, <code>s</code> or <code>m</code> between related items, <code>l</code> between
        sections.
      </>,
    ],
    avoid: [
      'Margins or padding of your own between components. Space set here follows the revision.',
      <>
        For columns that should line up across rows. Use a <a href="#/components/column-layout">ColumnLayout</a> or a{' '}
        <a href="#/components/grid">Grid</a>.
      </>,
      <>
        For space around content. Use <a href="#/components/box">Box</a> with <code>padding</code> or{' '}
        <code>margin</code>.
      </>,
    ],
  },
  accessibility: [
    'Space between adds no roles, and items are read in source order. In a row that wraps, the visual order still follows the source.',
  ],
  related: ['box', 'column-layout', 'grid'],
};

export default doc;
