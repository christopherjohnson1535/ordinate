// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Drawer',
  folder: 'drawer',
  group: 'layout',
  summary:
    'The content of a panel the app layout opens at the end of the line: a title, scrolling content and a footer.',
  description: (
    <>
      <p>
        A drawer is a sheet pulled in from the edge of the page. The app layout draws the panel around it, with an ink
        edge, a close button in the corner and, for a resizable drawer, a three-tick grip on its edge. The drawer fills
        that panel: a title with an optional reference in its kind’s color, content that scrolls, and a footer that
        stays at the bottom.
      </p>
      <p>
        Pass a drawer as the <code>content</code> of an entry in the app layout’s <code>drawers</code>. On its own it is
        only the content, with no edge or close button.
      </p>
    </>
  ),
  marks: ['M8'],
  examples: [
    {
      id: 'in-app-layout',
      title: 'In an app layout',
      description: (
        <p>
          A drawer with a reference, content and footer actions. The footer stays pinned to the bottom of the panel
          while the content scrolls. Done closes the drawer by setting <code>activeDrawerId</code> to <code>null</code>.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
    {
      id: 'loading',
      title: 'Loading',
      description: (
        <p>
          <code>loading</code> replaces the content and footer with a spinner and <code>loadingText</code>, for content
          fetched when the drawer opens. Open the assistant to see it start.
        </p>
      ),
      layout: 'flush',
      height: 'short',
    },
    {
      id: 'full-bleed',
      title: 'Content without padding',
      description: (
        <p>
          <code>disableContentPaddings</code> removes the padding around the content, for content that brings its own
          edges, such as rows ruled off across the full width of the drawer.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
  ],
  guidelines: {
    use: [
      'For a tool the user keeps beside the page while working on it: activity, notifications, an assistant.',
      'With a kind and reference when the drawer shows one section of the page in more detail.',
    ],
    avoid: [
      <>
        For help about the page. Use a <a href="#/components/help-panel">HelpPanel</a> in the layout’s{' '}
        <code>tools</code>.
      </>,
      <>
        For details of the selected item. Use a <a href="#/components/split-panel">SplitPanel</a>.
      </>,
      <>
        For a task that must be finished before going on. Use a <a href="#/components/modal">Modal</a>.
      </>,
    ],
    writing: [
      'Title the drawer with the same noun as its trigger, such as "Activity".',
      'Keep footer actions to the ones that act on the whole drawer, such as Clear or Done.',
    ],
  },
  accessibility: [
    <>
      The title is an <code>h2</code>. Pass text, not a heading element. The app layout names the panel from{' '}
      <code>ariaLabels.drawerName</code>, so keep the two the same.
    </>,
    <>
      While loading, the drawer is marked <code>aria-busy</code> and the loading text is a status message that screen
      readers announce.
    </>,
    'The app layout moves focus to the close button when the drawer opens and back to its trigger when it closes.',
  ],
  related: ['app-layout', 'help-panel', 'split-panel', 'app-layout-toolbar'],
};

export default doc;
