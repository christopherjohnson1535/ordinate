// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TextContent',
  folder: 'text-content',
  group: 'content',
  summary: 'Styles long-form content written as plain HTML: headings, paragraphs, lists, code and quotes.',
  description: (
    <>
      <p>
        Write the content as ordinary HTML elements and TextContent sets them in the library’s type, with no classes:
        headings in the heading face, links in the link color, inline code on a tinted ground, preformatted code in a
        hairline box, quotes against an ink rule on their leading edge, and <code>hr</code> as a divider.
      </p>
      <p>
        Only elements written directly inside TextContent are styled. Other components placed in it, such as an Alert
        or a Button, keep their own look.
      </p>
    </>
  ),
  examples: [
    {
      id: 'article',
      title: 'An article',
      description: (
        <p>
          A help article with headings, a list of steps, inline and preformatted code, a rule and a closing note.
        </p>
      ),
    },
    {
      id: 'quote-and-notes',
      title: 'Quotes and small print',
      description: (
        <p>
          <code>blockquote</code> sets a quote against an ink rule. <code>small</code> inside a paragraph is for a
          note that matters less than the text around it.
        </p>
      ),
    },
    {
      id: 'with-components',
      title: 'Components inside',
      description: <p>Components in the content keep their own styles, so an alert or a button can sit in the text.</p>,
    },
  ],
  guidelines: {
    use: [
      'For help articles, release notes, terms and other prose of more than a paragraph.',
      'For content that comes from Markdown or a CMS as plain HTML.',
    ],
    avoid: [
      <>
        For a single line or a label. Use a <a href="#/components/box">Box</a>.
      </>,
      <>
        For the title of a page with actions. Use a <a href="#/components/header">Header</a> above the content.
      </>,
      <>
        For code that people read line by line. Use a <a href="#/components/code-view">CodeView</a>, which numbers
        and colors it.
      </>,
    ],
    writing: [
      'Keep headings in order: an h3 follows an h2, never an h1 directly.',
      'Write link text that says where it goes: "the key policy", not "click here".',
    ],
  },
  accessibility: [
    'The content keeps the elements you write, so headings, lists and links mean to screen readers what they say.',
    'Heading levels are yours to keep in order with the rest of the page.',
    'Links are underlined on hover and show the focus ring when reached with the keyboard.',
  ],
  related: ['box', 'header', 'code-view'],
};

export default doc;
