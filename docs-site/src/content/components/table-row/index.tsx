// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TableRow',
  folder: 'table-row',
  group: 'collections',
  summary: 'A row of a table built from parts, which can be drawn as picked or answer a click.',
  description: (
    <>
      <p>
        TableRow renders a <code>&lt;tr&gt;</code>. In a <a href="#/components/table-head">TableHead</a> it holds{' '}
        <a href="#/components/table-header-cell">TableHeaderCell</a>s; in a{' '}
        <a href="#/components/table-body">TableBody</a> it holds{' '}
        <a href="#/components/table-body-cell">TableBodyCell</a>s, and it is drawn as an item: hairlines between rows, a
        raised grey background under the pointer and a shade on every second row when the root is striped.
      </p>
      <p>
        A <code>selected</code> body row is picked for an action: it is raised and an ink rule runs down its leading
        edge. The row does not draw a checked key of its own, so pair it with a selection cell that shows and announces
        the state. <a href="#/components/table">Table</a> sets all of this from its <code>selectionType</code> and{' '}
        <code>selectedItems</code>; use TableRow directly only when you build the table from parts.
      </p>
    </>
  ),
  marks: ['M11'],
  examples: [
    {
      id: 'picked-rows',
      title: 'Picked rows',
      description: (
        <p>
          Set <code>selected</code> on the row and on its selection cell together. Here a single selection column picks
          the request to answer.
        </p>
      ),
    },
    {
      id: 'clickable-rows',
      title: 'Clickable rows',
      description: (
        <p>
          <code>onClick</code> fires for a click anywhere in the row, including on content inside its cells, and shows a
          pointer cursor. Give the row a link or button too, since a row cannot take keyboard focus.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For each row of a TableRoot, in the head and in the body.',
      'With selected to show a row picked for an action, next to a selection cell in the same row.',
    ],
    avoid: [
      'Selected without a selection cell: the raised row alone is not announced and has no key.',
      'A row click as the only way to an action. Keep a link or button in the row.',
      <>
        Building rows by hand for an ordinary list of items. Use <a href="#/components/table">Table</a>.
      </>,
    ],
  },
  accessibility: [
    <>
      The row is a native <code>&lt;tr&gt;</code>. <code>selected</code> changes only how it is drawn; the checkbox or
      radio button of its selection cell carries the state for screen readers.
    </>,
    <>
      The row cannot take focus, and <code>onClick</code> is reached with a pointer only. Put the same action on a link
      or button inside the row.
    </>,
    <>
      When the table shows part of the data, set <code>ariaRowindex</code> on every row, counting the header row as 1,
      together with <code>ariaRowcount</code> on <a href="#/components/table-root">TableRoot</a>.
    </>,
  ],
  related: ['table-root', 'table-body-cell', 'table-body', 'table'],
};

export default doc;
