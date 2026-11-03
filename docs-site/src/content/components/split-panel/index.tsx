// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'SplitPanel',
  folder: 'split-panel',
  group: 'layout',
  summary: 'Shows the details of the selected item below or beside the content, in a panel the user can resize.',
  description: (
    <>
      <p>
        A split panel is a sheet pulled in from the bottom or the side of the page. Its edge toward the page is an ink
        line that runs a little past the panel and carries a three-tick resize grip. A <code>headerTag</code> is drawn
        in a circle before the title, with “Detail S3” above it, like a detail callout on a drawing: give it the same
        tag as the table row it describes, from the table’s <code>rowTag</code>.
      </p>
      <p>
        The panel lives in the <code>splitPanel</code> slot of an <code>AppLayout</code>, which holds its position,
        size and open state. The user can move it between the bottom and the side from its preferences; the layout
        keeps it at the bottom while it is too narrow for the side.
      </p>
    </>
  ),
  marks: ['M8', 'M1'],
  examples: [
    {
      id: 'selected-row',
      title: 'Details of the selected row',
      description: (
        <p>
          The panel shows the row picked in the table, and the circled tag matches that row’s tag. Close it and it
          collapses to a bar with its title, so it can be opened again.
        </p>
      ),
      layout: 'flush',
      height: 'tall',
    },
    {
      id: 'side',
      title: 'At the side, with actions',
      description: (
        <p>
          At the side, the panel takes the width of the layout beyond <code>minContentWidth</code>. A description, an
          Info link and actions go in the header. When closed, the side panel becomes a rail with an open button.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
    {
      id: 'hide',
      title: 'Hidden when closed',
      description: (
        <p>
          With <code>closeBehavior="hide"</code>, closing the panel removes it from the page. Use it when the panel
          only makes sense while something is selected, and open it from your own controls.{' '}
          <code>hidePreferencesButton</code> removes the position preferences.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
  ],
  guidelines: {
    use: [
      'For the details of the item selected in a table or cards, kept beside the collection.',
      'With a headerTag that matches the selected row, so the reader can see which item it describes.',
    ],
    avoid: [
      <>
        Outside an <a href="#/components/app-layout">AppLayout</a>. The panel gets its position and size from the
        layout and warns without one. Use a <a href="#/components/panel-layout">PanelLayout</a> inside a page.
      </>,
      <>
        For help or tools unrelated to the selection. Use a <a href="#/components/help-panel">HelpPanel</a> or a{' '}
        <a href="#/components/drawer">Drawer</a>.
      </>,
      'For editing that must be finished before going on. Use a modal or a separate page.',
    ],
    writing: [
      'Title the panel with the name of the selected item. With nothing selected, say so: "No service selected".',
      'Use the description for a one-line summary of the item.',
    ],
  },
  accessibility: [
    <>
      The panel is an <code>&lt;aside&gt;</code> named by its title, an <code>h2</code>. The circled tag is drawing
      only; the tag is read once, in the “Detail S3” label above the title.
    </>,
    <>
      The open and close buttons have <code>aria-expanded</code>, and focus moves to the other one when the panel
      opens or closes.
    </>,
    'The resize handle is a separator that can be focused. The arrow keys resize the panel, and Home and End set its smallest and largest size.',
    'The preferences open in a modal dialog with a radio group of positions. Focus returns to the preferences button when it closes.',
  ],
  related: ['app-layout', 'table', 'panel-layout', 'drawer'],
};

export default doc;
