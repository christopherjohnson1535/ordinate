// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Popover',
  folder: 'popover',
  group: 'overlays',
  summary: 'Shows more about a word, a value or an icon in a small panel tied to it, on a click.',
  description: (
    <>
      <p>
        A popover is a callout: a plate tied to its trigger by a leader that runs from an ink dot at the trigger to the
        plate&apos;s nearest edge. The plate fades in and rises onto its 4 px offset, and the leader follows the side
        the plate lands on. A text trigger is a button drawn as text with a dotted underline.
      </p>
      <p>
        The popover opens and closes itself on a click of its trigger. Escape and a click outside close it. With the
        default close button, focus moves into the plate when it opens.
      </p>
    </>
  ),
  marks: ['M9', 'M7', 'M13'],
  examples: [
    {
      id: 'text-trigger',
      title: 'Detail behind a value',
      description: (
        <p>
          With the default <code>text</code> trigger, the words in the sentence open the popover. The{' '}
          <code>header</code> names it; the content can hold a link to go further.
        </p>
      ),
    },
    {
      id: 'custom-trigger',
      title: 'Your own trigger',
      description: (
        <p>
          With <code>triggerType="custom"</code>, pass your own focusable element, such as an icon button, as{' '}
          <code>children</code>. <code>size</code> sets the largest width of the plate.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'positions',
      title: 'Positions',
      description: (
        <p>
          <code>position</code> picks the side; <code>right</code> and <code>left</code> follow the reading direction.
          When there is no room on that side, the popover opens on the opposite one. Without <code>dismissButton</code>,
          focus stays on the trigger.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'portal',
      title: 'Rendered with a portal',
      description: (
        <p>
          <code>renderWithPortal</code> attaches the plate to the end of the page body, so a container that clips its
          content, such as a scrolling table, cannot cut it off. A portaled popover follows the page&apos;s mode and
          revision, not the example toolbar&apos;s.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a short explanation of a value, a term or a status, kept off the page until someone asks for it.',
      'For details with a link or a small action, which a tooltip cannot hold.',
    ],
    avoid: [
      <>
        For a label of an icon button. Use a <a href="#/components/tooltip">Tooltip</a>.
      </>,
      <>
        For a task the user has to finish. Use a <a href="#/components/modal">Modal</a> or a{' '}
        <a href="#/components/dialog">Dialog</a>.
      </>,
      <>
        For help about a whole page or form. Use a <a href="#/components/help-panel">HelpPanel</a>.
      </>,
      'For information everyone needs. Put it on the page.',
    ],
    writing: [
      'Give the popover a header that names what it explains: "Memory", "Log retention".',
      'Keep the content to two or three sentences.',
      'Make a text trigger the words that the popover explains, not "more" or "details".',
    ],
  },
  accessibility: [
    <>
      A text trigger is a native <code>&lt;button&gt;</code> with <code>aria-haspopup="dialog"</code> and{' '}
      <code>aria-expanded</code>. A custom trigger must be focusable on its own, such as a Button.
    </>,
    <>
      The plate has <code>role="dialog"</code>, named by the <code>header</code>, or by the trigger when there is no
      header.
    </>,
    'With the close button, focus moves into the plate when it opens, and Tab and Shift+Tab cycle inside it. Without it, focus stays on the trigger.',
    'Escape closes the popover and returns focus to the trigger, without closing a modal around it. The close button returns focus too. A click outside closes it without moving focus.',
    <>
      The close button is named by <code>dismissAriaLabel</code>, &ldquo;Close popover&rdquo; by default.
    </>,
  ],
  related: ['tooltip', 'dialog', 'help-panel', 'link'],
};

export default doc;
