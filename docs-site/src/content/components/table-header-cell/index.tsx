// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TableHeaderCell',
  folder: 'table-header-cell',
  group: 'collections',
  summary: 'A column heading in a table built from parts, which can sort, resize or hold the select-all box.',
  description: (
    <>
      <p>
        TableHeaderCell renders a <code>&lt;th scope=&quot;col&quot;&gt;</code> in the header row of a{' '}
        <a href="#/components/table-root">TableRoot</a>. The label is set in small mono capitals in a secondary ink. A
        cell with a <code>sortingState</code> becomes a sorting button: the sorted column&apos;s label turns ink and
        carries a small solid triangle, and an unsorted one shows an open triangle only while hovered or focused.
      </p>
      <p>
        The cell is controlled. It reports a requested sort, width or select-all through its events and changes only
        when you update its props. <a href="#/components/table">Table</a> does that wiring for every column from its
        column definitions; use this cell directly only when you build the table from parts.
      </p>
    </>
  ),
  marks: ['M6'],
  examples: [
    {
      id: 'sorting',
      title: 'Sorting',
      description: (
        <p>
          Give each sortable column a <code>sortingState</code>. <code>onSortingChange</code> asks for ascending on an
          unsorted or descending column and descending on an ascending one; sort the rows and update the states.
        </p>
      ),
    },
    {
      id: 'resizable',
      title: 'Resizable column',
      description: (
        <p>
          <code>resizable</code> adds a handle at the end of the cell. Use it in a root with{' '}
          <code>layout=&quot;fixed&quot;</code>, update <code>width</code> in <code>onResize</code> and save it in{' '}
          <code>onResizeEnd</code>. <code>minWidth</code> and <code>maxWidth</code> bound the drag.
        </p>
      ),
    },
    {
      id: 'selection-heading',
      title: 'Select-all heading',
      description: (
        <p>
          With <code>selectionType=&quot;multi&quot;</code> the cell holds the select-all checkbox: checked when every
          row that can be picked is, partly checked with <code>indeterminate</code> when some are. With{' '}
          <code>single</code> it shows nothing but names the column for screen readers.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For every column of the header row of a TableRoot, including the tag and selection columns.',
      'With a sortingState on the columns people order by; leave it off where order means nothing, such as notes.',
    ],
    avoid: [
      <>
        Wiring sorting, resizing and selection by hand for an ordinary list of items. Use{' '}
        <a href="#/components/table">Table</a>.
      </>,
      'Resizable cells in a root with the auto layout: widths there follow the content.',
    ],
    writing: [
      'Name the column with a short noun in sentence case. The cell sets it in capitals.',
      'Put the unit in brackets after the name: "Area (m²)".',
    ],
  },
  accessibility: [
    <>
      A sortable heading is a native button, reached with Tab and pressed with Enter or Space. The cell carries{' '}
      <code>aria-sort</code> of <code>ascending</code>, <code>descending</code> or <code>none</code>.
    </>,
    <>
      The resize handle is a focusable separator named after the column, with its width as <code>aria-valuenow</code>.
      The left and right arrow keys change the width 10 pixels at a time, mirrored in right-to-left layout.{' '}
      <code>resizerRoleDescription</code> replaces &quot;resize handle&quot;.
    </>,
    <>
      The select-all box is a native checkbox named &quot;Select all rows&quot; unless you set{' '}
      <code>selectionAriaLabel</code>.
    </>,
  ],
  related: ['table-root', 'table-head', 'table-body-cell', 'table'],
};

export default doc;
