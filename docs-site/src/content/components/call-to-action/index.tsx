// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'CallToAction',
  folder: 'call-to-action',
  group: 'website-frame',
  summary: 'Asks website visitors to do one thing, such as book, call or subscribe, in a band of its own.',
  description: (
    <>
      <p>
        A call to action is a short band that stands out from the page: a heading that asks, a line that gives a reason,
        and the buttons or a small form to act on it. It is inverted by default, dark ink with light text, so it reads
        as the end of a run of sections. Buttons, links and fields inside switch to light colors on their own.
      </p>
      <p>
        With enough room the text sits on one side and the actions on the other; below 688 pixels of its own width the
        actions move under the text. Put a short form in <code>children</code>, such as an email field and a button, and
        it takes the place of the actions.
      </p>
    </>
  ),
  examples: [
    {
      id: 'booking',
      title: 'Book or call',
      description: (
        <p>
          The usual case: a primary button for the main action and a quieter one beside it. Shown in the{' '}
          <code>shopfront</code> style, where the band and buttons are rounded.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'sign-up',
      title: 'A sign-up form',
      description: (
        <p>
          A newsletter sign-up in <code>children</code>. The form checks the address, and the description thanks the
          reader once it is sent. Shown in the <code>editorial</code> style.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'tones',
      title: 'Quieter tones',
      description: (
        <p>
          <code>accent</code> uses a soft tint and <code>default</code> the page background, for a request that should
          not outweigh the rest of the page. Shown in the <code>studio</code> style.
        </p>
      ),
      layout: 'flush',
    },
  ],
  guidelines: {
    use: [
      'Once near the end of a website page, after the sections that give the reason to act.',
      'For one request: book a table, call the workshop, subscribe to the letter.',
      'With a short form of one or two fields, when acting means leaving an email address.',
    ],
    avoid: [
      <>
        For a part of the page that informs rather than asks. Use a <a href="#/components/section">Section</a>.
      </>,
      'More than one call to action in a row. Each one weakens the others.',
      <>
        For a form longer than a line. Link to a page with the form, or use a <a href="#/components/journey">Journey</a>
        .
      </>,
    ],
    writing: [
      'Make the heading the request itself, such as "Book a table for Friday", or the offer, such as "The Thursday letter".',
      'Give one reason in the description: what the visitor gets, or how soon.',
      'Start button labels with a verb that says what happens: "Book a repair", "Subscribe".',
    ],
  },
  accessibility: [
    <>
      The band is a <code>section</code> element with its heading at level 2 by default. Set <code>headingLevel</code>{' '}
      so the page reads in order.
    </>,
    'In the inverted tone, buttons, links and fields take their dark-mode colors, which keeps their contrast on the dark band.',
    'A form placed inside must label its fields and say what went wrong, as any form does. FormField does both.',
  ],
  related: ['section', 'opening', 'button', 'form-field', 'journey'],
};

export default doc;
