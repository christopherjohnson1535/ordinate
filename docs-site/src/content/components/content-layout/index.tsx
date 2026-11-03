// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ContentLayout',
  folder: 'content-layout',
  group: 'layout',
  summary: 'Sets out the head of a page, with notifications, breadcrumbs and the page heading, above its content.',
  description: (
    <>
      <p>
        A content layout stacks the notifications, the breadcrumbs and the page heading in that order, then the content.
        The heading always sits on the sheet with the content, never on a colored band. <code>headerVariant</code> sets
        how the head is set apart: <code>high-contrast</code> stands it on a heavy ink rule, like the head of a title
        block, and <code>divider</code> rules it off from the content with a hairline.
      </p>
      <p>
        Inside an <code>AppLayout</code> the sheet already has padding, so leave <code>defaultPadding</code> off. Turn
        it on when the content layout is the outermost frame of the page.
      </p>
    </>
  ),
  marks: ['M1'],
  examples: [
    {
      id: 'page',
      title: 'Head of a page',
      description: (
        <p>
          Breadcrumbs, a heading with the page’s actions, and sections below. This is what usually goes in the{' '}
          <code>content</code> of an <code>AppLayout</code>.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'header-variants',
      title: 'Header variants',
      description: (
        <p>
          Use <code>high-contrast</code> for the main pages of an application, <code>divider</code> for quieter pages
          such as settings and articles, and <code>default</code> when the heading needs no separation.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'max-width',
      title: 'Maximum width',
      description: (
        <p>
          <code>maxContentWidth</code> limits the heading and the content to a width in pixels and centers them in a
          wider layout. Use it to keep lines of text short enough to read.
        </p>
      ),
      layout: 'flush',
    },
  ],
  guidelines: {
    use: [
      'Once per page, to hold the page heading and everything under it.',
      <>
        In the <code>content</code> of an <a href="#/components/app-layout">AppLayout</a>, or on its own for a page with
        no navigation or side panels.
      </>,
    ],
    avoid: [
      <>
        For a section within a page. Use a <a href="#/components/container">Container</a> with a heading.
      </>,
      <>
        <code>disableOverlap</code>. It is deprecated and has no visible effect.
      </>,
    ],
    writing: ['Name the page in the h1 with the name of the thing or the list it shows, such as "na-14" or "Nodes".'],
  },
  accessibility: [
    <>
      The layout adds no landmarks or headings of its own. Give the page its <code>h1</code> in the <code>header</code>{' '}
      slot, usually a <code>Header</code> with the <code>h1</code> variant.
    </>,
    'The head comes before the content in reading order: notifications, then breadcrumbs, then the heading.',
    <>
      Notifications placed here are not a live region by themselves; a <code>Flashbar</code> announces its own messages.
    </>,
  ],
  related: ['app-layout', 'header', 'breadcrumb-group', 'flashbar', 'container'],
};

export default doc;
