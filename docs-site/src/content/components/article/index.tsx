// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Article',
  folder: 'article',
  group: 'website-content',
  summary: 'Sets a story or a long page of text for reading, with a lead, a byline and comfortable lines.',
  description: (
    <>
      <p>
        An article is the body of a story on a website. You write the story as plain HTML (paragraphs, headings from{' '}
        <code>h2</code> to <code>h5</code>, lists, links, <code>blockquote</code>, <code>figure</code>, <code>pre</code>{' '}
        and <code>hr</code>) and the article styles those elements without classes, in the style's reading type. A lead
        paragraph set larger than the text can open the story, and a byline between two rules says who wrote it and
        when.
      </p>
      <p>
        Lines are kept to a readable length, counted in characters of the reading type, so they follow each style's type
        size. Each <code>h2</code> opens with an ink rule. <code>dropCap</code> enlarges the first letter, and{' '}
        <code>columns={'{2}'}</code> sets the text in two columns with a rule between them, but only where the article
        is wide enough. The reading type is the style's: a serif in <code>editorial</code>, the sans elsewhere.
      </p>
    </>
  ),
  examples: [
    {
      id: 'story',
      title: 'A story',
      description: (
        <p>
          A lead, a byline and the story in plain HTML, with headings, a list, a link, a quotation and inline code.
          Shown in the <code>editorial</code> style.
        </p>
      ),
    },
    {
      id: 'two-columns',
      title: 'Two columns and a drop cap',
      description: (
        <p>
          <code>columns={'{2}'}</code> with <code>measure="narrow"</code> and <code>dropCap</code>, like a page of a
          newsletter. Narrow the window and the text falls back to one column.
        </p>
      ),
    },
    {
      id: 'measure',
      title: 'Line length',
      description: (
        <p>
          <code>narrow</code> for short, quick lines, <code>default</code> for reading, and <code>wide</code> for short
          notices that are scanned rather than read. Shown in the <code>studio</code> style.
        </p>
      ),
    },
    {
      id: 'with-components',
      title: 'With a figure and a pull quote',
      description: (
        <p>
          Ordinate components can sit between the paragraphs, such as a <a href="#/components/figure">Figure</a> and a{' '}
          <a href="#/components/pull-quote">PullQuote</a>.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the text of a story, an essay, a recipe or an about page on a website.',
      'With the story written as plain HTML elements, the way a content system or Markdown produces it.',
      'With two columns only for short pieces, such as notices or minutes, that the reader takes in at a glance.',
    ],
    avoid: [
      <>
        For text in an application, such as help or a description. Use{' '}
        <a href="#/components/text-content">TextContent</a>, which sets the interface type.
      </>,
      <>
        For a teaser that leads to the story. Use a <a href="#/components/story-card">StoryCard</a>.
      </>,
      'Two columns for a long story. Readers have to scroll back up at the foot of each column.',
      'A drop cap on more than one article on a page.',
    ],
    writing: [
      'Write the lead as one or two sentences that sum up the story. It is not the first paragraph repeated.',
      'Write the byline as the author, any other credits and the date: "By Tom Lindqvist · 4 November 2026".',
      'Start sections at h2 and do not skip levels; the page title above the article is the h1.',
    ],
  },
  accessibility: [
    'The article renders your HTML as it is, so headings, lists, links and quotations keep their meaning for screen readers. Give it a sound outline.',
    'The drop cap only enlarges the first letter. The letter stays part of the word, so it is read and copied as usual.',
    'Columns change the layout only; the reading order stays the order of the HTML.',
    <>
      The article renders a <code>div</code>. Wrap it in an <code>article</code> or <code>main</code> element, for
      example with <a href="#/components/style-scope">StyleScope</a>'s <code>tagOverride</code>, so the story is a
      landmark.
    </>,
  ],
  related: ['text-content', 'figure', 'pull-quote', 'story-card'],
};

export default doc;
