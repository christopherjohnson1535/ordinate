// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'AppLayout',
  folder: 'app-layout',
  group: 'layout',
  summary:
    'Frames an application page: navigation, breadcrumbs, the content, notifications, help and side panels, each in its place.',
  description: (
    <>
      <p>
        An app layout is a drawing set laid on paper. The navigation is a sheet index on its own white strip along the
        side. The content sits on a white sheet with a hairline edge, lettered A, B, C along its top edge so a place on
        it can be named, and closed by a <code>titleBlock</code> along its foot. Notifications are notes in the margin
        beside the sheet. The help panel and drawers come in from the end of the line with an ink edge.
      </p>
      <p>
        On wide screens a closed navigation or panel collapses to a slim rail of icon toggles. Below 688 pixels, measured
        on the layout itself rather than the window, a toolbar holds the breadcrumbs and every toggle, and panels open
        over the content. Each open state can be left to the layout or controlled with its prop and change event.
      </p>
    </>
  ),
  marks: ['M1', 'M8', 'M11'],
  examples: [
    {
      id: 'console',
      title: 'A console page',
      description: (
        <p>
          Navigation, breadcrumbs, a help panel and a title block around a content layout. The Info link calls the
          layout’s <code>openTools()</code>, which opens the help panel and moves focus to its close button. The
          example sets <code>disableBodyScroll</code> so the layout scrolls inside its frame.
        </p>
      ),
      layout: 'flush',
      height: 'tall',
    },
    {
      id: 'drawers',
      title: 'Drawers',
      description: (
        <p>
          Drawers share the end of the line with the help panel, so opening one closes the other. A drawer can be
          resizable, start at a <code>defaultSize</code> and show a <code>badge</code> until it has been opened.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
    {
      id: 'toolbar',
      title: 'Toolbar variant',
      description: (
        <p>
          With <code>variant="toolbar"</code>, a toolbar above the content holds the breadcrumbs and all the toggles at
          every width, and closed panels take no space. Here the layout manages its own state: no open props are set.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: (
        <p>
          Notifications go in a column beside the sheet, like notes in the margin, when the layout has room for it:
          the sheet must keep 640 pixels beside a 320 pixel column. Otherwise, as in this frame, or with{' '}
          <code>notificationsPosition="top"</code>, they sit above the breadcrumbs. <code>stickyNotifications</code>{' '}
          keeps them in view while the content scrolls, and an empty <code>Flashbar</code> takes no space.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
  ],
  guidelines: {
    use: [
      'Once per application page, as its outermost frame.',
      <>
        With a <code>contentType</code> that fits the page: <code>table</code>, <code>cards</code> or{' '}
        <code>dashboard</code> for full-width collections, <code>form</code> and <code>wizard</code> for narrower
        pages that start with the help panel open.
      </>,
      <>
        With <code>disableBodyScroll</code> when the layout sits in a region of fixed height, such as an embedded
        view, so it scrolls inside that region instead of the page.
      </>,
    ],
    avoid: [
      <>
        For a website. Use a <a href="#/components/site-header">SiteHeader</a> and{' '}
        <a href="#/components/site-footer">SiteFooter</a> around the page.
      </>,
      <>
        For a list beside a detail inside a page. Use a <a href="#/components/panel-layout">PanelLayout</a>.
      </>,
      'More than one app layout on a page, or one inside another.',
    ],
    writing: [
      'Name each drawer in ariaLabels.drawerName with a noun, such as "Activity". The trigger, the panel and its close button take their names from it.',
      'Use the title block for facts about the whole sheet: project, sheet number, revision, who checked it.',
    ],
  },
  accessibility: [
    <>
      The content is the page’s <code>&lt;main&gt;</code> landmark and the navigation a <code>&lt;nav&gt;</code>. The
      help panel and drawers are <code>&lt;aside&gt;</code> regions named after the panel, and the notifications a
      region named “Notifications”.
    </>,
    <>
      Every toggle is a button with <code>aria-expanded</code>. Opening a panel moves focus to its close button, and
      closing it returns focus to the toggle that opened it.
    </>,
    'On a narrow layout, open panels cover the content: the content behind them is made inert, and Escape closes the panel.',
    'Rail toggles show their name in a tooltip, since they have no visible text. Rename them through ariaLabels if the defaults do not fit.',
    'Resizable drawers have a separator handle that works with the arrow keys, Home and End.',
    <>
      The grid reference letters along the top of the sheet are drawing only and hidden from screen readers. Call{' '}
      <code>closeNavigationIfNecessary()</code> after a navigation link is followed, so the navigation does not stay
      over the new page on a narrow screen.
    </>,
  ],
  related: ['content-layout', 'app-layout-toolbar', 'split-panel', 'drawer', 'help-panel', 'title-block'],
};

export default doc;
