// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';
import { Composition, Part } from './shared/composition';
import { onSheet } from './shared/on-sheet';

const page: LoadedExample = {
  meta: {
    id: 'website',
    title: 'Fixit Bikes, home page',
    description: (
      <p>
        The whole page, running. Switch the opening between split, masthead and statement with the control at the top.
        To change the voice, pick a style in the site&apos;s Display settings; the example follows it.
      </p>
    ),
    layout: 'flush',
    height: 'tall',
  },
  load: onSheet(() => import('../../../../pages/examples/website.page')),
  loadSource: () => import('../../../../pages/examples/website.page.tsx?raw').then(module => module.default),
};

const parts: ReadonlyArray<Part> = [
  {
    name: 'SiteHeader',
    folder: 'site-header',
    role: 'The brand, four links with Repairs as the current page, one primary action, and a notice strip with the opening hours. It stays at the top while the page scrolls.',
  },
  {
    name: 'Opening',
    folder: 'opening',
    role: (
      <>
        The first band: <code>split</code> for the shop, <code>masthead</code> for a journal, <code>statement</code> for
        a studio. The control above the page switches between them.
      </>
    ),
  },
  {
    name: 'Section',
    folder: 'section',
    role: (
      <>
        Three bands of content: the price list under a top rule, the classes in a narrow <code>accent</code> band, and
        the story in an <code>inverted</code> band under a double rule.
      </>
    ),
  },
  { name: 'ColumnLayout', folder: 'column-layout', role: 'The three repairs side by side, stacking on a phone.' },
  {
    name: 'CallToAction',
    folder: 'call-to-action',
    role: 'The newsletter sign-up: a heading, one reason, and a short form in place of buttons.',
  },
  { name: 'FormField', folder: 'form-field', role: 'Labels the email address field.' },
  { name: 'Input', folder: 'input', role: 'The email address, as an email input.' },
  { name: 'Button', folder: 'button', role: 'Book a repair, See prices, See the work, Our story and Subscribe.' },
  { name: 'Link', folder: 'link', role: 'Links inside the running text and the section actions.' },
  {
    name: 'SiteFooter',
    folder: 'site-footer',
    role: 'The brand again, three columns of links, the address and hours, and the legal line.',
  },
  {
    name: 'SpaceBetween',
    folder: 'space-between',
    role: 'Lines up the buttons, the legal links and the sign-up form.',
  },
  {
    name: 'SegmentedControl',
    folder: 'segmented-control',
    role: 'The control above the site that switches the opening. It is part of the demonstration, not of the site.',
  },
];

function Page() {
  return (
    <>
      <DocSection id="purpose" number={1} title="What the page is for">
        <Prose>
          <p>
            The home page of a small business: what it does, what it costs, why it can be trusted and how to get in
            touch. The same components that draw the consoles draw it, with a different style applied to the page.
          </p>
          <p>
            A style changes the voice, not the parts. With <code>console</code> the page keeps the drawing-set look;{' '}
            <code>shopfront</code> brings condensed headlines, cobalt and sunflower and rounded buttons;{' '}
            <code>editorial</code> and <code>studio</code> suit a journal and a practice. See{' '}
            <a href="#/packages/global-styles">Global styles</a> for <code>applyStyle</code>.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="parts" number={2} title="Parts" description="In the order they appear, from the top of the page.">
        <Composition parts={parts} />
      </DocSection>

      <DocSection id="decisions" number={3} title="Decisions">
        <Notes
          items={[
            <>
              <strong>One action, said the same way twice.</strong> Book a repair is the primary button in the header
              and in the opening. Every other button on the page is a normal one.
            </>,
            <>
              <strong>The opening says what the shop does.</strong> The title is a promise, &quot;Back on the road by
              teatime.&quot;, the kicker says what and where, and the badge carries the one fact people check first.
            </>,
            <>
              <strong>Bands set the rhythm.</strong> The page alternates the default background, a soft accent and an
              inverted band, so each section reads as its own subject without boxes around it.
            </>,
            <>
              <strong>Prices are in the text.</strong> Each repair names what it covers and its starting price, so the
              page answers the question before anyone has to call.
            </>,
            <>
              <strong>The sign-up asks for one thing.</strong> The call to action holds a form with a single email field
              and its button, in place of the usual actions.
            </>,
            <>
              <strong>The address is an address.</strong> The footer sets the street and hours in an{' '}
              <code>address</code> element, so it reads and copies as one.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="page" number={4} title="The page">
        <Example example={page} index={1} />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'website',
  title: 'Website',
  summary: 'A small business home page built from the website components, in any of the four styles.',
  order: 6,
  keywords: ['SiteHeader', 'SiteFooter', 'Opening', 'Section', 'CallToAction', 'shopfront', 'editorial', 'studio'],
  Page,
};

export default doc;
