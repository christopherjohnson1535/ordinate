// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'LiveRegion',
  folder: 'live-region',
  group: 'status',
  summary: 'Reads a change on the page to screen reader users as it happens.',
  description: (
    <>
      <p>
        A live region has no look of its own. Its children render as they are, and their text is handed to screen
        readers when the region mounts and again whenever the text changes. Changes that come quickly, such as a count
        updated on every keystroke, are gathered for half a second and read once.
      </p>
      <p>
        The examples below print what the region hands to screen readers under the controls, so you can see what is
        heard. That readout is part of the demonstration, not of the component.
      </p>
    </>
  ),
  examples: [
    {
      id: 'filter-count',
      title: 'A count that follows a filter',
      description: (
        <p>
          The number of matches is visible to everyone and read politely to screen reader users. Type a few characters
          quickly: only the final count is read.
        </p>
      ),
    },
    {
      id: 'save-status',
      title: 'Inline status and an urgent message',
      description: (
        <p>
          With <code>tagName=&quot;span&quot;</code> the region sits inside a line of text. The second region is{' '}
          <code>hidden</code> and <code>assertive</code>: nothing shows, and the failure interrupts the screen reader.
          The status icon is <code>aria-hidden</code>, so only the words are read.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a result that appears without moving focus: a count of filtered items, a saved state, a finished upload.',
      'Around text that is already on the page, so sighted and screen reader users get the same message.',
      <>
        With <code>hidden</code> for a short message that only matters to screen reader users, such as a summary of a
        change that is clear on screen.
      </>,
    ],
    avoid: [
      'For content that changes all the time, such as a clock or a live log. The reader would hear nothing else.',
      <>
        Wrapping a <a href="#/components/flashbar">Flashbar</a> or a <a href="#/components/progress-bar">ProgressBar</a>
        . They announce their own changes, so the text would be read twice.
      </>,
      <>
        <code>assertive</code> for anything that can wait. It cuts off whatever the user is listening to.
      </>,
    ],
    writing: [
      'Make the text complete on its own: "8 nodes match", not "8".',
      'Keep it short. The whole region is read every time it changes.',
    ],
  },
  accessibility: [
    <>
      The text is copied into a separate element with <code>aria-live=&quot;polite&quot;</code> (or{' '}
      <code>assertive</code>) and <code>aria-atomic=&quot;true&quot;</code>, which is in the page before any text
      arrives so screen readers notice the first change.
    </>,
    'The text is announced only when it differs from the last announcement, so re-rendering with the same words is silent.',
    <>
      Elements marked <code>aria-hidden=&quot;true&quot;</code> are left out of the announcement, and elements with{' '}
      <code>role=&quot;img&quot;</code> are read by their <code>aria-label</code>.
    </>,
    'Moving focus is still the better choice when the user must act on the message; see Alert.',
  ],
  related: ['alert', 'flashbar', 'status-indicator', 'progress-bar'],
};

export default doc;
