// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TableHead',
  folder: 'table-head',
  group: 'collections',
  summary: 'The header part of a table you build from parts, holding the row of column headings.',
  description: (
    <>
      <p>
        TableHead renders a <code>&lt;thead&gt;</code>. Place it first inside a{' '}
        <a href="#/components/table-root">TableRoot</a> and give it one <a href="#/components/table-row">TableRow</a> of{' '}
        <a href="#/components/table-header-cell">TableHeaderCell</a>s. The row is ruled off from the body by the ink
        rule of the schedule, and the column labels are set in small mono capitals.
      </p>
      <p>
        Rows inside TableHead are header rows: they are never striped, raised on hover or drawn as picked. TableRoot
        moves the whole head when <code>stickyHeader</code> is on. If you need a table of items with sorting and
        selection wired up, use <a href="#/components/table">Table</a>, which builds its head for you.
      </p>
    </>
  ),
  examples: [
    {
      id: 'header-row',
      title: 'Header row',
      description: (
        <p>
          One header cell per column, in the order of the body cells. A header cell with{' '}
          <code>contentType=&quot;number&quot;</code> lines up with the figures below it.
        </p>
      ),
    },
    {
      id: 'control-columns',
      title: 'Tag and selection columns',
      description: (
        <p>
          Columns that hold row tags or selection controls need a heading too, so every row has the same number of
          cells. The selection heading holds the select-all checkbox.
        </p>
      ),
    },
  ],
  guidelines: {
    use: ['Once per TableRoot, before TableBody, holding a single row of TableHeaderCells.'],
    avoid: [
      <>
        For a table of items with sorting or selection you do not need to control cell by cell. Use{' '}
        <a href="#/components/table">Table</a>.
      </>,
      'For a title above the table. Use the caption of TableRoot.',
    ],
  },
  accessibility: [
    <>
      The head is a native <code>&lt;thead&gt;</code>, and its cells are <code>&lt;th scope=&quot;col&quot;&gt;</code>,
      so screen readers announce each column heading with the cells below it.
    </>,
  ],
  related: ['table-root', 'table-header-cell', 'table-row', 'table-body', 'table'],
};

export default doc;
