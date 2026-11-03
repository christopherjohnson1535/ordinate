// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ButtonDropdown',
  folder: 'button-dropdown',
  group: 'actions',
  summary: 'Opens a menu of related actions from a single button.',
  description: (
    <>
      <p>
        The button is drawn like any other button, on its 2 px offset, and ends in a chevron. The menu drops from it as
        a plate on a 4 px offset. A group of items sits under a faint construction line across the menu, and the
        highlighted item is a raised row. Shortcuts and other <code>secondaryText</code> are lettered in mono.
      </p>
      <p>
        With a <code>mainAction</code> the button becomes a split button: the main action and a narrow arrow share one
        offset and press flat together. The menu is controlled by the component; you only handle{' '}
        <code>onItemClick</code>.
      </p>
    </>
  ),
  marks: ['M9', 'M13', 'M1', 'M7'],
  examples: [
    {
      id: 'basic',
      title: 'Menu of actions',
      description: (
        <p>
          Each item has an <code>id</code> that comes back in <code>onItemClick</code>. A disabled item stays in the
          menu, and its <code>disabledReason</code> shows when the item is highlighted.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'groups',
      title: 'Groups and checkbox items',
      description: (
        <p>
          Put items in a group to show them under a heading. A <code>checkbox</code> item turns a setting on or off:{' '}
          <code>event.detail.checked</code> is the state to set, so update <code>items</code> with it.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'split-button',
      title: 'Split button',
      description: (
        <p>
          A <code>mainAction</code> runs with one click, and the arrow beside it offers the alternatives. Give the arrow
          an <code>ariaLabel</code>, because it has no text. Only the <code>normal</code> and <code>primary</code>{' '}
          variants support it.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'icon-variants',
      title: 'Icon buttons',
      description: (
        <p>
          <code>icon</code> shows an ellipsis button with a frame, for a toolbar or a header. <code>inline-icon</code>{' '}
          is smaller and has no frame, for a row of a table or list.
        </p>
      ),
    },
    {
      id: 'links',
      title: 'Items that go somewhere',
      description: (
        <p>
          An item with an <code>href</code> renders a link. <code>onItemFollow</code> fires on a plain left click or
          Enter; call <code>preventDefault()</code> there to route on the client. An <code>external</code> item ends in
          a small leader and opens a new tab.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'expandable-groups',
      title: 'Expandable groups',
      description: (
        <p>
          With <code>expandableGroups</code>, each group is an entry that opens in place to show its items, like a
          sub-menu. Use it for a long menu with natural categories. A disabled group disables its items.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'For three or more related actions that would crowd the page as separate buttons.',
      'For the actions of a row in a table or list, with the inline-icon variant.',
      'As a split button, when one action is the usual choice and a few others are close variations of it.',
    ],
    avoid: [
      <>
        For choosing a value that stays visible, such as a region or a sort order. Use a{' '}
        <a href="#/components/select">Select</a>.
      </>,
      <>
        For one or two actions. Show them as <a href="#/components/button">Buttons</a>.
      </>,
      <>
        For a row of icon actions shown all at once. Use a <a href="#/components/button-group">ButtonGroup</a>.
      </>,
      'Hiding the single main action of a page in a menu.',
    ],
    writing: [
      'Name the button after what the menu holds, such as "Service actions" or "Export", or after the main action in a split button.',
      'Start each item with a verb: "Restart", "Download logs", "Change node count".',
      'Keep disabledReason to one sentence that says what to do: "Stop the service before you delete it."',
    ],
  },
  accessibility: [
    <>
      The button has <code>aria-haspopup="menu"</code> and <code>aria-expanded</code>. The menu is a <code>menu</code>{' '}
      labelled by the button, and items are <code>menuitem</code> or <code>menuitemcheckbox</code> with{' '}
      <code>aria-checked</code>.
    </>,
    'Enter, Space or the down arrow on the button opens the menu with focus on the first item; the up arrow opens it on the last. A mouse click opens it without highlighting an item.',
    'In the menu, the up and down arrows, Home and End move between items, and typing letters jumps to the next item that starts with them. Enter or Space chooses the item and returns focus to the button.',
    'Escape and Tab close the menu. Escape returns focus to the button and does not close a modal around it.',
    'With expandableGroups, the right arrow opens a group and the left arrow closes it or goes back to its group, following the reading direction.',
    <>
      Disabled items stay reachable with the arrow keys and are marked <code>aria-disabled</code>; the{' '}
      <code>disabledReason</code> is their accessible description.
    </>,
    <>
      The icon variants and the split button&apos;s arrow have no visible text. Set <code>ariaLabel</code>; without it
      they are named &ldquo;More actions&rdquo;.
    </>,
  ],
  related: ['button', 'button-group', 'select', 'dropdown'],
};

export default doc;
