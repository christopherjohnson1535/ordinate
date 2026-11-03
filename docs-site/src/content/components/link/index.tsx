// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Link',
  folder: 'link',
  group: 'actions',
  summary: 'Takes the user to another page or place, from running text or a list.',
  description: (
    <>
      <p>
        A link is ink text. The <code>primary</code> variant, for links inside other text, has a light underline that
        turns ink on hover; the <code>secondary</code> variant, the default, is underlined only on hover. The words
        never change color, only the line under them.
      </p>
      <p>
        An <code>external</code> link ends in a small diagonal leader, the mark for &ldquo;goes somewhere else&rdquo;,
        and opens in a new tab. A link without an <code>href</code> renders as a button, for actions such as opening a
        help panel.
      </p>
    </>
  ),
  marks: ['M7'],
  examples: [
    {
      id: 'variants',
      title: 'In text and in lists',
      description: (
        <p>
          Use <code>primary</code> when the link sits among other words, so its underline shows it is a link. Use the
          default <code>secondary</code> where the context already says so, such as a list of links.
        </p>
      ),
    },
    {
      id: 'external',
      title: 'External links',
      description: (
        <p>
          <code>external</code> adds the leader after the text and opens the link in a new tab. Set{' '}
          <code>externalIconAriaLabel</code> so screen readers hear that it opens a new tab.
        </p>
      ),
    },
    {
      id: 'info-and-values',
      title: 'Info links and large values',
      description: (
        <p>
          An <code>info</code> link is a small bold link next to a label that opens help. A <code>value-large</code>{' '}
          link shows a count as a link to the list it counts; give it an <code>ariaLabel</code> that says what the
          number is.
        </p>
      ),
    },
    {
      id: 'client-routing',
      title: 'Routing on the client',
      description: (
        <p>
          <code>onFollow</code> fires on a plain left click or Enter. Call <code>preventDefault()</code> there and hand
          the <code>href</code> to your router. Clicks with a modifier key still open the link the browser&apos;s way.
        </p>
      ),
    },
    {
      id: 'font-sizes',
      title: 'Font sizes',
      description: (
        <p>
          <code>fontSize</code> matches the link to the text around it. <code>inherit</code> takes the size of its
          parent, such as a heading.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To go to another page, or to a section of this one.',
      'For links in running text, table cells, alerts and descriptions, with the primary variant.',
      'For an info link next to a label or heading that opens help content.',
    ],
    avoid: [
      <>
        For an action that changes something, such as saving or deleting. Use a <a href="#/components/button">Button</a>
        .
      </>,
      <>
        For the main way forward on a page. Use a primary <a href="#/components/button">Button</a> with an{' '}
        <code>href</code>.
      </>,
      <>
        A <code>javascript:</code> URL in <code>href</code>. Handle the click in <code>onFollow</code> instead.
      </>,
    ],
    writing: [
      'Say where the link goes: "maintenance guide", not "click here" or "learn more".',
      'Keep the link to the words that name the destination, not the whole sentence.',
      'Label info links "Info".',
    ],
  },
  accessibility: [
    <>
      With an <code>href</code> the link is a native <code>&lt;a&gt;</code>, reachable with Tab and followed with Enter.
      Without one it is an <code>&lt;a&gt;</code> with <code>role="button"</code>, and Enter and Space call{' '}
      <code>onFollow</code>.
    </>,
    <>
      The external leader is announced with <code>externalIconAriaLabel</code>. Without it, the default label is
      &ldquo;Opens in a new tab&rdquo;.
    </>,
    <>
      A link to a new tab gets <code>rel="noopener noreferrer"</code> unless you set <code>rel</code>.
    </>,
    <>
      Set <code>ariaLabel</code> when the text alone does not say where the link goes, such as a bare number in a{' '}
      <code>value-large</code> link.
    </>,
  ],
  related: ['button', 'breadcrumb-group', 'side-navigation', 'help-panel'],
};

export default doc;
