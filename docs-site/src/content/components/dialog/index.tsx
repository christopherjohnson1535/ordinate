// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Dialog',
  folder: 'dialog',
  group: 'overlays',
  summary: 'Asks a short question or shows a notice in place, next to the content it belongs to.',
  description: (
    <>
      <p>
        A dialog is the modal&apos;s plate placed in the page flow instead of over it: a white sheet with a hairline ink
        edge on a 4 px offset, which fades in and rises onto its offset as it appears. Its actions stand on a rule
        closed by hash marks. The page around it stays usable.
      </p>
      <p>
        There is no <code>visible</code> prop. Render the dialog when it should show and remove it in{' '}
        <code>onDismiss</code>. It moves focus to itself when it mounts, and gives focus back when it unmounts.
      </p>
    </>
  ),
  marks: ['M9', 'M13', 'M2'],
  examples: [
    {
      id: 'inline',
      title: 'A question in place',
      description: (
        <p>
          The button adds the dialog under it. The close button and Escape call <code>onDismiss</code>; the
          footer&apos;s buttons remove it themselves.
        </p>
      ),
    },
    {
      id: 'without-header',
      title: 'Without a header',
      description: (
        <p>
          Without a <code>header</code>, the close button sits beside the content. Give the dialog an{' '}
          <code>ariaLabel</code> so it still has a name. <code>event.detail.reason</code> says how it was closed.
        </p>
      ),
    },
    {
      id: 'notice',
      title: 'A notice with one action',
      description: (
        <p>
          A footer with a single action, for a notice the user should see before moving on, such as the result of a
          restart.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a short question or form that belongs to one place on the page, such as renaming the item next to it.',
      'For a notice in a side panel or beside a chart, where the rest of the page should stay usable.',
    ],
    avoid: [
      <>
        When the user must answer before doing anything else. Use a <a href="#/components/modal">Modal</a>.
      </>,
      <>
        For a status message about the page. Use an <a href="#/components/alert">Alert</a>.
      </>,
      <>
        For extra detail about a word or a value. Use a <a href="#/components/popover">Popover</a>.
      </>,
    ],
    writing: [
      'Make the header say what the dialog is for: "Rename project".',
      'Keep the content to a sentence or two, or a single field.',
      'Name actions after what they do: "Save", "View log".',
    ],
  },
  accessibility: [
    <>
      The dialog has <code>role="dialog"</code> and is named by its <code>header</code>, or by <code>ariaLabel</code>{' '}
      when it has none.
    </>,
    'It moves focus to itself when it mounts. When it unmounts with focus inside it, focus goes back to the element that had focus before, if that element is still in the page.',
    'Escape calls onDismiss with the reason keyboard and closes only this dialog, not a modal or panel around it.',
    <>
      The dialog does not trap focus or make the page inert. Tab leaves it like any other part of the page. Use a{' '}
      <a href="#/components/modal">Modal</a> when the user must not.
    </>,
    <>
      The close button is named by <code>dismissAriaLabel</code>, &ldquo;Close dialog&rdquo; by default.
    </>,
  ],
  related: ['modal', 'popover', 'alert'],
};

export default doc;
