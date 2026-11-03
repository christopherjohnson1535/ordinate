// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Testimonial',
  folder: 'testimonial',
  group: 'website-content',
  summary: 'Shows what a customer said about a business, with their name and where they are from.',
  description: (
    <>
      <p>
        A testimonial is a card with a customer's words: a large quotation mark in the accent color, the quote in
        lead-sized type, and the customer's name and a detail that places them, such as their neighbourhood. A small
        square picture can sit beside the name. <code>tone="accent"</code> lays the card on the style's accent tint.
      </p>
      <p>
        Use only real words from a real customer, with their permission to show them and their name. Shorten a quote if
        you must, but never change what it says. The examples on this page use sample words.
      </p>
    </>
  ),
  examples: [
    {
      id: 'customers',
      title: 'What customers say',
      description: (
        <p>
          Three short quotes in a row for a bicycle workshop, in the <code>shopfront</code> style, with one on the
          accent tone.
        </p>
      ),
    },
    {
      id: 'with-photo',
      title: 'With a picture and longer quotes',
      description: (
        <p>
          A square <a href="#/components/media">Media</a> in <code>media</code> sits beside the name. Give it an empty{' '}
          <code>alt</code>, because the name is right next to it. Pass paragraphs for a quote of more than one sentence.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a few short quotes from customers on a shop, café or service website.',
      'With two or three testimonials in a row, from different people.',
    ],
    avoid: [
      <>
        For a line lifted from a story or an interview. Use a <a href="#/components/pull-quote">PullQuote</a>.
      </>,
      'For star ratings or review counts. They need their source and date, which a testimonial does not show.',
      'For words you wrote yourself or changed, or for anyone who has not agreed to be quoted.',
    ],
    writing: [
      'Copy the customer’s words exactly, without quotation marks.',
      'Show the name the way they agreed to have it shown, such as a first name and an initial: "Priya S.".',
      'Use the detail for one fact that places them: a neighbourhood, or a role and a business.',
    ],
  },
  accessibility: [
    <>
      The testimonial is a <code>figure</code> with the quote in a <code>blockquote</code> and the name and detail in a{' '}
      <code>figcaption</code>, so the quote is announced with who said it.
    </>,
    'The large quotation mark is hidden from screen readers and cannot be selected.',
    'Give the picture an empty alt, because the name next to it already says who it is.',
  ],
  related: ['pull-quote', 'menu-tile', 'section', 'media'],
};

export default doc;
