// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Button',
  folder: 'button',
  group: 'actions',
  summary: 'Runs an action, or goes somewhere, when the user clicks it.',
  description: (
    <p>
      A button is an offset block: an outlined block standing on a hard 2 px ink offset, which it presses flat onto when
      clicked. The primary button is the same block filled with ink. Link and icon buttons have no offset, and a button
      that goes to a URL ends in a leader arrow.
    </p>
  ),
  marks: ['M13', 'M7'],
  examples: [
    {
      id: 'variants',
      title: 'Variants',
      description: (
        <p>
          Use <code>primary</code> for the one main action of a page or form, <code>normal</code> for the rest and{' '}
          <code>link</code> for quiet actions in running text and footers. <code>destructive</code> is for an action
          that deletes or cannot be undone.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'icons',
      title: 'Icons',
      description: (
        <p>
          An icon sits before the text, or after it with <code>iconAlign="right"</code>. An <code>icon</code> button has
          no text, so it needs an <code>ariaLabel</code>.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'loading',
      title: 'Loading and disabled',
      description: (
        <p>
          While an action runs, <code>loading</code> keeps the button in place and focusable but stops repeated clicks.
          Disable a button only when the reason is plain from the page around it.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'links',
      title: 'Buttons that go somewhere',
      description: (
        <p>
          With an <code>href</code> the button renders a link and ends in a leader. <code>external</code> adds the
          outside-arrow and opens a new tab.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'form-actions',
      title: 'Actions of a form',
      description: (
        <p>
          The primary action comes last, at the end of the line. Cancel is a <code>link</code> button so the eye lands
          on the main action.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For an action on the page: saving, starting, deleting, opening a modal.',
      'For the single main action of a page or form, with the primary variant.',
      'With an href when the action is "go there", such as Edit settings, so it reads as a button but opens like a link.',
    ],
    avoid: [
      <>
        For navigation inside running text. Use a <a href="#/components/link">Link</a>.
      </>,
      <>
        For a choice between options. Use a <a href="#/components/segmented-control">SegmentedControl</a> or{' '}
        <a href="#/components/toggle-button">ToggleButton</a>.
      </>,
      'More than one primary button in the same view.',
      <>
        A row of more than three buttons. Put the rest in a <a href="#/components/button-dropdown">ButtonDropdown</a>.
      </>,
    ],
    writing: [
      'Start with a verb and say what happens: "Save changes", "Delete instance", not "OK" or "Submit".',
      'Use sentence case and no closing punctuation.',
      'Keep the label the same while loading; say what is happening in loadingText instead.',
    ],
  },
  accessibility: [
    'The button is a native <button>, or an <a> with an href, so it is reachable with Tab and activates with Enter and Space.',
    <>
      Icon buttons have no visible text: give each one an <code>ariaLabel</code> that names the action.
    </>,
    <>
      A loading button stays focusable and is marked <code>aria-disabled</code>; <code>loadingText</code> is announced
      when loading starts.
    </>,
    'A disabled button cannot be focused, so a screen reader user may not find it. Prefer leaving it enabled and explaining what is missing when it is clicked.',
    'The press animation is turned off under reduced motion.',
  ],
  related: ['button-dropdown', 'button-group', 'toggle-button', 'link', 'copy-to-clipboard'],
};

export default doc;
