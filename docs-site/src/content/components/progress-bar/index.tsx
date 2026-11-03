// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ProgressBar',
  folder: 'progress-bar',
  group: 'status',
  summary: 'Shows how far an operation has got, and then whether it finished or failed.',
  description: (
    <>
      <p>
        A progress bar is a dimension line that fills with ink. The line is drawn between two end ticks, and the measure
        is lettered in mono at the end of the label row. The <code>status</code> uses the library&apos;s status words:{' '}
        <code>underway</code> while the work runs, then <code>complete</code> or <code>fault</code>.
      </p>
      <p>
        When the operation ends, the percentage gives way to the state&apos;s icon and word, drawn like a{' '}
        <a href="#/components/status-indicator">StatusIndicator</a>. A complete bar fills the line; a faulted bar keeps
        its ink where it stopped and draws a stop mark there in the fault color.
      </p>
    </>
  ),
  marks: ['M3'],
  examples: [
    {
      id: 'underway',
      title: 'Underway',
      description: (
        <p>
          <code>value</code> runs from 0 to 100. Put what is happening in <code>label</code>, the subject in{' '}
          <code>description</code> and the time left in <code>additionalInfo</code>.
        </p>
      ),
    },
    {
      id: 'results',
      title: 'Complete and fault',
      description: (
        <p>
          <code>resultText</code> says what happened. After a fault, <code>resultButtonText</code> adds a button such as
          Retry; handle it with <code>onResultButtonClick</code>. Retry to watch the bar run to complete.
        </p>
      ),
    },
    {
      id: 'key-value',
      title: 'As a value in key-value pairs',
      description: (
        <p>
          The <code>key-value</code> variant fits under a key. The key is not linked to the bar, so name it again with{' '}
          <code>ariaLabel</code>.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For an operation that takes more than a few seconds and whose progress you can measure, such as an upload or a rollout.',
      <>
        Inside a <a href="#/components/flashbar">Flashbar</a> item, with the <code>flash</code> variant, for an
        operation that runs while the user does something else.
      </>,
    ],
    avoid: [
      <>
        For work whose progress you cannot measure. Use a <a href="#/components/spinner">Spinner</a> or a{' '}
        <a href="#/components/status-indicator">StatusIndicator</a> in the <code>loading</code> or <code>underway</code>{' '}
        state.
      </>,
      <>
        For a level that goes up and down, such as disk use. Use a <a href="#/components/measure">Measure</a>.
      </>,
      'Moving the bar backwards, except to start the operation again from zero.',
    ],
    writing: [
      'Write the label as what is being done: "Uploading north-annex.tar".',
      'Say how long is left in additionalInfo when you know it. Round it: "About 2 minutes left".',
      'Make the result text say what happened and, after a fault, what was kept or what to do.',
    ],
  },
  accessibility: [
    <>
      While underway, the bar has <code>role=&quot;progressbar&quot;</code> with its value from 0 to 100, is named by
      the label (or <code>ariaLabel</code> or <code>ariaLabelledby</code>) and described by the description and
      additional information. The printed percentage is hidden from screen readers so it is not read twice.
    </>,
    <>
      When the status turns <code>complete</code> or <code>fault</code>, the state and result text are announced through
      a live region. In the <code>flash</code> variant the Flashbar item announces them instead.
    </>,
    'The result button is a native button.',
    'Under reduced motion the fill jumps to its new length instead of sliding.',
  ],
  related: ['flashbar', 'measure', 'status-indicator', 'spinner'],
};

export default doc;
