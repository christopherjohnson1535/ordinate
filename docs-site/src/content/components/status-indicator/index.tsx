// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'StatusIndicator',
  folder: 'status-indicator',
  group: 'status',
  summary: 'Says what state something is in, such as Running or Failed, with a mark and a few words.',
  description: (
    <>
      <p>
        A status indicator is a mark followed by text. Only the mark carries color; the text stays in a quiet ink, so a
        column full of states reads calmly and the shape of each mark still tells the states apart.
      </p>
      <p>
        The states are named like their icons. <code>note</code>, <code>complete</code>, <code>caution</code>,{' '}
        <code>fault</code> and <code>underway</code> are the status words used across the library, in the same colors as
        Alert, Flashbar, Badge and ProgressBar. <code>waiting</code>, <code>queued</code> and <code>halted</code> are
        quiet gray states, and <code>loading</code> turns the mark into a spinner.
      </p>
    </>
  ),
  examples: [
    {
      id: 'states',
      title: 'States',
      description: (
        <p>
          The five status words on the left, the quiet states and <code>loading</code> on the right. Underway and
          loading share the note color, because both mean work is going on.
        </p>
      ),
    },
    {
      id: 'in-a-table',
      title: 'In a table',
      description: (
        <p>
          The most common place for it. Map your own states to the marks, and keep the words your users know. Start or
          stop a service to watch it pass through underway.
        </p>
      ),
    },
    {
      id: 'tone-and-label',
      title: 'Labels, tone and long text',
      description: (
        <p>
          When the text is a time and not a state, name the mark with <code>iconAriaLabel</code>. <code>tone</code>{' '}
          changes the color of the mark but keeps its shape. <code>wrapText=&#123;false&#125;</code> keeps the text on
          one line and cuts it off with an ellipsis.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the state of a resource or a task in a table, a list or a key-value pair.',
      'For a short result next to the control that caused it, such as Saved next to a form.',
    ],
    avoid: [
      <>
        For a message that needs a sentence or an action. Use an <a href="#/components/alert">Alert</a>.
      </>,
      <>
        For a fixed category or severity. Use a <a href="#/components/badge">Badge</a>.
      </>,
      <>
        For progress you can measure. Use a <a href="#/components/progress-bar">ProgressBar</a>.
      </>,
      'Overriding the tone so that a mark says something its shape does not, such as a green fault.',
    ],
    writing: [
      'Use the words your users use for the state: "Running", "Stopped", not the name of the mark.',
      'Keep it to a few words. Put the detail in a popover or in the page it links to.',
      'For an ongoing state, use a present participle: "Starting", "Rolling out".',
    ],
  },
  accessibility: [
    <>
      The mark is decorative and the text is read. Set <code>iconAriaLabel</code> when the text alone does not say the
      state; the mark is then read as an image with that name.
    </>,
    'The marks differ in shape as well as color, so states can be told apart without color.',
    <>
      A change of state is not announced on its own. Wrap the indicator in a{' '}
      <a href="#/components/live-region">LiveRegion</a> if the user needs to hear it.
    </>,
  ],
  related: ['badge', 'alert', 'progress-bar', 'spinner', 'live-region'],
};

export default doc;
