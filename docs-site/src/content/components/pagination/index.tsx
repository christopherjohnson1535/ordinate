// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Pagination',
  folder: 'pagination',
  group: 'navigation',
  summary: 'Moves through a long collection one page at a time.',
  description: (
    <>
      <p>
        Pagination letters its pages in mono, like the sheet numbers of a drawing set: under 100 pages every number
        takes two digits, so the buttons keep one width. Crop marks stand at the corners of the current page and slide
        to the next one. The buttons have no edge or fill of their own.
      </p>
      <p>
        The row always holds the same number of slots. The first page, the current page and its neighbours are always
        shown, with an ellipsis for the pages left out, so the arrows stay put as the current page moves. The component
        is controlled: keep <code>currentPageIndex</code> in state and update it from <code>onChange</code>.
      </p>
    </>
  ),
  marks: ['M5'],
  examples: [
    {
      id: 'basic',
      title: 'Pages of a list',
      description: (
        <p>
          Twelve pages, with the current one in the middle. Name the buttons after what they page through with{' '}
          <code>ariaLabels</code>.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'page-label',
      title: 'Page label',
      description: (
        <p>
          <code>showPageLabel</code> sets the current page in small mono capitals before the numbers, like the sheet
          number in a title block. The text is the current page&rsquo;s <code>pageLabel</code>, so &ldquo;Sheet 7 of
          24&rdquo; here.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'open-end',
      title: 'An open end',
      description: (
        <p>
          For data that loads page by page, <code>openEnd</code> puts an ellipsis after the last known page and keeps
          the next button enabled on it. There <code>onNextPageClick</code> reports that the requested page is not
          available: load it, then raise <code>pagesCount</code>. <code>disabled</code> holds the buttons meanwhile.
        </p>
      ),
    },
    {
      id: 'with-table',
      title: 'In a table',
      description: (
        <p>
          Pass the pagination to the table&rsquo;s <code>pagination</code> slot, which places it at the end of the row
          under the header, and show the slice of items for the current page.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a table, a set of cards or a list that is too long for one screen and that the user reads in order.',
      'When the user needs to come back to the same place, such as page 4 of a log.',
    ],
    avoid: [
      'For fewer than about 20 items. Show them all.',
      <>
        For moving between sections of one page. Use <a href="#/components/anchor-navigation">AnchorNavigation</a> or{' '}
        <a href="#/components/tabs">Tabs</a>.
      </>,
      <>
        For steps the user completes in order. Use a <a href="#/components/wizard">Wizard</a>.
      </>,
    ],
    writing: [
      'Name the arrow buttons and pages after what they page through: "Next page of bookings", not just "Next".',
      'Keep a page label short, such as "Sheet 7 of 24".',
    ],
  },
  accessibility: [
    <>
      The pages are a list of native buttons named by <code>ariaLabels</code>, &ldquo;Page 3 of 12&rdquo; by default.
      The current page carries <code>aria-current=&quot;true&quot;</code>.
    </>,
    'The previous and next buttons are disabled at the ends, and every button is disabled while disabled is set.',
    'The ellipses are drawing only and hidden from screen readers.',
    'After the page changes, the list above it changes too. Keep focus on the pagination, and say how many items the new page holds if that is not plain from the list.',
  ],
  related: ['table', 'cards', 'collection-preferences', 'text-filter'],
};

export default doc;
