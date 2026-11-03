// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'AnchorNavigation',
  folder: 'anchor-navigation',
  group: 'navigation',
  summary: 'Lists the sections of a long page and marks the one the reader is in.',
  description: (
    <>
      <p>
        Anchor navigation is drawn as a scale: a faint vertical construction line with a tick for every heading, longer
        for deeper levels. The current section gets the position rule, a longer ink tick laid across the line, and its
        text turns ink. Each anchor links to an element on the page by its ID.
      </p>
      <p>
        Without <code>activeHref</code> the component follows the window&rsquo;s scroll position and marks the last
        section whose top has passed <code>scrollSpyOffset</code>. When the sections scroll inside a box of their own,
        or the application routes on the URL hash, set <code>activeHref</code> yourself and scroll in{' '}
        <code>onFollow</code>.
      </p>
    </>
  ),
  marks: ['M1', 'M11'],
  examples: [
    {
      id: 'scrolling-panel',
      title: 'Sections in a scrolling panel',
      description: (
        <p>
          The sections scroll in their own box, so the example scrolls the box in <code>onFollow</code> and sets{' '}
          <code>activeHref</code> as the reader scrolls. On a page that scrolls the window, leave{' '}
          <code>activeHref</code> out and the component tracks the section by itself.
        </p>
      ),
    },
    {
      id: 'levels',
      title: 'Levels and info',
      description: (
        <p>
          An anchor with a higher <code>level</code> than the one before nests under it, and each level ticks the scale
          a little further. Levels past the third are drawn like the third. <code>info</code> adds a short note after
          the link, such as &ldquo;New&rdquo;.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a page long enough to scroll through several screens, with headings the reader may want to jump between.',
      'Beside the content, in a column that stays in view, under a heading such as "On this page".',
    ],
    avoid: [
      <>
        For moving between pages. Use <a href="#/components/side-navigation">SideNavigation</a>.
      </>,
      <>
        For views that replace each other in one place. Use <a href="#/components/tabs">Tabs</a>.
      </>,
      'For a page with two or three short sections, which the reader can see at once.',
    ],
    writing: [
      'Use the text of each heading as it appears on the page, so the reader recognizes where they land.',
      'Keep info to one or two words, such as "New" or "Updated".',
    ],
  },
  accessibility: [
    'The list is a <nav> landmark of nested ordered lists. Name it with ariaLabelledby, pointing at the heading above it.',
    <>
      The current anchor carries <code>aria-current=&quot;true&quot;</code>, so screen readers say which section is
      current.
    </>,
    'Anchors are plain links, reached with Tab and followed with Enter. Following one with a modifier key or the middle button is left to the browser.',
    <>
      When you cancel <code>onFollow</code> and scroll yourself, move focus to the section&rsquo;s heading as well, so
      keyboard users continue reading from there.
    </>,
  ],
  related: ['side-navigation', 'tabs', 'tree-view', 'app-layout'],
};

export default doc;
