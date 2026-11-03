// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'SiteFooter',
  folder: 'site-footer',
  group: 'website-frame',
  summary: 'Closes every website page with the address, links to the rest of the site and the small print.',
  description: (
    <>
      <p>
        The site footer is the last band of a website. On the start side it holds the brand and anything you put in{' '}
        <code>children</code>, such as an address or a newsletter form; on the end side, groups of links each under a
        short title. The small print in <code>legal</code> runs along the bottom, above a hairline.
      </p>
      <p>
        In the <code>default</code> tone an ink rule opens the footer; <code>accent</code> and <code>inverted</code> set
        it on a tinted or dark band instead. Below 688 pixels of its own width the brand and the columns stack.
      </p>
    </>
  ),
  examples: [
    {
      id: 'columns',
      title: 'Address and columns',
      description: (
        <p>
          A shop's footer: the name and address, three groups of links and the small print. Shown in the{' '}
          <code>shopfront</code> style.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'newsletter',
      title: 'Inverted, with a sign-up',
      description: (
        <p>
          A journal's footer on a dark band, with a newsletter form in <code>children</code>. The field and button take
          light colors on the band by themselves. Shown in the <code>editorial</code> style.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'minimal',
      title: 'Small print only',
      description: (
        <p>
          A one-page portfolio may need only the small print. Shown in the <code>studio</code> style on the accent tone.
        </p>
      ),
      layout: 'flush',
    },
  ],
  guidelines: {
    use: [
      'At the bottom of every page of a website, the same on each page.',
      'For the links that do not fit in the site header: jobs, parking, privacy, back issues.',
      'For the facts visitors look for at the bottom of a page: the address, the hours, how to get in touch.',
    ],
    avoid: [
      'Repeating every header link in the columns. Group what a visitor looks for at the end of a page.',
      'More than four columns of links. Move the rest onto a page of their own.',
      <>
        For a request to act. Put it in a <a href="#/components/call-to-action">CallToAction</a> above the footer.
      </>,
    ],
    writing: [
      'Title each column with one or two words: "Visit", "Workshop", "About".',
      'Write the address as it would appear on an envelope, without a label.',
      'Keep the small print to the copyright line and the legal links.',
    ],
  },
  accessibility: [
    <>
      The footer is a <code>footer</code> element. The columns are in a <code>nav</code> landmark named "Footer" by
      default; name it with <code>navigationAriaLabel</code>.
    </>,
    <>
      Column titles are headings at level 2 by default. Set <code>headingLevel</code> so the page reads in order.
    </>,
    'The logo is hidden from screen readers, which read the brand name instead.',
    <>
      <code>onFollow</code> fires only for a plain left click, so opening a link in a new tab still works.
    </>,
  ],
  related: ['site-header', 'call-to-action', 'opening-hours', 'section'],
};

export default doc;
