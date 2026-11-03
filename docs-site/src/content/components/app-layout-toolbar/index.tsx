// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'AppLayoutToolbar',
  folder: 'app-layout-toolbar',
  group: 'layout',
  summary: 'A strip with the navigation toggle, the breadcrumbs and the drawer triggers, for page frames of your own.',
  description: (
    <>
      <p>
        The toolbar is the strip the app layout shows above its content on narrow screens and in its toolbar variant:
        a navigation toggle at the start, breadcrumbs in the middle and a group of drawer triggers at the end, over a
        hairline rule. An open drawer’s trigger is filled with ink, and a <code>badge</code> adds a dot to a trigger.
      </p>
      <p>
        It holds no state of its own and opens nothing. It reports clicks through <code>onNavigationChange</code> and{' '}
        <code>onDrawerChange</code>, and you show the panels. Inside an <code>AppLayout</code> you never use it
        directly.
      </p>
    </>
  ),
  marks: ['M10'],
  examples: [
    {
      id: 'toolbar',
      title: 'Toggle, breadcrumbs and triggers',
      description: (
        <p>
          Keep the open navigation and drawer in state and pass them back. Clicking the open drawer’s trigger reports{' '}
          <code>null</code>, so the same handler opens and closes. Clear the badge once the drawer has been opened.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'breadcrumbs-only',
      title: 'Breadcrumbs only',
      description: (
        <p>
          For a page with no navigation, <code>navigationHide</code> removes the toggle. Leave out{' '}
          <code>drawers</code> and no trigger group is drawn.
        </p>
      ),
      layout: 'flush',
    },
  ],
  guidelines: {
    use: [
      'Above a page frame you build yourself, when the panels it opens are your own.',
      'In an embedded view that needs the same toggles as the console around it.',
    ],
    avoid: [
      <>
        Inside an <a href="#/components/app-layout">AppLayout</a>. The layout draws its own toolbar; set{' '}
        <code>variant="toolbar"</code> on the layout to keep it on wide screens.
      </>,
      'For page actions such as Save or Deploy. Put them in the page header.',
    ],
    writing: ['Name each trigger after the panel it opens, with a noun: "Activity", "Notifications".'],
  },
  accessibility: [
    <>
      The navigation toggle and the drawer triggers are icon buttons with <code>aria-expanded</code>. The toggle is
      named “Open navigation” or “Close navigation” to match its state; change the names with{' '}
      <code>ariaLabels</code>.
    </>,
    <>
      The drawer triggers form a group named “Drawers”. Each trigger’s name is its <code>ariaLabel</code>, which you
      must give.
    </>,
    'The badge dot is drawing only. When something new in a drawer matters, say so in the drawer or in the trigger name as well.',
    'The toolbar does not move focus. When your panel opens, move focus into it, and back to the trigger when it closes.',
  ],
  related: ['app-layout', 'breadcrumb-group', 'drawer'],
};

export default doc;
