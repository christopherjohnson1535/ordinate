// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ToggleButton',
  folder: 'toggle-button',
  group: 'actions',
  summary: 'A button that stays pressed, to turn a setting or a mode on and off.',
  description: (
    <>
      <p>
        A toggle button looks like a <a href="#/components/button">Button</a> until it is pressed. Pressed, it is filled
        with ink, the mark for &ldquo;on&rdquo;, and keeps its 2 px offset drawn apart from the ink. The icon variant
        lies on the sheet with no offset and fills with ink when pressed.
      </p>
      <p>
        The button is controlled: keep <code>pressed</code> in state and set it from <code>event.detail.pressed</code>{' '}
        in <code>onChange</code>.
      </p>
    </>
  ),
  marks: ['M10', 'M13'],
  examples: [
    {
      id: 'basic',
      title: 'On and off',
      description: (
        <p>
          The label stays the same in both states. The ink fill shows the state, and screen readers announce it as
          pressed or not pressed.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'icons',
      title: 'Icon toggles',
      description: (
        <p>
          The <code>icon</code> variant needs an <code>iconName</code> and an <code>ariaLabel</code>. A{' '}
          <code>pressedIconName</code>, such as a solid star, shows while it is pressed.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'loading',
      title: 'Saving and disabled',
      description: (
        <p>
          While the new state is saved, <code>loading</code> keeps the button focusable but stops clicks. A disabled
          button keeps its state but cannot be changed or focused.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'For a setting that takes effect at once, such as following a project or pinning an item.',
      'For a mode of a tool, such as showing a grid or wrapping lines, often in a toolbar.',
    ],
    avoid: [
      <>
        For a setting in a form that is saved with a submit button. Use a <a href="#/components/toggle">Toggle</a> or a{' '}
        <a href="#/components/checkbox">Checkbox</a>.
      </>,
      <>
        For choosing one of several options. Use a <a href="#/components/segmented-control">SegmentedControl</a>.
      </>,
      'Changing the label with the state, such as "Follow" and "Unfollow". The pressed state already says it.',
    ],
    writing: [
      'Name the setting or the mode, starting with a verb: "Follow north-annex", "Pin to the dashboard".',
      'Use the same label in both states.',
    ],
  },
  accessibility: [
    <>
      The button is a native <code>&lt;button&gt;</code> with <code>aria-pressed</code>, so screen readers announce it
      as a toggle and say whether it is pressed. Enter and Space change it.
    </>,
    <>
      Icon toggles have no visible text: give each an <code>ariaLabel</code> that names the setting, and keep it the
      same in both states.
    </>,
    <>
      A loading button stays focusable and is marked <code>aria-disabled</code>; <code>loadingText</code> is announced
      when loading starts.
    </>,
    'A disabled button cannot be focused.',
  ],
  related: ['button', 'toggle', 'segmented-control', 'button-group'],
};

export default doc;
