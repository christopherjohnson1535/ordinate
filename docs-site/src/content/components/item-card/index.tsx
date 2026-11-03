// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ItemCard',
  folder: 'item-card',
  group: 'collections',
  summary: 'Shows one item, such as a node or a document, with its name, properties and actions.',
  description: (
    <>
      <p>
        An item card has no box. Crop marks stand at its four corners in the color of its <code>kind</code>, and a{' '}
        <code>reference</code> such as R2 sits at the end of the header row in the same color. Selecting the card closes
        the marks into an ink frame and turns the reference ink.
      </p>
      <p>
        ItemCard is the card that <a href="#/components/cards">Cards</a> draws for each item. Use it on its own for a
        handful of cards you lay out yourself, or for one item shown inside another surface with the{' '}
        <code>embedded</code> variant.
      </p>
    </>
  ),
  marks: ['M5', 'M8', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'An item with actions',
      description: (
        <p>
          The header names the item, usually as a link to its page. The description says what it is, the body holds
          its properties and the footer says when it last changed. Actions go at the end of the header row.
        </p>
      ),
    },
    {
      id: 'kinds',
      title: 'Kinds and references',
      description: (
        <p>
          <code>kind</code> colors the crop marks and the reference. Pair it with a reference whose letter says the
          same thing: C for configuration, R for resource, P for policy.
        </p>
      ),
    },
    {
      id: 'selection',
      title: 'Selection',
      description: (
        <p>
          Put a Checkbox or a RadioButton in <code>selectionControl</code> and set <code>selected</code> to match it.
          The ink frame only draws the choice; the control is what screen readers announce.
        </p>
      ),
    },
    {
      id: 'media-and-embedded',
      title: 'Media and the embedded variant',
      description: (
        <p>
          <code>media</code> runs across the top of the card. The <code>embedded</code> variant drops the marks and
          padding, for a card inside a Container or a Popover that already frames it.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a few items laid out by hand, such as the nodes of a small cluster or the documents of a project.',
      'For a summary of one item inside a popover, a side panel or a container, with the embedded variant.',
    ],
    avoid: [
      <>
        For a list of items that the user filters, pages or selects from. Use{' '}
        <a href="#/components/cards">Cards</a>, which draws these cards for you, or a{' '}
        <a href="#/components/table">Table</a>.
      </>,
      <>
        For a card whose whole surface starts an action. Use an <a href="#/components/action-card">ActionCard</a>.
      </>,
      'A kind color with no matching reference or wording: color alone does not carry the meaning.',
    ],
    writing: [
      'Use the item’s own name for the header, as it appears elsewhere in the product.',
      'Keep the description to a short line that says what the item is, such as "m7.large in us-mountain-1a".',
      'Put dates and authors in the footer: "Changed 2 hours ago by Dana Ruiz".',
    ],
  },
  accessibility: [
    'The card is a plain block with no role of its own. Use a link in the header to make the item reachable by keyboard.',
    <>
      A selected card only looks different. Pair <code>selected</code> with a control in <code>selectionControl</code>{' '}
      that has an accessible name, such as <code>ariaLabel="Select node-02"</code>.
    </>,
    <>
      Give an icon button or button dropdown in <code>actions</code> an <code>ariaLabel</code> that names the item, so
      several cards do not read the same.
    </>,
    'The crop marks are drawing only and hidden from screen readers. The reference is text and is read out.',
    <>
      <code>disabled</code> hatches and dims the card but does not disable the controls inside it; disable those
      yourself.
    </>,
  ],
  related: ['cards', 'action-card', 'container', 'key-value-pairs'],
};

export default doc;
