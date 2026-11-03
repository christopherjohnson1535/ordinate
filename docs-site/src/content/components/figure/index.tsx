// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Figure',
  folder: 'figure',
  group: 'website-content',
  summary: 'Puts a caption, a reference and a credit under a picture, chart or drawing.',
  description: (
    <>
      <p>
        A figure is a picture with the words that go with it. It renders a <code>figure</code> element with the picture
        on top and a <code>figcaption</code> below: an optional label such as "Fig. 1" set in small mono capitals, the
        caption, and the credit in small type after it.
      </p>
      <p>
        The picture is anything you pass as <code>media</code>: usually a <a href="#/components/media">Media</a>, but a
        chart or a drawing works the same way. The caption keeps to a comfortable line length even when the picture runs
        wider.
      </p>
    </>
  ),
  examples: [
    {
      id: 'photograph',
      title: 'A photograph with a caption',
      description: (
        <p>
          The label, caption and credit together. Each part is optional; the caption line is left out when all three are
          missing.
        </p>
      ),
    },
    {
      id: 'chart',
      title: 'A chart as a figure',
      description: (
        <p>
          Any picture can be the <code>media</code>, here a <a href="#/components/bar-chart">BarChart</a> from{' '}
          <code>@ordinate/charts</code>. The caption says what the chart shows, so a reader who skims gets the point.
          Shown in the <code>editorial</code> style.
        </p>
      ),
    },
    {
      id: 'plates',
      title: 'Numbered drawings',
      description: (
        <p>
          A label numbers each figure so the text can refer to it. Shown in the <code>studio</code> style, where the
          captions read like a catalogue.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a picture, chart or drawing that needs a caption, a reference or a credit.',
      'For figures the text refers to by number, such as "see Fig. 2".',
    ],
    avoid: [
      <>
        For a piece of work that links to its own page. Use a <a href="#/components/plate">Plate</a>.
      </>,
      <>
        For a teaser of a story. Use a <a href="#/components/story-card">StoryCard</a>.
      </>,
      <>
        For a picture with nothing to say about it. Use <a href="#/components/media">Media</a> on its own.
      </>,
    ],
    writing: [
      'Say what the reader cannot see in the picture: the place, the date, what changed. Do not repeat the alt text.',
      'Keep the label short and consistent across the page: "Fig. 1", "Fig. 2", or "Plate I", "Plate II".',
      'Write the credit as the kind of work and the name: "Photo: Ana Ruiz", "Drawings: Harbour & Pine".',
    ],
  },
  accessibility: [
    <>
      The figure is a <code>figure</code> element with a <code>figcaption</code>, so screen readers announce the caption
      with the picture.
    </>,
    'The caption does not replace the picture’s own text alternative: give an image its alt and a chart its aria-label.',
  ],
  related: ['media', 'plate', 'article', 'pull-quote'],
};

export default doc;
