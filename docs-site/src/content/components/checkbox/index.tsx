// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Checkbox',
  folder: 'checkbox',
  group: 'forms',
  summary: 'Turns one option on or off, on its own or as one of several that can all be chosen.',
  description: (
    <p>
      A checkbox is an ink key square: filled with ink and a paper tick when checked, half filled from the start edge
      when partly checked, and open when clear. A disabled checkbox is hatched with its edge kept, and a read-only one
      takes the raised read-only fill. Clicking the label toggles it, as with a native checkbox.
    </p>
  ),
  marks: ['M6', 'M10', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'Checkbox with a description',
      description: (
        <p>
          The checkbox is controlled: pass <code>checked</code> and update it in <code>onChange</code>. A{' '}
          <code>description</code> under the label says what the option does.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'group',
      title: 'Several options',
      description: (
        <p>
          A list of checkboxes under one question, for choices that can all be on at once. A form field that holds
          several checkboxes labels them as a group, and each checkbox keeps its own label.
        </p>
      ),
    },
    {
      id: 'indeterminate',
      title: 'Partly checked',
      description: (
        <p>
          <code>indeterminate</code> draws the half-filled square for a parent whose children are only partly checked.
          Clicking it reports <code>checked: true</code>, so the parent checks every child.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Read-only and disabled',
      description: (
        <p>
          <code>readOnly</code> keeps the checkbox focusable so its state can be read; use it for a setting that is
          fixed by policy. <code>disabled</code> takes it out of the tab order. Say why in the description.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For an option that is on or off and takes effect when the form is submitted.',
      'For a list of options where any number can be chosen, including none.',
      'With indeterminate for a parent that checks or clears a group of children.',
    ],
    avoid: [
      <>
        For a setting that takes effect as soon as it changes. Use a <a href="#/components/toggle">Toggle</a>.
      </>,
      <>
        For a choice of exactly one from a list. Use a <a href="#/components/radio-group">RadioGroup</a>.
      </>,
      <>
        For a long list of options. Use a <a href="#/components/multiselect">Multiselect</a>.
      </>,
      'A label that is a negative ("Do not send alerts"). Word the option so that checking it turns something on.',
    ],
    writing: [
      'Write the label as what turns on when it is checked: "Enable request logs".',
      'Use sentence case and no closing punctuation in the label.',
      'Keep the description to one sentence about the effect.',
    ],
  },
  accessibility: [
    <>
      The control is a native <code>&lt;input type="checkbox"&gt;</code> under the drawn square, so it is reached with
      Tab and toggled with Space. Clicking the label toggles it too.
    </>,
    <>
      The label names the checkbox and the description describes it. With one checkbox in a form field, the field's
      label is read first and then the checkbox's label. A form field with several checkboxes labels them as a group,
      with <code>role=&quot;group&quot;</code>. Without visible text, set <code>ariaLabel</code>.
    </>,
    <>
      <code>indeterminate</code> sets the native property, so screen readers announce "mixed" or "partly checked".
    </>,
    <>
      A read-only checkbox stays focusable and is marked <code>aria-readonly</code>. A disabled one is skipped by Tab.
    </>,
    <>
      When the checkbox shows or hides other content, point <code>ariaControls</code> at that content's ID.
    </>,
  ],
  related: ['toggle', 'radio-group', 'multiselect', 'form-field', 'tiles'],
};

export default doc;
