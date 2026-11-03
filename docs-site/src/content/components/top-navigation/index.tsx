// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TopNavigation',
  folder: 'top-navigation',
  group: 'navigation',
  summary: 'The bar across the top of an application: its name, a command line and global actions.',
  description: (
    <>
      <p>
        Top navigation is drawn as a title block: a row of cells split by hairlines, standing on a 2 px ink rule. The
        application&rsquo;s name and logo fill the first cell and link to its home page, a search field fills the middle
        one, and each utility has a cell of its own at the end, lettered as a quiet text button.
      </p>
      <p>
        An Ordinate <code>Input</code> in the <code>search</code> slot is drawn as a command line, with a prompt mark,
        mono type and a <code>/</code> key hint, and pressing <code>/</code> outside a field moves focus to it. As the
        bar narrows, utilities with an icon first drop their text, then move into an overflow menu one by one, starting
        with the first.
      </p>
    </>
  ),
  marks: ['M7'],
  examples: [
    {
      id: 'console',
      title: 'An application bar',
      description: (
        <p>
          A command line, a link to the docs, a notifications button with a <code>badge</code> and an account menu with
          the user&rsquo;s name and email as its <code>title</code> and <code>description</code>. This site&rsquo;s own
          bar already holds the <code>/</code> shortcut, so here it moves focus to the site search.
        </p>
      ),
    },
    {
      id: 'narrow',
      title: 'When space runs out',
      description: (
        <p>
          Narrow the bar: the utilities drop their text, then the first ones move into the overflow menu.{' '}
          <code>disableUtilityCollapse</code> keeps Sign out in the bar, and <code>disableTextCollapse</code> keeps a
          utility&rsquo;s text.
        </p>
      ),
    },
    {
      id: 'primary-action',
      title: 'A primary action',
      description: (
        <p>
          A <code>primary-button</code> utility stands out for the one action a visitor came for. Give the identity a{' '}
          <code>logo</code>; its <code>alt</code> is only used when there is no <code>title</code>.
        </p>
      ),
      layout: 'flush',
    },
  ],
  guidelines: {
    use: [
      'Once per application, across the top of every page, above the app layout.',
      'For actions that apply everywhere: search, help, notifications and the account menu.',
    ],
    avoid: [
      <>
        For the pages of the application. Put them in <a href="#/components/side-navigation">SideNavigation</a>.
      </>,
      <>
        For a public website, which has its own header. Use <a href="#/components/site-header">SiteHeader</a>.
      </>,
      'More than four or five utilities. Move the rarely used ones into a menu.',
    ],
    writing: [
      'Use the product name as the title, without "Home" or a tagline.',
      'Label utilities with one or two words. Give icon-only utilities an ariaLabel, and say there when a badge is showing, such as "Notifications (2 unread)".',
    ],
  },
  accessibility: [
    <>
      The bar is a <code>&lt;header&gt;</code> element. Place it outside the main landmark.
    </>,
    'The identity is a link. Following it with a plain left click fires identity.onFollow, which you can cancel to route on the client.',
    <>
      A utility whose text is collapsed is named by its text, or by <code>ariaLabel</code> when you set one. The badge
      dot is drawing only, so mention it in <code>ariaLabel</code>.
    </>,
    <>
      The overflow menu button is named &ldquo;More&rdquo; by default; change it with{' '}
      <code>i18nStrings.overflowMenuTriggerText</code>.
    </>,
    <>
      The <code>/</code> shortcut is ignored while focus is in a field and when a modifier key is held. Give the search
      field an <code>ariaLabel</code>.
    </>,
  ],
  related: ['side-navigation', 'app-layout', 'input', 'button-dropdown', 'site-header'],
};

export default doc;
