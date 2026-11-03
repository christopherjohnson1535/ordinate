// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'List',
  folder: 'list',
  group: 'collections',
  summary:
    'Shows a short run of items, one row each, with an icon, a second line and actions, and lets the user reorder them.',
  description: (
    <>
      <p>
        A list is ruled off like the lines of a schedule: rows are split by hairlines and nothing else. Each row has its
        main text in ink, an optional second line in gray, an optional icon before them and controls at the end.
      </p>
      <p>
        <code>renderItem</code> turns each item into a row and must give it an <code>id</code> that stays the same for
        the item. With <code>sortable</code>, every row gets buttons that move it up or down; the order is yours to
        keep, in <code>onSortingChange</code>.
      </p>
    </>
  ),
  examples: [
    {
      id: 'basic',
      title: 'Items with a second line and actions',
      description: (
        <p>
          A row can carry an icon, a <code>secondaryContent</code> line and <code>actions</code>, such as an icon button
          that removes the item.
        </p>
      ),
    },
    {
      id: 'sortable',
      title: 'Reordering',
      description: (
        <p>
          A sortable list is an ordered list unless <code>tagOverride</code> says otherwise. Each row has a move up and
          a move down button, and focus follows the row that moved.
        </p>
      ),
    },
    {
      id: 'ordered',
      title: 'Steps in order',
      description: (
        <p>
          <code>tagOverride="ol"</code> makes a list ordered without making it sortable, for steps or a ranking whose
          order matters. Rows are not numbered on screen, so let the content say the order where the reader needs it.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a short list of items that each fit on one or two lines, such as the stages of a project or the members of a group.',
      'When the user sets an order by hand, such as a deployment sequence or the priority of rules.',
    ],
    avoid: [
      <>
        For many items with several properties each, or items the user filters and pages. Use a{' '}
        <a href="#/components/table">Table</a> or <a href="#/components/cards">Cards</a>.
      </>,
      <>
        For the values a user has picked in a control. Use a <a href="#/components/token-group">TokenGroup</a>.
      </>,
      <>
        For links that make up the navigation of a page. Use <a href="#/components/side-navigation">SideNavigation</a>.
      </>,
    ],
    writing: [
      'Keep the main text to the item’s name, and put details such as dates and owners in the second line.',
      'Name the list with ariaLabel when there is no visible heading that does.',
      'In sortable lists, override the move button names with i18nStrings only to translate them; the row’s content already names each pair.',
    ],
  },
  accessibility: [
    <>
      The list is a native <code>ul</code>, or <code>ol</code> when it is sortable or <code>tagOverride="ol"</code>, so
      screen readers announce how many items it has. Name it with <code>ariaLabel</code>.
    </>,
    'In a sortable list each row’s move buttons are a group named by the row’s main text, so they read as, for example, "Measured survey, Move up".',
    'The move up button of the first row and the move down button of the last row are disabled.',
    'After a move, focus goes back to the same button on the moved row, or to its other button once the row reaches an end.',
    'Icons are drawing unless you give them an ariaLabel. Give icon buttons in actions an ariaLabel that names the item.',
  ],
  related: ['table', 'cards', 'token-group', 'collection-preferences'],
};

export default doc;
