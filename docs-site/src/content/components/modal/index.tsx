// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Modal',
  folder: 'modal',
  group: 'overlays',
  summary: 'Asks the user to confirm, decide or fill in something before they go back to the page.',
  description: (
    <>
      <p>
        A modal is a plate laid over a light paper veil, so the page recedes without going dark. It fades in and rises 4
        px onto its offset. A <code>reference</code> such as <code>P2</code> sits above the title in the color of the
        modal&apos;s <code>kind</code>, and the actions in the footer stand on a rule closed by hash marks.
      </p>
      <p>
        The modal is a native <code>&lt;dialog&gt;</code> opened with <code>showModal()</code>, so the browser keeps
        focus inside it and makes the rest of the page inert. It is controlled: open it from a button, and set{' '}
        <code>visible</code> to <code>false</code> in <code>onDismiss</code> and in the footer&apos;s actions.
      </p>
    </>
  ),
  marks: ['M9', 'M13', 'M8', 'M2'],
  examples: [
    {
      id: 'confirm',
      title: 'Confirming an action',
      description: (
        <p>
          The button opens the modal. The close button, Escape and a click on the veil all call <code>onDismiss</code>{' '}
          with a <code>reason</code>; the footer&apos;s buttons close it themselves. The modal opens in the top layer of
          the page, inside this example, so it follows the example&apos;s mode and revision.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'form',
      title: 'A short form',
      description: (
        <p>
          Edit a copy of the value and save it only from the primary action, so Cancel and Escape leave it unchanged.
          The <code>configuration</code> kind colors the <code>C2</code> reference and the footer&apos;s marks blue.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'growing-content',
      title: 'Content that grows',
      description: (
        <p>
          <code>position="top"</code> anchors the modal near the top of the viewport, so it grows downward instead of
          jumping as steps are added. <code>size="large"</code> gives it room for wider content.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'footer-only-dismiss',
      title: 'Closing from the footer',
      description: (
        <p>
          <code>hideDismissButton</code> removes the close button, so the user chooses between the footer&apos;s
          actions. Escape and a click on the veil still call <code>onDismiss</code>.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'To confirm an action that is destructive or hard to undo.',
      'For a short task that must be finished or cancelled before going on, such as renaming or a few settings.',
    ],
    avoid: [
      <>
        For a message that does not need an answer. Use an <a href="#/components/alert">Alert</a> or a{' '}
        <a href="#/components/flashbar">Flashbar</a>.
      </>,
      <>
        For a small question tied to one place on the page. Use a <a href="#/components/dialog">Dialog</a> next to it,
        or a <a href="#/components/popover">Popover</a> for extra detail.
      </>,
      'For long forms or several steps. Give them their own page.',
      'Opening a modal from another modal.',
      'Opening a modal when the page loads, without the user asking for it.',
    ],
    writing: [
      'Ask the question in the header when the modal confirms something: "Delete north-annex?".',
      'Say in the content what happens and whether it can be undone.',
      'Name the primary action after what it does, "Restart" or "Delete project", not "OK" or "Yes".',
    ],
  },
  accessibility: [
    <>
      The modal is a native <code>&lt;dialog&gt;</code> opened as a modal: focus moves into it, Tab stays inside it, the
      page behind it is inert, and focus returns to the element that opened it when it closes.
    </>,
    <>
      The <code>header</code> is a level 2 heading and names the dialog. Always set one: without it the modal has no
      accessible name.
    </>,
    <>
      Escape calls <code>onDismiss</code> with the reason <code>keyboard</code>. A menu, popover or dropdown open inside
      the modal takes Escape first.
    </>,
    <>
      The close button is named by <code>closeAriaLabel</code>, &ldquo;Close&rdquo; by default.
    </>,
    'The page behind the modal does not scroll while it is open.',
    'Under reduced motion the modal appears and leaves without fading.',
  ],
  related: ['dialog', 'popover', 'alert', 'button'],
};

export default doc;
