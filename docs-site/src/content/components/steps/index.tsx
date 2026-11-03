// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Steps',
  folder: 'steps',
  group: 'guided-flows',
  summary: 'Shows how far a sequence of steps has got, and how each step went.',
  description: (
    <>
      <p>
        Steps hang their status icons on a faint construction line. Each step is numbered with an S reference, S1, S2
        and so on, as the Wizard numbers its steps, so a step can be pointed at in words. Only the icon takes the status
        color; the header stays in ink. The line leading into a <code>waiting</code> or <code>queued</code> step is
        dashed, like a hidden line on a drawing, to show the part of the sequence not reached yet.
      </p>
      <p>
        Steps show progress and do nothing when clicked. Set each step&rsquo;s <code>status</code> from the state of the
        work it stands for.
      </p>
    </>
  ),
  marks: ['M1', 'M8'],
  examples: [
    {
      id: 'deployment',
      title: 'A process in progress',
      description: (
        <p>
          A deployment part way through. <code>details</code> holds a time, a count or a link. Set{' '}
          <code>statusIconAriaLabel</code> where the header does not say how the step went.
        </p>
      ),
    },
    {
      id: 'failed',
      title: 'A failed step',
      description: (
        <p>
          Say in the details what went wrong and what to do. Steps that did not run after a failure are{' '}
          <code>halted</code>.
        </p>
      ),
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: (
        <p>
          <code>horizontal</code> places a short sequence side by side, with the line running across, in a wide space.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the progress of a process the system runs, such as a deployment, an import or a repair.',
      'Next to the thing being processed, so the user can see where it is without opening anything.',
    ],
    avoid: [
      <>
        For steps the user fills in. Use a <a href="#/components/wizard">Wizard</a>.
      </>,
      <>
        For the state of a single thing. Use a <a href="#/components/status-indicator">StatusIndicator</a>.
      </>,
      <>
        For progress that is one number, such as a percentage. Use a <a href="#/components/progress-bar">ProgressBar</a>
        .
      </>,
    ],
    writing: [
      'Name each step after what it does, starting with a verb: "Build image", "Verify health checks".',
      'Keep details to one line: a time, a count, or what went wrong and what to do.',
    ],
  },
  accessibility: [
    'The steps are an ordered list. Name it with ariaLabel or ariaLabelledby.',
    <>
      The status icon is decorative unless you set <code>statusIconAriaLabel</code>. Set it whenever the header does not
      already say how the step went.
    </>,
    'Each step’s S reference is read before its header, as in "S2 Build image". The line between the icons is drawing only.',
    <>
      Steps that change while the user watches are not announced. Use a{' '}
      <a href="#/components/live-region">LiveRegion</a> for changes the user must hear, such as a failure.
    </>,
  ],
  related: ['wizard', 'status-indicator', 'progress-bar', 'live-region'],
};

export default doc;
