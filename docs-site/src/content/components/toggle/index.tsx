// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Toggle',
  folder: 'toggle',
  group: 'forms',
  summary: 'Turns a setting on or off, taking effect as soon as the user switches it.',
  description: (
    <>
      <p>
        A toggle keeps its familiar track and knob. Off is a hairline track with a graphite knob. On fills the track
        with ink and turns the knob to paper, because ink fill means &quot;on&quot; throughout Ordinate. Disabled is
        hatched, and read-only turns the ink to graphite.
      </p>
      <p>
        The toggle is controlled: set <code>checked</code> and update it in <code>onChange</code>, which hands you the
        new state.
      </p>
    </>
  ),
  marks: ['M10', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'Switch a setting',
      description: (
        <p>
          The label names the setting and the description says what &quot;on&quot; does. Apply the change straight away,
          and say so when the effect is not visible.
        </p>
      ),
    },
    {
      id: 'settings',
      title: 'A list of settings',
      description: (
        <p>
          In a FormField, the label sits in the margin and the toggle&apos;s own label says what is switched. When a
          toggle shows or hides other fields, point <code>ariaControls</code> at them.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Disabled and read-only',
      description: (
        <p>
          A disabled toggle is hatched and skipped by Tab; say why next to it. A read-only toggle stays focusable, so
          the setting can still be read.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a setting that takes effect at once, such as turning on alerts or auto-scaling.',
      'For a list of independent settings, each on or off.',
    ],
    avoid: [
      <>
        For a choice that only applies when a form is submitted, or for agreeing to terms. Use a{' '}
        <a href="#/components/checkbox">Checkbox</a>.
      </>,
      <>
        For choosing between two named options. Use a <a href="#/components/radio-group">RadioGroup</a> or a{' '}
        <a href="#/components/segmented-control">SegmentedControl</a>.
      </>,
      <>
        For a button that stays pressed in a toolbar. Use a <a href="#/components/toggle-button">ToggleButton</a>.
      </>,
    ],
    writing: [
      'Name the setting, not the action: "Auto-scaling", not "Turn on auto-scaling".',
      'Do not put "on" or "off" in the label; the toggle shows the state.',
      'Say in the description what happens when the setting is on.',
    ],
  },
  accessibility: [
    <>
      The toggle is a native checkbox input with <code>role=&quot;switch&quot;</code>, so screen readers announce it as
      a switch that is on or off. Space switches it.
    </>,
    'Clicking the label switches the toggle. The description is tied to it with aria-describedby.',
    <>
      Inside a FormField the toggle is named by the field&apos;s label followed by its own label. For a toggle without a
      visible label, set <code>ariaLabel</code>.
    </>,
    <>
      Read-only sets <code>aria-readonly</code> and keeps the toggle focusable. Disabled removes it from the tab order.
    </>,
    'The knob slides only when motion is allowed; with reduced motion it moves at once.',
  ],
  related: ['checkbox', 'toggle-button', 'radio-group', 'form-field'],
};

export default doc;
