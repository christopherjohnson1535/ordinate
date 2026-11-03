// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'SideNavigation',
  folder: 'side-navigation',
  group: 'navigation',
  summary: 'Lists the pages of an application or area and marks the current one.',
  description: (
    <>
      <p>
        Side navigation reads like the sheet index of a drawing set. Each section and section group hangs on its own
        faint construction line, closed by a hash mark at each end, with its title in small mono capitals. The current
        page gets the position rule on its leading edge and its text turns ink. Items show their names only.
      </p>
      <p>
        The navigation draws no ground of its own, so it takes the surface it sits on, usually the navigation drawer of
        an <a href="#/components/app-layout">AppLayout</a>. It does not route: set <code>activeHref</code> to the
        current page and cancel <code>onFollow</code> to navigate with a client-side router.
      </p>
    </>
  ),
  marks: ['M1', 'M2', 'M11'],
  examples: [
    {
      id: 'basic',
      title: 'Pages in groups',
      description: (
        <p>
          A <code>section-group</code> titles a set of links and cannot be collapsed. <code>info</code> shows a badge
          after a link, a <code>divider</code> breaks the list, and an <code>external</code> link opens a new tab.
        </p>
      ),
    },
    {
      id: 'sections',
      title: 'Collapsible sections',
      description: (
        <p>
          A <code>section</code> can be collapsed and starts expanded unless <code>defaultExpanded</code> is false.{' '}
          <code>onChange</code> reports each toggle, so you can remember it between visits.
        </p>
      ),
    },
    {
      id: 'link-groups',
      title: 'Pages with child pages',
      description: (
        <p>
          A <code>link-group</code> is a page with its child pages always shown under it. An{' '}
          <code>expandable-link-group</code> hides them until opened; it opens on its own when it holds the current
          page, and following its own link opens it too.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the main pages of an application or of one area of it, in the navigation drawer of an app layout.',
      'Group pages by what they hold, such as resources, operations and settings, with a few links in each group.',
    ],
    avoid: [
      <>
        For the sections of one page. Use <a href="#/components/anchor-navigation">AnchorNavigation</a>.
      </>,
      <>
        For a deep hierarchy of things, such as folders and files. Use <a href="#/components/tree-view">TreeView</a>.
      </>,
      'Nesting more than two levels of links. Split the area, or move the deeper pages into the page itself.',
    ],
    writing: [
      'Use the page titles as the link text, in sentence case.',
      'Name sections with a noun for what they hold: "Storage", not "Manage storage".',
    ],
  },
  accessibility: [
    <>
      The navigation is a <code>&lt;nav&gt;</code> landmark named &ldquo;Side navigation&rdquo; by default; set{' '}
      <code>ariaLabel</code> to change it.
    </>,
    <>
      The current link carries <code>aria-current=&quot;page&quot;</code>.
    </>,
    <>
      Section titles and the toggles of expandable link groups are buttons that say whether they are expanded. A section
      group is a <code>group</code> named by its title.
    </>,
    <>
      External links are followed by text that says they open a new tab, &ldquo;Opens in a new tab&rdquo; by default,
      read by screen readers only. Change it with <code>externalIconAriaLabel</code>.
    </>,
  ],
  related: ['app-layout', 'top-navigation', 'breadcrumb-group', 'anchor-navigation'],
};

export default doc;
