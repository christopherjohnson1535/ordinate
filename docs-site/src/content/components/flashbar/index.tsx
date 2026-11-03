// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Flashbar',
  folder: 'flashbar',
  group: 'status',
  summary: 'Shows notifications about what happened in the background or after an action, at the top of the page.',
  description: (
    <>
      <p>
        A flashbar is a stack of <a href="#/components/alert">Alert</a> margin notes, newest first. Each item opens with
        a construction line in its status color and names its kind in the margin. Items use the same status words as
        Alert: <code>note</code>, <code>complete</code>, <code>caution</code> and <code>fault</code>. An item with{' '}
        <code>loading</code> turns its icon into the underway spinner and reads &quot;Underway&quot; in the margin.
      </p>
      <p>
        With <code>stackItems</code>, two or more items collapse to the first one. A summary row under it keys each kind
        with a square and a count, like the legend of a drawing, beside a button that shows them all.
      </p>
    </>
  ),
  marks: ['M1', 'M2', 'M4', 'M6'],
  examples: [
    {
      id: 'types',
      title: 'Types',
      description: (
        <p>
          The four types and an item that is <code>loading</code>. The page owns the list: add an item when something
          happens and remove it when it no longer applies.
        </p>
      ),
    },
    {
      id: 'dismiss',
      title: 'Actions and dismissing',
      description: (
        <p>
          <code>action</code> puts a button under the message. A <code>dismissible</code> item calls{' '}
          <code>onDismiss</code>; remove it from <code>items</code> there. <code>ariaRole=&quot;alert&quot;</code> makes
          screen readers announce the fault at once.
        </p>
      ),
    },
    {
      id: 'progress',
      title: 'Progress of an operation',
      description: (
        <p>
          Put a <a href="#/components/progress-bar">ProgressBar</a> with the <code>flash</code> variant in the content.
          When the work is done, switch the item to <code>complete</code> and turn off <code>loading</code>.
        </p>
      ),
    },
    {
      id: 'stacked',
      title: 'Stacked',
      description: (
        <p>
          Stacking keeps a long list from pushing the page down. The summary counts faults first, then cautions,
          complete, notes and underway. Add and dismiss items to see it change.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the result of something the user started that finishes later or on another page, such as a deployment.',
      'For events in the background that affect the whole page, such as a lost connection.',
      <>
        At the top of the page, in the <code>notifications</code> slot of an{' '}
        <a href="#/components/app-layout">AppLayout</a>.
      </>,
    ],
    avoid: [
      <>
        For a message about one section or form. Use an <a href="#/components/alert">Alert</a> in that section.
      </>,
      <>
        For the state of one item in a list. Use a <a href="#/components/status-indicator">StatusIndicator</a>.
      </>,
      'Keeping completed items on screen for long. Let the user dismiss them, or remove them when the user moves on.',
    ],
    writing: [
      'Put the subject first in the header: "vault-store failed its health check", not "Health check failed for vault-store".',
      'Say what to do next in the content, and name the action with a verb.',
      'When an underway item finishes, change its header to say the result rather than adding a new item.',
    ],
  },
  accessibility: [
    'The items are a list named "Notifications".',
    <>
      Each item is read to screen readers when it appears and again when its text changes. By default the announcement
      waits for the screen reader to finish; <code>ariaRole=&quot;alert&quot;</code> interrupts it. Keep that for
      problems the user must act on at once.
    </>,
    <>
      The margin names the kind of item, so the icon is decorative unless you set <code>statusIconAriaLabel</code>.
    </>,
    <>
      The button under a stack has <code>aria-expanded</code> and controls the list. Hidden items are removed from the
      accessibility tree until the stack is expanded.
    </>,
    'Under reduced motion, new items appear without fading in.',
  ],
  related: ['alert', 'progress-bar', 'status-indicator', 'live-region'],
};

export default doc;
