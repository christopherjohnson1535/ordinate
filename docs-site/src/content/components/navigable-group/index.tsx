// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'NavigableGroup',
  folder: 'navigable-group',
  group: 'navigation',
  summary: 'Turns a set of controls into one tab stop that the arrow keys move through.',
  description: (
    <>
      <p>
        NavigableGroup adds keyboard behavior and draws nothing. Every focusable element inside it, such as a button or
        a link, becomes an item. Tab reaches one item, the arrow keys move between items, and Home and End jump to the
        ends. Lay out and style the children as you would without it.
      </p>
      <p>
        The group remembers which item holds the tab stop by the key that <code>getItemKey</code> returns, so the stop
        stays put while children are added, removed or disabled. Disabled and hidden elements are skipped, and so is
        anything inside a nested navigable group, which handles its own keys.
      </p>
    </>
  ),
  examples: [
    {
      id: 'toolbar',
      title: 'A toolbar',
      description: (
        <p>
          Give a row of actions <code>role=&quot;toolbar&quot;</code> and an <code>ariaLabel</code>. With{' '}
          <code>loopFocus</code>, moving past the last tool comes back to the first.
        </p>
      ),
    },
    {
      id: 'vertical-list',
      title: 'A vertical list of links',
      description: (
        <p>
          <code>vertical</code> moves with Up and Down. Without <code>loopFocus</code> focus stops at the ends.
        </p>
      ),
    },
    {
      id: 'changing-items',
      title: 'Items that change',
      description: (
        <p>
          Lock the sheet and the disabled buttons leave the group. The ref&rsquo;s <code>focus()</code> moves focus to
          the item that holds the tab stop, for a shortcut or after a dialog closes.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a toolbar, a row of filters or a list of links that the user would otherwise tab through one by one.',
      'When the controls belong together and the user usually acts on one of them, then moves on.',
    ],
    avoid: [
      <>
        For one choice from a set. Use a <a href="#/components/segmented-control">SegmentedControl</a> or{' '}
        <a href="#/components/radio-group">RadioGroup</a>, which bring this behavior with them.
      </>,
      <>
        Around a list or tree that already moves with the arrow keys, such as <a href="#/components/tabs">Tabs</a> or{' '}
        <a href="#/components/tree-view">TreeView</a>.
      </>,
      'Around a form. Fields need their own tab stops, and arrow keys move the caret in a text field.',
    ],
  },
  accessibility: [
    <>
      The group has the <code>group</code> role by default. Set <code>role</code> to <code>toolbar</code> for a row of
      actions, and give every group with a role an <code>ariaLabel</code>.
    </>,
    'Only one item is in the tab order at a time. Left and Right follow the reading direction, so Right moves backward in right-to-left layout.',
    'Arrow keys pressed in a text field, a text area, a select or editable content are left to that element.',
    'Keys with Alt, Control or Meta held, and keys a nested group or open menu has already handled, are ignored.',
    'Tell users how to move through the group when it is not a familiar pattern, for example in a hint next to it.',
  ],
  related: ['button-group', 'segmented-control', 'tabs', 'tree-view'],
};

export default doc;
