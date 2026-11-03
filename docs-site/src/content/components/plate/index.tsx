// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Plate',
  folder: 'plate',
  group: 'website-content',
  summary: 'Shows one piece of work in a portfolio, with its picture and a catalogue caption, and links to its page.',
  description: (
    <>
      <p>
        A plate is an entry in a catalogue of work: the picture, then a caption that opens with a hairline. On the first
        line of the caption the reference ("Plate I", "No. 14") and the facts ("Lisbon, 2025") sit at either end in
        small mono capitals. Below them come the title in the style's headline type and a sentence about the work.
      </p>
      <p>
        With an <code>href</code> the title becomes a link and a click anywhere on the plate follows it; the picture
        fades a little on hover. The plate has no box and no offset, so a grid of plates reads as pictures on a page. It
        is not the lifted plate of a modal or menu.
      </p>
    </>
  ),
  examples: [
    {
      id: 'selected-work',
      title: 'Selected work',
      description: (
        <p>
          Three plates in a <a href="#/components/column-layout">ColumnLayout</a>, each linking to its project page.
          Shown in the <code>studio</code> style, which sets light, large titles. The pictures have an empty{' '}
          <code>alt</code> because the title right below names the work.
        </p>
      ),
    },
    {
      id: 'router',
      title: 'Following with a router',
      description: (
        <p>
          <code>onFollow</code> runs on a plain click on the plate. Call <code>event.preventDefault()</code> and route
          on the client with <code>event.detail.href</code>. Clicks with a modifier key open the link as usual.
        </p>
      ),
    },
    {
      id: 'caption-only',
      title: 'Without pictures',
      description: (
        <p>
          A plate without <code>media</code> or <code>href</code> is a catalogue caption on its own, for work that has
          no photographs yet or no page of its own.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a portfolio, a catalogue or a list of projects, where each item is a piece of work.',
      'In a grid of two or three columns, with the same aspect ratio for every picture.',
    ],
    avoid: [
      <>
        For a story or an article. Use a <a href="#/components/story-card">StoryCard</a>.
      </>,
      <>
        For a picture inside running text. Use a <a href="#/components/figure">Figure</a>.
      </>,
      <>
        For a long list of projects without pictures. Use an <a href="#/components/index-list">IndexList</a> with the{' '}
        <code>numbered</code> variant.
      </>,
      <>
        In an application screen. Use <a href="#/components/cards">Cards</a> or an{' '}
        <a href="#/components/item-card">ItemCard</a>.
      </>,
    ],
    writing: [
      'Name the work as the studio does, in sentence case: "Harbour House", "Oak chair, no. 4".',
      'Put the place and the year in meta, or the kind of work and the year.',
      'Keep the description to one sentence about what makes the work what it is.',
    ],
  },
  accessibility: [
    <>
      The plate is an <code>article</code> with its title in a heading, level 3 by default. Set{' '}
      <code>headingLevel</code> to fit the page outline.
    </>,
    'With an href, the title is the only link in the plate. The whole plate is clickable, but keyboard and screen reader users meet one link, named by the title.',
    'Links inside meta stay clickable on their own, above the plate’s link.',
    'Give the picture an empty alt when the title already names the work, so it is not read twice.',
    'Under reduced motion the picture dims at once on hover, without the fade.',
  ],
  related: ['figure', 'media', 'story-card', 'index-list'],
};

export default doc;
