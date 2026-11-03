// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TableBody',
  folder: 'table-body',
  group: 'collections',
  summary: 'The body part of a table you build from parts, holding the rows of data.',
  description: (
    <>
      <p>
        TableBody renders a <code>&lt;tbody&gt;</code>. Place it after <a href="#/components/table-head">TableHead</a>{' '}
        inside a <a href="#/components/table-root">TableRoot</a> and fill it with{' '}
        <a href="#/components/table-row">TableRow</a>s of <a href="#/components/table-body-cell">TableBodyCell</a>s.
        Rows inside it are item rows: they are split by hairlines, raised on hover, striped when the root asks for it
        and drawn as picked when <code>selected</code>.
      </p>
      <p>
        A table may hold several bodies, one per group of rows. When you only need a flat list of items with sorting,
        selection or paging, use <a href="#/components/table">Table</a>, which builds the body from its{' '}
        <code>items</code>.
      </p>
    </>
  ),
  examples: [
    {
      id: 'rows',
      title: 'Rows of data',
      description: <p>One body holding a row per item, in the order the cells of the head set out.</p>,
    },
    {
      id: 'grouped-rows',
      title: 'Grouped rows',
      description: (
        <p>
          Several bodies split the rows into groups. Each opens with a row whose single cell spans every column with{' '}
          <code>colSpan</code> and names the group. Leave stripes off here: the title row counts in the pattern.
        </p>
      ),
    },
  ],
  guidelines: {
    use: ['Once per group of rows inside a TableRoot, after the TableHead.'],
    avoid: [
      <>
        For a list of items that needs no custom row structure. Use <a href="#/components/table">Table</a>.
      </>,
    ],
  },
  accessibility: [
    <>
      The body is a native <code>&lt;tbody&gt;</code>. A group title spanning its row is read as an ordinary cell: mark
      the cells that name each item with <code>isRowHeader</code> so screen readers announce them with the row.
    </>,
  ],
  related: ['table-root', 'table-row', 'table-body-cell', 'table-head', 'table'],
};

export default doc;
