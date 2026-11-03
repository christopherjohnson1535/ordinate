// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'IndexList',
  folder: 'index-list',
  group: 'website-content',
  summary: 'Lists names against values, like a contents page, a price list or a project index.',
  description: (
    <>
      <p>
        An index list is a printed list of rows. The <code>leaders</code> variant joins each name to its value with a
        dotted line, as on a contents page or a price list, with a few words of detail under the name. The{' '}
        <code>numbered</code> variant sets each row in columns (number, name, details, value) with a hairline between
        rows, like the index of a portfolio. Numbers, names and values line up down the list whatever their length, and
        numbered rows stack their details under the name where the list is narrower than about 36 rem.
      </p>
      <p>
        A row with an <code>href</code> makes its name a link, and a click anywhere on the row follows it.{' '}
        <code>size="large"</code> sets the names in the style's headline type, for a list that is the main thing on
        the page.
      </p>
    </>
  ),
  examples: [
    {
      id: 'contents',
      title: 'Contents of an issue',
      description: (
        <p>
          <code>ordered</code> numbers the rows 1, 2, 3 and renders an ordered list. Each row links to its story and
          ends in its page number. Shown in the <code>editorial</code> style.
        </p>
      ),
    },
    {
      id: 'prices',
      title: 'A price list',
      description: (
        <p>
          Rows without links, with a note under one name. The second list uses <code>size="large"</code>. Shown in the{' '}
          <code>shopfront</code> style.
        </p>
      ),
    },
    {
      id: 'project-index',
      title: 'Project index',
      description: (
        <p>
          <code>numbered</code> sets the rows in columns with rules between them. <code>onFollow</code> receives the
          row's <code>id</code> and <code>href</code>; call <code>event.preventDefault()</code> to route on the client.
          The last row has no page yet, so it has no link.
        </p>
      ),
    },
    {
      id: 'own-numbers',
      title: 'Your own numbers',
      description: (
        <p>
          A row's <code>number</code> replaces the automatic one, here drawing numbers. Without <code>ordered</code>{' '}
          the list stays unordered and the numbers are read as part of each row.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the contents of a journal issue or a long article.',
      'For a price list that does not need groups.',
      'For an index of projects, clients or drawings, where a grid of pictures would be too much.',
    ],
    avoid: [
      <>
        For prices in groups, such as breakfast and lunch. Use a <a href="#/components/menu-tile">MenuTile</a> for each
        group.
      </>,
      <>
        For data people sort or filter. Use a <a href="#/components/table">Table</a>.
      </>,
      <>
        For rows with actions or icons in an application. Use a <a href="#/components/list">List</a>.
      </>,
      <>
        For pages a reader moves between in a site's navigation. Use the navigation of the{' '}
        <a href="#/components/site-header">SiteHeader</a>.
      </>,
    ],
    writing: [
      'Keep names short enough to fit on one line with their value.',
      'Use the same kind of value on every row: all page numbers, all prices or all years.',
      'Keep meta to a few words, such as the client or the kind of work.',
    ],
  },
  accessibility: [
    <>
      The list is a <code>ul</code>, or an <code>ol</code> with <code>ordered</code>, so screen readers announce the
      number of rows and each row's position.
    </>,
    <>
      Give the list an <code>ariaLabel</code>, such as "Contents", unless a visible heading right above it already
      names it.
    </>,
    'Automatic numbers are hidden from screen readers, because the ordered list already announces each position. Numbers you set on a row are read.',
    'The dotted leaders are hidden from screen readers.',
    'A row with an href has one link, named by the row’s name. The whole row is clickable with a pointer.',
  ],
  related: ['menu-tile', 'story-card', 'plate', 'list'],
};

export default doc;
