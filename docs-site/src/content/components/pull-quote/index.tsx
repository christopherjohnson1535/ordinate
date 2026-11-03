// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'PullQuote',
  folder: 'pull-quote',
  group: 'website-content',
  summary: 'Lifts a line from a story out of the text and sets it large, with who said it.',
  description: (
    <>
      <p>
        A pull quote sets a sentence or two in the style's headline type, large and in italics, with the attribution
        below it after a short rule that stands in for a printed dash. It renders a <code>figure</code> holding a{' '}
        <code>blockquote</code> and a <code>figcaption</code>.
      </p>
      <p>
        <code>hanging</code> adds an oversized quotation mark in the accent color that hangs in its own column, so the
        lines of the quote keep a clean edge. <code>ruled</code> draws ink rules above and below to set the quote off
        from the text around it. The headline type follows the page style: a serif in <code>editorial</code>, light and
        large in <code>studio</code>.
      </p>
    </>
  ),
  examples: [
    {
      id: 'in-a-story',
      title: 'In the flow of a story',
      description: (
        <p>
          A hanging quote between two paragraphs of a story, in the <code>editorial</code> style.
        </p>
      ),
    },
    {
      id: 'variants',
      title: 'Variants',
      description: (
        <p>
          <code>default</code> for a quote in a wide column, <code>hanging</code> to draw the eye in a long story, and{' '}
          <code>ruled</code> to set a quote apart where there is no text around it.
        </p>
      ),
    },
    {
      id: 'studio-statement',
      title: 'A statement in two lines',
      description: (
        <p>
          Pass paragraphs as children for a quote of more than one sentence. Without an <code>attribution</code> the
          quote stands as the site's own words. Shown in the <code>studio</code> style.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To lift the strongest line of a story out of the text, so a reader who skims finds it.',
      'For a short statement that opens a section of a studio or practice site.',
    ],
    avoid: [
      <>
        For what a customer said about a business. Use a <a href="#/components/testimonial">Testimonial</a>.
      </>,
      <>
        For a long quotation that is part of the argument. Write a <code>blockquote</code> inside an{' '}
        <a href="#/components/article">Article</a> or <a href="#/components/text-content">TextContent</a>.
      </>,
      'More than one pull quote on a screen. Each one makes the others quieter.',
    ],
    writing: [
      'Quote words that are in the story, exactly. Do not write new ones for the pull quote.',
      'Leave out the quotation marks; the layout says it is a quote.',
      'Keep it to one or two sentences.',
      'Write the attribution as a name and a role: "Mara Lindqvist, harbour master".',
    ],
  },
  accessibility: [
    <>
      The quote is a <code>blockquote</code> inside a <code>figure</code>, with the attribution in its{' '}
      <code>figcaption</code>, so screen readers announce it as a quotation with its source.
    </>,
    'The hanging quotation mark is hidden from screen readers and cannot be selected.',
    'A pull quote repeats words from the story. Screen reader users hear them twice, so keep it short.',
  ],
  related: ['testimonial', 'article', 'text-content', 'figure'],
};

export default doc;
