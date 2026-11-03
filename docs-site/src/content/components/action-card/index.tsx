// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ActionCard',
  folder: 'action-card',
  group: 'collections',
  summary: 'Starts a task or opens a page from a card that names the action and explains it.',
  description: (
    <>
      <p>
        An action card is one button, or one link, drawn as a card. It has no box: crop marks stand at its four corners
        in the color of its <code>kind</code>, and a leader arrow at the end of the header row says the card goes
        somewhere. While the pointer is over the card the marks reach a little further and the leader moves toward the
        edge.
      </p>
      <p>
        With an <code>href</code> the card renders a link; without one it renders a button and calls{' '}
        <code>onClick</code>. Because the whole card is the control, it can hold only text.
      </p>
    </>
  ),
  marks: ['M5', 'M7', 'M12'],
  examples: [
    {
      id: 'start-tasks',
      title: 'Starting points',
      description: (
        <p>
          A row of action cards offers the first steps on an empty page. Each card says what happens in its header and
          why you would do it in its description.
        </p>
      ),
    },
    {
      id: 'kinds',
      title: 'Kinds',
      description: (
        <p>
          <code>kind</code> colors the crop marks for what the action works on: <code>configuration</code>,{' '}
          <code>resource</code>, <code>policy</code> or <code>neutral</code>. The header still says it in words.
        </p>
      ),
    },
    {
      id: 'links',
      title: 'Cards that go to a page',
      description: (
        <p>
          With <code>href</code> the card is a link. <code>onFollow</code> fires on a plain left click or Enter; call{' '}
          <code>preventDefault()</code> on it to route on the client. With <code>target="_blank"</code> the link opens
          a new tab.
        </p>
      ),
    },
    {
      id: 'disabled',
      title: 'Unavailable actions',
      description: (
        <p>
          <code>disabled</code> hatches the card, grays its text and stops the action. Put the reason in the
          description, because the hatch only says that the action is not available.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a few large starting points on an empty or overview page, such as "Create a cluster" or "Import a drawing set".',
      'When an action needs a sentence of explanation that would not fit on a button.',
    ],
    avoid: [
      <>
        For an action inside a form or a toolbar. Use a <a href="#/components/button">Button</a>.
      </>,
      <>
        For showing an item with its own controls, links or properties. Use an{' '}
        <a href="#/components/item-card">ItemCard</a>.
      </>,
      <>
        For choosing one option of several. Use <a href="#/components/tiles">Tiles</a> or a <a href="#/components/radio-group">RadioGroup</a>.
      </>,
      'Putting links, buttons or other controls inside the card: the card is already one control.',
    ],
    writing: [
      'Start the header with a verb and say what happens: "Create a cluster", "Invite people".',
      'Keep the description to one sentence about why or when to take the action.',
      'Use sentence case and no closing punctuation in the header.',
    ],
  },
  accessibility: [
    'The card is a native <button>, or an <a> with an href, so it is reached with Tab and activated with Enter (and Space for a button).',
    <>
      The header names the card and the description describes it, through <code>aria-labelledby</code> and{' '}
      <code>aria-describedby</code>. Use <code>ariaLabel</code> only when the header alone does not say what the card
      does.
    </>,
    'The icon, crop marks and leader arrow are drawing only and are hidden from screen readers.',
    <>
      A disabled button card cannot be focused. A disabled link card loses its URL, keeps <code>role="link"</code> and
      is marked <code>aria-disabled</code>.
    </>,
    <>
      With <code>target="_blank"</code>, say in the header or description that a new tab opens.
    </>,
  ],
  related: ['item-card', 'cards', 'button', 'link'],
};

export default doc;
