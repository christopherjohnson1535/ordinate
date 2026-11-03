// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TableRoot',
  folder: 'table-root',
  group: 'collections',
  summary: 'The outer part of a table you build yourself from rows and cells, when Table does not fit.',
  description: (
    <>
      <p>
        TableRoot renders a <code>&lt;table&gt;</code> drawn as a schedule, the same drawing Table uses: a caption in
        small mono capitals, column labels over an ink rule and hairlines between rows. It holds a{' '}
        <a href="#/components/table-head">TableHead</a> and a <a href="#/components/table-body">TableBody</a>, which
        hold <a href="#/components/table-row">TableRow</a>s of{' '}
        <a href="#/components/table-header-cell">TableHeaderCell</a>s and{' '}
        <a href="#/components/table-body-cell">TableBodyCell</a>s. The settings that apply to every cell, such as
        density, striping, wrapping and layout, are set here once and reach the cells through context.
      </p>
      <p>
        Table is built from these same parts. Reach for them when you need what the column definitions cannot give you:
        a row that spans columns, rows grouped under subheadings, a small fixed table inside other content, or cells
        whose behavior you decide row by row. You then write sorting, selection and resizing yourself, wiring each cell
        to your own state. TableRoot draws no sheet, header area, count, filter or pagination.
      </p>
    </>
  ),
  marks: ['M6', 'M11'],
  examples: [
    {
      id: 'parts-list',
      title: 'A table from parts',
      description: (
        <p>
          The smallest table: a root with a caption, one header row and a row per item. Set the same{' '}
          <code>contentType</code> on a column&apos;s header cell and body cells so figures and their heading line up.
        </p>
      ),
    },
    {
      id: 'density-and-stripes',
      title: 'Density, stripes and wrapping',
      description: (
        <p>
          <code>contentDensity=&quot;compact&quot;</code> tightens the rows, <code>stripedRows</code> shades every
          second row and <code>wrapLines</code> lets long text wrap instead of scrolling sideways.
        </p>
      ),
    },
    {
      id: 'sticky-header',
      title: 'Sticky header in a scrolling area',
      description: (
        <p>
          <code>stickyHeader</code> keeps the header row in view inside the nearest scrolling container, or the page
          when there is none.
        </p>
      ),
      height: 'medium',
    },
    {
      id: 'one-page-of-many',
      title: 'One page of a longer list',
      description: (
        <p>
          When the table shows part of the data, set <code>ariaRowcount</code> to every row plus the header, and give
          each row its <code>ariaRowindex</code>. <code>layout=&quot;fixed&quot;</code> keeps the columns from moving as
          pages change.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a table whose structure the column definitions cannot describe: spanning cells, grouped rows, mixed row types.',
      'For a small fixed table in running content, such as a parts list or a schedule of materials.',
      'When you build your own collection component on top of the schedule drawing.',
    ],
    avoid: [
      <>
        For a list of items with sorting, selection, filtering or paging. Use <a href="#/components/table">Table</a>,
        which wires those up for you.
      </>,
      <>
        For a few labeled values of one item. Use <a href="#/components/key-value-pairs">KeyValuePairs</a>.
      </>,
      'For page layout. A table is for data in rows and columns.',
    ],
    writing: [
      'Write the caption as the title of the schedule, "Parts list" or "Drawing register", in sentence case.',
      'Put units in the column heading, "Density (g/cm³)", not in every cell.',
    ],
  },
  accessibility: [
    <>
      The parts render native table elements: <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>,{' '}
      <code>&lt;tbody&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code> and <code>&lt;td&gt;</code>.
    </>,
    <>
      The <code>caption</code> names the table. Without one, set <code>ariaLabel</code>, or <code>ariaLabelledby</code>{' '}
      to point at a visible heading.
    </>,
    'When the table is wider than its wrapper, the wrapper becomes a focusable region with the table’s name, so keyboard users can scroll it sideways.',
    <>
      For a partial list, <code>ariaRowcount</code> and each row&apos;s <code>ariaRowindex</code> let screen readers say
      where a row sits in the whole data set.
    </>,
    'The parts add no keyboard handling of their own beyond what each cell provides; tabbing moves through the links, buttons and controls in the cells.',
  ],
  related: ['table', 'table-head', 'table-body', 'table-row', 'table-header-cell', 'table-body-cell'],
};

export default doc;
