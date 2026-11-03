// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Box',
  folder: 'box',
  group: 'content',
  summary: 'Sets a piece of text in one of the library’s text styles, with spacing, alignment and color.',
  description: (
    <>
      <p>
        Box is the plain element of the library. Its <code>variant</code> picks both the HTML element and the text
        style: headings, paragraphs, small print, code, a key label or a large headline figure. Margin, padding,
        alignment, float and color come from the spacing and color tokens, so you can place text without writing CSS.
      </p>
      <p>
        Box draws no marks of its own. Use it for the words around other components, such as an empty state, a short
        note under a form, or a figure over its label.
      </p>
    </>
  ),
  examples: [
    {
      id: 'text-styles',
      title: 'Text styles',
      description: (
        <p>
          Each <code>variant</code> renders its own element. <code>inline-code</code> and <code>strong</code> sit
          inside running text; <code>small</code> is for notes such as a time stamp.
        </p>
      ),
    },
    {
      id: 'headline-figure',
      title: 'Headline figures',
      description: (
        <p>
          <code>key-label</code> over <code>value-large</code> sets a figure under its name, as on a summary sheet.
          Add a line in a status color when the figure needs a word of context.
        </p>
      ),
    },
    {
      id: 'spacing',
      title: 'Spacing and alignment',
      description: (
        <p>
          Pass one size to <code>margin</code> or <code>padding</code> for every side, or an object for single sides.
          Here an empty state is centered with <code>textAlign</code> and spaced with bottom margins.
        </p>
      ),
    },
    {
      id: 'status-colors',
      title: 'Status colors',
      description: (
        <p>
          The <code>text-status-*</code> colors say how something is. The words must say it too, because color is
          never the only signal.
        </p>
      ),
    },
    {
      id: 'float',
      title: 'Float',
      description: (
        <p>
          <code>float="right"</code> moves an element to the end of the line, and the text after it flows around it.
          In right-to-left pages it moves to the left.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For headings, paragraphs and notes that are not part of another component.',
      'To space or align a few elements without writing CSS.',
      <>
        For a headline figure with its label, using <code>key-label</code> and <code>value-large</code>.
      </>,
    ],
    avoid: [
      <>
        For the heading of a page or a section with actions. Use a <a href="#/components/header">Header</a>.
      </>,
      <>
        For a long article written as HTML. Use <a href="#/components/text-content">TextContent</a>.
      </>,
      <>
        For a list of labels and values. Use <a href="#/components/key-value-pairs">KeyValuePairs</a>.
      </>,
      <>
        For spacing a list of components evenly. Use <a href="#/components/space-between">SpaceBetween</a>.
      </>,
      'Heading variants for text that is not a heading. The variant sets the element, so it changes the outline of the page; use tagOverride to keep the look and change the element.',
    ],
    writing: [
      'Use sentence case for headings.',
      'Say a status in words as well as in color: "Backup failed", not a red time stamp.',
    ],
  },
  accessibility: [
    <>
      The <code>variant</code> sets the HTML element, so <code>h1</code> to <code>h5</code> are real headings that
      screen readers list. Keep the heading levels in order, and use <code>tagOverride</code> when the look and the
      level differ.
    </>,
    <>
      <code>display="none"</code> hides the content from every user, screen readers included.
    </>,
    'Status colors meet contrast against the page in light and dark mode, but they are not announced. The text has to say the status.',
  ],
  related: ['text-content', 'header', 'space-between', 'key-value-pairs'],
};

export default doc;
