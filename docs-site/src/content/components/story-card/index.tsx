// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'StoryCard',
  folder: 'story-card',
  group: 'website-content',
  summary: 'Leads a reader to a story with its headline, a line about it and who wrote it.',
  description: (
    <>
      <p>
        A story card is a teaser on a journal's front page or in a "More stories" row. From the top it stacks an
        optional picture, a large ordinal, a kicker in small capitals such as the section or the reading time, the
        headline, a sentence or two of summary and the byline. Only the headline is required.
      </p>
      <p>
        The card has no box. <code>variant="ruled"</code> draws an ink rule above it for columns of stories, and{' '}
        <code>feature</code> sets a larger headline and summary for the lead story. With an <code>href</code> the
        headline becomes a link and a click anywhere on the card follows it. The headline takes the style's headline
        type, so it is a serif in <code>editorial</code> and condensed in <code>shopfront</code>.
      </p>
    </>
  ),
  examples: [
    {
      id: 'teasers',
      title: 'A row of stories',
      description: (
        <p>
          Three linked teasers with pictures, kickers and bylines, in the <code>editorial</code> style. Each picture has
          an empty <code>alt</code> because the headline says what the story is.
        </p>
      ),
    },
    {
      id: 'feature',
      title: 'Lead story',
      description: (
        <p>
          <code>feature</code> for the main story of the page, beside two plain teasers. A link in the byline, here the
          author's name, stays clickable on its own above the card's link.
        </p>
      ),
    },
    {
      id: 'numbered',
      title: 'Also in this issue',
      description: (
        <p>
          <code>ruled</code> cards with a <code>number</code>, for a column of further reading. The number is decoration
          and hidden from screen readers; when the order matters, put the cards in an ordered list.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For links to stories, essays, recipes or news on a website: a front page, a section page, related reading.',
      <>
        With <code>feature</code> for one lead story per page, and the default or <code>ruled</code> variant for the
        rest.
      </>,
    ],
    avoid: [
      <>
        For a piece of work in a portfolio. Use a <a href="#/components/plate">Plate</a>.
      </>,
      <>
        For a list of many titles without summaries. Use an <a href="#/components/index-list">IndexList</a>.
      </>,
      <>
        In an application screen. Use an <a href="#/components/item-card">ItemCard</a> or{' '}
        <a href="#/components/action-card">ActionCard</a>.
      </>,
    ],
    writing: [
      'Use the story’s real headline. Do not shorten it into a label.',
      'Keep the summary to one or two sentences that make the reader want the rest.',
      'Use one kind of kicker per row: all sections, or all reading times.',
      'Write the byline as the author and the date or the reading time: "Ines Moreau · 5 min read".',
    ],
  },
  accessibility: [
    <>
      The card is an <code>article</code> with its headline in a heading, level 3 by default. Set{' '}
      <code>headingLevel</code> to fit the page outline, such as 2 for cards directly under the page title.
    </>,
    'With an href, the headline is the card’s only link. The whole card is clickable, but keyboard and screen reader users meet one link, named by the headline.',
    'Links in the kicker and byline stay clickable on their own, above the card’s link.',
    'The number is hidden from screen readers.',
    'The hover fade on the picture is turned off under reduced motion.',
  ],
  related: ['plate', 'index-list', 'article', 'media'],
};

export default doc;
