// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Opening',
  folder: 'opening',
  group: 'website-frame',
  summary: 'Opens a website page with its title, a sentence about it and the first thing to do.',
  description: (
    <>
      <p>
        An opening is the first band of a website page, under the site header. It holds the page title, usually the
        page's only level 1 heading, set in the headline face of the page style: a serif in editorial, light and
        oversized in studio, condensed and heavy in shopfront. Around the title sit an optional kicker, badge, facts
        line, description, buttons and a row of section links.
      </p>
      <p>
        There are three layouts. <code>statement</code> sets one large sentence with a picture or drawing beside it.{' '}
        <code>split</code> puts the text on one side and frames the picture on a tinted panel on the other.{' '}
        <code>masthead</code> centers a very large title between printed rules, like the front page of a journal. The
        opening measures its own width, not the window's: below 688 pixels the picture moves under the text. The title
        is sized to the column it is set in, too, and in a narrow column it shrinks so a long word stays whole.
      </p>
    </>
  ),
  examples: [
    {
      id: 'split',
      title: 'Split, for a shop',
      description: (
        <p>
          A local business says what it does in one line and offers one main action. The example is in the{' '}
          <code>shopfront</code> style, which this layout was drawn for: the badge is a sunflower marker and the drawing
          sits on a tinted panel.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'statement',
      title: 'Statement, for a studio',
      description: (
        <p>
          One sentence, a drawing and a caption that names it. Shown in the <code>studio</code> style, where the
          headline is light and very large and the caption reads like a catalogue entry.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'masthead',
      title: 'Masthead, for a journal',
      description: (
        <p>
          The name of the publication between rules, with the issue in <code>meta</code> and the sections in{' '}
          <code>links</code>. Shown in the <code>editorial</code> style. Following a link calls <code>onFollow</code>,
          which here moves the current section instead of loading a page.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'media-start',
      title: 'Picture first',
      description: (
        <p>
          <code>mediaPosition="start"</code> puts the picture before the text when there is room for two columns. Use{' '}
          <a href="#/components/media">Media</a> for a photograph so it keeps its frame and alt text.
        </p>
      ),
      layout: 'flush',
    },
  ],
  guidelines: {
    use: [
      'At the top of a website page, directly under the site header, to say what the page or the business is.',
      'Once per page. The opening holds the page title, so a second one would give the page two titles.',
      <>
        <code>masthead</code> for a journal or newsletter front page, <code>split</code> for a shop or service with one
        main action, <code>statement</code> for a studio or portfolio that leads with its work.
      </>,
    ],
    avoid: [
      <>
        Inside an application screen. Use a <a href="#/components/header">Header</a> in a{' '}
        <a href="#/components/content-layout">ContentLayout</a>.
      </>,
      <>
        For the bands further down the page. Use a <a href="#/components/section">Section</a>, or a{' '}
        <a href="#/components/call-to-action">CallToAction</a> for a closing request.
      </>,
      'More than two buttons. Choose the main action and one quieter one.',
    ],
    writing: [
      'Write the title as a plain sentence about what you do or what the reader gets, such as "Back on the road by teatime."',
      'Keep the kicker to a few words that place the page: a trade and a town, or a studio name.',
      'Keep the badge to one short fact that changes, such as "Open Sundays". It is not a second title.',
      'Write a caption for a drawing or photograph that names it, as a catalogue would: what, where, and a scale or year.',
    ],
  },
  accessibility: [
    <>
      The title is a heading at level 1 by default. Set <code>headingLevel</code> when the page already has a level 1
      heading elsewhere.
    </>,
    <>
      The <code>links</code> row is a <code>nav</code> landmark named "Sections" by default; name it with{' '}
      <code>navigationAriaLabel</code>. The current link carries <code>aria-current="page"</code>.
    </>,
    <>
      <code>onFollow</code> fires only for a plain left click, so opening a link in a new tab still works as the browser
      expects.
    </>,
    <>
      With a <code>mediaCaption</code>, the media and caption form a <code>figure</code> and <code>figcaption</code>.
      Give pictures alt text, and hide drawings that only decorate with <code>aria-hidden</code>.
    </>,
    'The kicker sits above the title on screen but is a paragraph of its own, so a screen reader reads it before the heading.',
  ],
  related: ['section', 'site-header', 'call-to-action', 'media', 'style-scope'],
};

export default doc;
