// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TreeView',
  folder: 'tree-view',
  group: 'navigation',
  summary: 'Shows nested items, such as folders and files, that the user expands and collapses.',
  description: (
    <>
      <p>
        A tree view links its nodes with faint construction lines: a line drops from each parent&rsquo;s toggle to its
        last child, with an elbow across to every child. The item the user is on, set with <code>currentItemId</code>,
        gets the position rule on its leading edge and its text turns ink.
      </p>
      <p>
        The tree takes your data as it is. <code>getItemId</code> and <code>getItemChildren</code> read the IDs and the
        children from your items, and <code>renderItem</code> says how each one looks. Keep <code>expandedItems</code>{' '}
        in state and update it from <code>onItemToggle</code>; without it the tree keeps its own state and starts
        collapsed.
      </p>
    </>
  ),
  marks: ['M1', 'M11'],
  examples: [
    {
      id: 'files',
      title: 'Folders of drawings',
      description: (
        <p>
          Each item has an icon, its name and a second line of <code>secondaryContent</code>. The expanded items are
          kept in state.
        </p>
      ),
    },
    {
      id: 'current-item',
      title: 'The current item',
      description: (
        <p>
          <code>currentItemId</code> marks the file open beside the tree. Open another file with its action button.
          Marking an item does not move focus or expand the folders above it, so expand them yourself.
        </p>
      ),
    },
    {
      id: 'actions',
      title: 'Actions and rich content',
      description: (
        <p>
          <code>actions</code> places controls at the end of a row. When <code>content</code> is more than text, give
          the item an <code>announcementLabel</code> for screen readers.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a hierarchy the user explores, such as a file system, a drawing set or the parts of a plant.',
      'When the user needs to see where an item sits among its parents and siblings.',
    ],
    avoid: [
      <>
        For the pages of an application. Use <a href="#/components/side-navigation">SideNavigation</a>.
      </>,
      <>
        For a flat list, or rows with many attributes to compare. Use a <a href="#/components/table">Table</a>.
      </>,
      'For a hierarchy only one or two levels deep, which reads better as grouped lists.',
    ],
    writing: [
      'Use the names the items have elsewhere in the application.',
      'Keep secondary content to a short fact, such as a count, a size or a revision.',
    ],
  },
  accessibility: [
    <>
      The tree follows the tree pattern: a <code>tree</code> of <code>treeitem</code> elements with their level,
      position and expanded state. Name it with <code>ariaLabel</code> or <code>ariaLabelledby</code>.
    </>,
    'The tree is one tab stop. Up and Down move between visible items, Home and End go to the first and last. Right expands an item or moves to its first child, Left collapses it or moves to its parent, and * expands all siblings. Left and Right follow the reading direction.',
    'Only the actions of the item that holds the tab stop are in the tab order.',
    <>
      The toggle buttons are named &ldquo;Expand&rdquo; or &ldquo;Collapse&rdquo; followed by the item&rsquo;s text, and
      can be renamed with <code>i18nStrings</code>. The current item carries <code>aria-current=&quot;true&quot;</code>.
    </>,
  ],
  related: ['side-navigation', 'table', 'navigable-group', 'expandable-section'],
};

export default doc;
