// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TableBodyCell',
  folder: 'table-body-cell',
  group: 'collections',
  summary: 'A cell of a table built from parts: data, a row heading, a circled row tag or a selection control.',
  description: (
    <>
      <p>
        TableBodyCell renders a <code>&lt;td&gt;</code>, or a <code>&lt;th scope=&quot;row&quot;&gt;</code> with{' '}
        <code>isRowHeader</code>, inside a <a href="#/components/table-row">TableRow</a> of a{' '}
        <a href="#/components/table-body">TableBody</a>. Its <code>contentType</code> sets the lettering: the body face
        for text, mono for identifiers, and mono with even figures aligned to the end for numbers.
      </p>
      <p>
        The same cell has two special forms. With <code>rowTag</code> it draws a short reference such as P2 in a circle,
        in a narrow column ruled off in ink. With <code>selectionType</code> it holds a checkbox or radio button, and a
        click anywhere in the cell counts. <a href="#/components/table">Table</a> renders these cells from its column
        definitions, <code>rowTag</code> and <code>selectionType</code>; use them directly only when you build the table
        from parts.
      </p>
    </>
  ),
  marks: ['M6', 'M8'],
  examples: [
    {
      id: 'content-types',
      title: 'Content types',
      description: (
        <p>
          <code>text</code> is the default. Use <code>identifier</code> for IDs and codes and <code>number</code> for
          figures, and give the column&apos;s header cell the same <code>contentType</code>.
        </p>
      ),
    },
    {
      id: 'row-tags-and-selection',
      title: 'Row tags and selection',
      description: (
        <p>
          A tag cell needs a header cell with <code>rowTagColumn</code>; a selection cell needs one with the same{' '}
          <code>selectionType</code>. <code>onSelectionChange</code> reports the requested state and whether Shift was
          held, for range selection.
        </p>
      ),
    },
    {
      id: 'spanning-and-alignment',
      title: 'Spanning and alignment',
      description: (
        <p>
          <code>colSpan</code> lets a note run across the row. <code>verticalAlign=&quot;top&quot;</code> keeps cells
          level with the first line when another cell in the row wraps.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For every cell of a body row of a TableRoot.',
      'With isRowHeader on the one cell that names the item, usually its name or title.',
      'With rowTag when a split panel, note or drawing elsewhere on the page refers to the row.',
    ],
    avoid: [
      <>
        Wiring selection cells by hand for an ordinary list of items. Use <a href="#/components/table">Table</a>, which
        handles select-all, Shift ranges and disabled rows.
      </>,
      'Number formatting in the cell content to fake alignment. Set contentType="number" instead.',
      'Row tags that come from the row position. Derive them from the item so they stay put when rows move.',
    ],
    writing: [
      'Keep tags to a letter and a number, such as S1 or P12.',
      'Format figures the same way down a column, with the same number of decimals.',
    ],
  },
  accessibility: [
    <>
      With <code>isRowHeader</code> the cell is a <code>&lt;th scope=&quot;row&quot;&gt;</code>, so screen readers
      announce it while moving through the other cells of the row.
    </>,
    <>
      A selection cell holds a native checkbox or radio button, named &quot;Select row&quot; unless you set{' '}
      <code>selectionAriaLabel</code>. Name it after the item: &quot;Select Base plate&quot;.
    </>,
    <>
      For single selection, give every selection cell of the table the same <code>selectionName</code> so they form one
      radio group and the arrow keys move between them.
    </>,
    'A row tag is plain text in the cell, read once by screen readers.',
  ],
  related: ['table-header-cell', 'table-row', 'table-root', 'table'],
};

export default doc;
