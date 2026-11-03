// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Tooltip',
  folder: 'tooltip',
  group: 'overlays',
  summary: 'Shows a few words about a control when the pointer rests on it or it receives focus.',
  description: (
    <>
      <p>
        A tooltip is an ink chip on a short stem that points at its trigger. It shows a moment after the pointer rests
        on the trigger, at once when the trigger receives keyboard focus, and hides when the pointer or focus leaves or
        on Escape.
      </p>
      <p>
        The tooltip becomes the trigger&apos;s accessible description. It cannot be reached with the keyboard, so it
        holds text only: put links and buttons in a <a href="#/components/popover">Popover</a>.
      </p>
    </>
  ),
  marks: ['M7'],
  examples: [
    {
      id: 'icon-buttons',
      title: 'Icon buttons',
      description: (
        <p>
          The usual use: an icon button keeps its short <code>ariaLabel</code>, and the tooltip says a little more.
          Hover over a button or Tab to it.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'positions',
      title: 'Positions',
      description: (
        <p>
          The tooltip shows above its trigger by default. <code>right</code> and <code>left</code> follow the reading
          direction, and the tooltip moves to the opposite side when there is no room.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'text-trigger',
      title: 'On text',
      description: (
        <p>
          When the trigger contains nothing focusable, the tooltip makes it focusable, so keyboard users can reach the
          explanation too.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'To name or briefly explain an icon button.',
      'To expand a short value or abbreviation, such as a percentage or a code.',
    ],
    avoid: [
      <>
        For anything with a link or a button, or more than a sentence. Use a <a href="#/components/popover">Popover</a>.
      </>,
      'For information needed to complete a task. Put it on the page, because touch screens never show tooltips on hover.',
      <>
        On a disabled button to say why. Use the <code>disabledReason</code> of components that have one, such as{' '}
        <a href="#/components/copy-to-clipboard">CopyToClipboard</a> and{' '}
        <a href="#/components/button-dropdown">ButtonDropdown</a> items.
      </>,
    ],
    writing: [
      'Keep it to a few words, in sentence case, without a closing period for a fragment.',
      'Do not repeat the visible label; add what the label leaves out.',
    ],
  },
  accessibility: [
    <>
      The tooltip has <code>role="tooltip"</code> and is linked to the first focusable element in the trigger with{' '}
      <code>aria-describedby</code>. It is a description, not a name: an icon button still needs its own{' '}
      <code>ariaLabel</code>.
    </>,
    'It shows at once on keyboard focus and after a short delay on hover, and stays while the pointer crosses onto it.',
    'Escape hides it, even when it was shown by hover and focus is elsewhere. With focus on the trigger, Escape closes only the tooltip, not a modal around it.',
    'When the trigger has nothing focusable, the tooltip gives it a tab stop.',
  ],
  related: ['popover', 'button', 'button-group'],
};

export default doc;
