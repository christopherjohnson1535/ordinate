// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Spinner',
  folder: 'spinner',
  group: 'status',
  summary: 'Shows that something is loading or running when you cannot say how far it has got.',
  description: (
    <>
      <p>
        The spinner is the <code>underway</code> icon, turning. It is the same mark that StatusIndicator, Flashbar and
        Alert show for work that is still running. Under reduced motion it stands still and still reads as underway.
      </p>
      <p>
        It is decorative and hidden from assistive technology, so always pair it with text that says what is loading.
        Buttons have their own <code>loading</code> state; use that rather than putting a spinner in a button.
      </p>
    </>
  ),
  examples: [
    {
      id: 'with-text',
      title: 'With text',
      description: (
        <p>
          The usual pattern: a spinner beside a sentence, in a <a href="#/components/live-region">LiveRegion</a> so the
          result is read when the work ends.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'sizes',
      title: 'Sizes and variants',
      description: (
        <p>
          <code>normal</code> matches an icon in body text; <code>big</code> and <code>large</code> are for an empty
          area waiting for content. <code>disabled</code> dims the mark. <code>inverted</code> is for dark fills and is
          not shown here.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'For a wait of a few seconds whose length you cannot measure, such as a lookup.',
      'Next to text that says what is happening.',
    ],
    avoid: [
      <>
        For an operation you can measure. Use a <a href="#/components/progress-bar">ProgressBar</a>.
      </>,
      <>
        For a state in a table or a list. Use a <a href="#/components/status-indicator">StatusIndicator</a> in the{' '}
        <code>loading</code> or <code>underway</code> state, which pairs the mark with its text.
      </>,
      <>
        For content whose shape you know. Use a <a href="#/components/skeleton">Skeleton</a>, so the layout does not
        jump.
      </>,
      <>
        Inside a button. Set the <a href="#/components/button">Button</a>&apos;s <code>loading</code> instead.
      </>,
    ],
    writing: ['Say what is happening with a verb in the present: "Checking which nodes are reachable".'],
  },
  accessibility: [
    <>
      The spinner is <code>aria-hidden</code>. Screen readers only learn about the wait from the text beside it.
    </>,
    'Announce the result when the work ends, for example by putting the text in a LiveRegion.',
    'Under reduced motion the mark does not turn.',
  ],
  related: ['status-indicator', 'progress-bar', 'skeleton', 'button'],
};

export default doc;
