// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'SiteHeader',
  folder: 'site-header',
  group: 'website-frame',
  summary: 'Shows the name of a website and links to its main pages at the top of every page.',
  description: (
    <>
      <p>
        The site header is the bar across the top of a website: the brand, a name with an optional logo that links home,
        then the main pages and, at the end, usually one button. A thin strip above it can carry a short{' '}
        <code>notice</code> such as today's hours, in the style's emphasis color. The bar stands on a hairline and its
        content lines up with the sections below it.
      </p>
      <p>
        The header measures its own width. Below 688 pixels the links fold into a menu button, and the open menu hangs
        under the bar across its full width; below 465 pixels the button shows only its icon. The actions stay in the
        bar. The link to the page being shown is underlined.
      </p>
    </>
  ),
  examples: [
    {
      id: 'shop',
      title: 'A shop header',
      description: (
        <p>
          Brand with logo, four pages, a notice and one main action, in the <code>shopfront</code> style.{' '}
          <code>onFollow</code> lets a router handle the links: here it marks the followed page as current.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'menu',
      title: 'Links folded into a menu',
      description: (
        <p>
          In a narrow column the links fold into a menu button. <code>menuButtonText</code> renames the button. Shown in
          the <code>studio</code> style.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
    {
      id: 'sticky',
      title: 'Sticky',
      description: (
        <p>
          <code>sticky</code> keeps the header at the top while the page scrolls. Scroll the example to see it. Shown in
          the <code>editorial</code> style, with no logo and no actions.
        </p>
      ),
      layout: 'flush',
      height: 'short',
    },
  ],
  guidelines: {
    use: [
      'At the top of every page of a website, with the same links on each page.',
      'With four to six links to the main pages, and the current one marked.',
      'With one action for the thing most visitors come to do, such as booking.',
    ],
    avoid: [
      <>
        In an application. Use <a href="#/components/top-navigation">TopNavigation</a>, with{' '}
        <a href="#/components/side-navigation">SideNavigation</a> for many pages.
      </>,
      'More than six links. Fold the rest into the site footer.',
      'A notice that never changes. Keep the strip for facts that do, such as hours or a closure.',
    ],
    writing: [
      'Name pages by what is on them, in a word or two: "Repairs", "Visit", not "Services overview".',
      'Keep the notice to one line. Join two facts with a middle dot.',
      'Use the business name as it appears on the shop sign.',
    ],
  },
  accessibility: [
    <>
      The header is a <code>header</code> element, and the links are in a <code>nav</code> landmark named "Main" by
      default. Name it with <code>navigationAriaLabel</code> when the page has more than one navigation landmark.
    </>,
    <>
      The current link carries <code>aria-current="page"</code>.
    </>,
    <>The logo is hidden from screen readers, which read the brand name instead.</>,
    <>
      The menu button is a native button with <code>aria-expanded</code> and <code>aria-controls</code>. Escape or
      following a link closes the menu and returns focus to the button; clicking or tabbing away closes it without
      moving focus.
    </>,
    <>
      <code>onFollow</code> fires only for a plain left click, so opening a link in a new tab still works.
    </>,
  ],
  related: ['site-footer', 'opening', 'section', 'top-navigation', 'style-scope'],
};

export default doc;
