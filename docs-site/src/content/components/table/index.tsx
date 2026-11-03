// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Table',
  folder: 'table',
  group: 'collections',
  summary: 'Shows a set of items in rows and columns, with sorting, selection, filtering and paging.',
  description: (
    <>
      <p>
        A table is drawn as a schedule. A construction line in the color of its <code>kind</code> opens the sheet, and
        the item count from the header&apos;s <code>counter</code> stands on a dimension line under the heading. Column
        captions are small mono capitals over an ink rule, rows are split by hairlines, and columns are kept apart by
        space alone. The sorted column&apos;s caption turns ink and carries a small solid triangle. A row picked for an
        action is raised, shows its checked key and carries an ink rule on its leading edge.
      </p>
      <p>
        The table is controlled. It does not sort, filter or page its items: pass the items of the current page in the
        current order, and keep sorting and selection in state. <code>useCollection</code> from{' '}
        <code>@ordinate/collection-hooks</code> holds that state for you and returns props to spread onto the table, the
        filter and the pagination.
      </p>
    </>
  ),
  marks: ['M1', 'M2', 'M3', 'M6', 'M8', 'M11'],
  examples: [
    {
      id: 'basic',
      title: 'Schedule',
      description: (
        <p>
          Each column has a <code>header</code> and a <code>cell</code> function. Set <code>contentType</code> to{' '}
          <code>identifier</code> for names and codes and to <code>number</code> for figures, which are set in mono and
          aligned to the end. Mark the column that names each item with <code>isRowHeader</code>.
        </p>
      ),
    },
    {
      id: 'sorting',
      title: 'Sorting',
      description: (
        <p>
          A column with a <code>sortingField</code> or a <code>sortingComparator</code> is sortable. The first click
          sorts ascending and each further click reverses the order; <code>onSortingChange</code> reports the request,
          and you sort the items.
        </p>
      ),
    },
    {
      id: 'single-selection',
      title: 'Single selection',
      description: (
        <p>
          <code>selectionType=&quot;single&quot;</code> adds a column of radio buttons. Use it when an action works on
          one item, and put that action in the header. Clicking anywhere in the selection cell picks the row.
        </p>
      ),
    },
    {
      id: 'multi-selection',
      title: 'Multiple selection',
      description: (
        <p>
          <code>multi</code> adds checkboxes and a select-all box that checks every row on the page that can be picked.
          Shift-click picks or clears a range. <code>isItemDisabled</code> keeps rows out of the selection; say why in
          the row.
        </p>
      ),
    },
    {
      id: 'collection',
      title: 'Filtering, paging and preferences',
      description: (
        <p>
          A full collection with <code>useCollection</code>: a TextFilter, Pagination and CollectionPreferences in the
          tools row, with sorting and selection held by the hook. The preferences set the page size, striped rows and
          which columns show, through <code>columnDisplay</code>. Changing the filter, sorting or page clears the
          selection unless you set <code>selection.keepSelection</code>.
        </p>
      ),
    },
    {
      id: 'empty-and-loading',
      title: 'Empty and loading',
      description: (
        <p>
          <code>loading</code> replaces the rows with a loading message. With no items, the table shows{' '}
          <code>empty</code>: say what is missing and offer the action that adds the first item.
        </p>
      ),
    },
    {
      id: 'resizable-columns',
      title: 'Resizable columns',
      description: (
        <p>
          With <code>resizableColumns</code>, each heading has a handle at its end. The last column takes the remaining
          space. <code>onColumnWidthsChange</code> fires once the user lets go; store the widths in the column
          definitions to keep them.
        </p>
      ),
    },
    {
      id: 'sticky-header',
      title: 'Sticky header',
      description: (
        <p>
          <code>stickyHeader</code> keeps the column headings in view while the page, or a scrolling container, scrolls
          past them. Set <code>stickyHeaderVerticalOffset</code> to the height of a fixed bar above the content.
        </p>
      ),
      height: 'medium',
    },
    {
      id: 'row-tags',
      title: 'Row tags',
      description: (
        <p>
          <code>rowTag</code> draws a circled reference such as S1 in a narrow first column, so a split panel or a note
          can point at the row. Derive the tag from the item so it survives sorting and paging. <code>onRowClick</code>{' '}
          reports clicks anywhere in a row.
        </p>
      ),
    },
    {
      id: 'embedded',
      title: 'Inside a container',
      description: (
        <p>
          <code>variant=&quot;embedded&quot;</code> drops the sheet and the heavy rule, for a table that sits inside a
          Container. <code>wrapLines</code> lets long notes wrap instead of scrolling sideways.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For items people compare across the same attributes: services, instances, deployments, rules.',
      'When people act on items: pick one or several rows, then run an action from the header.',
      'With useCollection when the table needs filtering, sorting and paging on data held in the browser.',
    ],
    avoid: [
      <>
        For a few attributes of one item. Use <a href="#/components/key-value-pairs">KeyValuePairs</a>.
      </>,
      <>
        For items people browse by image or summary rather than compare. Use <a href="#/components/cards">Cards</a>.
      </>,
      <>
        For a table whose rows or cells need their own layout, such as a parts list inside a drawing. Build it from{' '}
        <a href="#/components/table-root">TableRoot</a> and the other table parts.
      </>,
      'Sorting, filtering or paging in the table itself: the table shows what it is given.',
    ],
    writing: [
      'Name columns with a noun in sentence case, and put the unit in the heading: "CPU (%)", "Duration (min)".',
      'Give the count as the header counter, "(38)", and with a selection "(2 of 38)".',
      'Word the empty state as what is missing, "No alarms", followed by the action that fixes it.',
      'Name the action after what it does to the picked rows: "Stop 3 instances", not "Apply".',
    ],
  },
  accessibility: [
    <>
      The table is a native <code>&lt;table&gt;</code>. The <code>caption</code> names it; without one, set{' '}
      <code>ariaLabels.tableLabel</code>.
    </>,
    <>
      Columns with <code>isRowHeader</code> render <code>&lt;th scope=&quot;row&quot;&gt;</code>, so screen readers
      announce the item&apos;s name while moving through its row.
    </>,
    <>
      Sortable headings are buttons, reached with Tab and pressed with Enter or Space, and the cell carries{' '}
      <code>aria-sort</code>.
    </>,
    <>
      Selection controls are a native checkbox or a radio group. Give each one a name with{' '}
      <code>ariaLabels.itemSelectionLabel</code>; the default is &quot;Select row&quot; and the row number.
    </>,
    'A resize handle is a focusable separator named after its column. The left and right arrow keys change the width 10 pixels at a time.',
    'When the table is wider than its frame, the scrolling area becomes focusable so keyboard users can scroll it sideways.',
    <>
      When the table shows one page of a longer list, set <code>firstIndex</code> and <code>totalItemsCount</code> so
      rows are announced with their place in the whole list, and use <code>renderAriaLive</code> to announce the change
      of page.
    </>,
    <>
      A row cannot take focus, so <code>onRowClick</code> is reached with a pointer only. Put the same action on a link
      or button in the row for keyboard users.
    </>,
  ],
  related: ['table-root', 'cards', 'text-filter', 'pagination', 'collection-preferences', 'property-filter'],
};

export default doc;
