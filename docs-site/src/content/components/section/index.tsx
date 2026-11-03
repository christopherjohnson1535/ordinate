// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Section',
  folder: 'section',
  group: 'website-frame',
  summary: 'Holds one part of a website page, such as the menu or recent work, under its own heading.',
  description: (
    <>
      <p>
        A section is a full-width band of a website page. Its background runs edge to edge while the content keeps to a
        centered column, so sections stacked on one page line up with each other and with the site header and footer. It
        renders a <code>section</code> element with an optional heading, description and actions at the top, and
        anything you put inside below them.
      </p>
      <p>
        Bands are told apart with tone and printed rules rather than boxes. <code>tone</code> sets the background: the
        page, a soft accent tint, or inverted dark ink with light text, which switches the text, links and buttons
        inside with it. <code>rule</code> draws an ink rule above or below, or a thick and a thin rule above as on a
        printed page. How each looks follows the page style: the accent is sunflower in shopfront, and bands get rounded
        corners there too.
      </p>
    </>
  ),
  examples: [
    {
      id: 'basic',
      title: 'A section with a heading',
      description: (
        <p>
          A heading, a line about it, a link to more at the end of the heading row, and the content below. Shown in the{' '}
          <code>shopfront</code> style for a bicycle workshop.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'tones',
      title: 'Tones',
      description: (
        <p>
          <code>default</code>, <code>accent</code> and <code>inverted</code> in a row, in the <code>shopfront</code>{' '}
          style. Two tinted bands in a row keep a small gap so they read as two. Text, links and buttons inside the
          inverted band switch to light colors on their own.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'editorial-rules',
      title: 'Rules and a reading width',
      description: (
        <p>
          <code>rule="double"</code> opens a section like a new part of a journal, and <code>width="narrow"</code> keeps
          lines short enough to read. Shown in the <code>editorial</code> style, with the text in{' '}
          <a href="#/components/text-content">TextContent</a>.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'full-width',
      title: 'Edge to edge',
      description: (
        <p>
          <code>width="full"</code> with <code>spacing="none"</code> lets a photograph run the full width of the page.
          Shown in the <code>studio</code> style.
        </p>
      ),
      layout: 'flush',
    },
  ],
  guidelines: {
    use: [
      'For each part of a website page below the opening: services, recent work, opening hours, a story.',
      <>
        With an <code>id</code> when the site header or a menu links to it, such as <code>#menu</code>. The section
        leaves a little room above itself when the page scrolls to it.
      </>,
      'With a tone to set apart one or two sections on a long page. Most sections keep the default.',
    ],
    avoid: [
      <>
        Inside an application screen. Use a <a href="#/components/container">Container</a>.
      </>,
      <>
        For the first band of the page. Use an <a href="#/components/opening">Opening</a>, which holds the page title.
      </>,
      <>
        For a closing request to act, such as booking or subscribing. Use a{' '}
        <a href="#/components/call-to-action">CallToAction</a>.
      </>,
      'Two inverted sections in a row. The contrast only works when it is rare.',
    ],
    writing: [
      'Name the section after what it holds, in a few words: "Opening hours", "Recent work", "What we fix".',
      'Use the description for one fact that helps the reader, not a second heading.',
      'Make the action a link that says where it goes, such as "All prices".',
    ],
  },
  accessibility: [
    <>
      The section renders a <code>section</code> element and its heading is level 2 by default. Set{' '}
      <code>headingLevel</code> so the page reads in order, such as 3 for a section inside another.
    </>,
    'The rules are drawn with borders and hidden elements, so they are not read out.',
    'In the inverted tone, text and controls take their dark-mode colors, which keeps their contrast on the dark band.',
  ],
  related: ['opening', 'call-to-action', 'site-header', 'site-footer', 'style-scope'],
};

export default doc;
