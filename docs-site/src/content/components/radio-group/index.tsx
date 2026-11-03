// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'RadioGroup',
  folder: 'radio-group',
  group: 'forms',
  summary: 'Lets the user choose exactly one option from a short list that stays in view.',
  description: (
    <>
      <p>
        A radio group lays out a set of radio buttons in a column or a row and reports the chosen value. Each button
        keeps its familiar circle; the chosen one takes a heavier ink ring and an ink dot. An option that cannot be
        chosen is hatched.
      </p>
      <p>
        Put the group in a FormField, which names it with the field&apos;s label and shows the label in the margin. The
        group is controlled: set <code>value</code> and update it in <code>onChange</code>. A <code>null</code> value
        shows no option chosen.
      </p>
    </>
  ),
  marks: ['M4', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'In a form field',
      description: (
        <p>
          The most common use: a labelled choice in a form, with a description under each option that says what it
          means.
        </p>
      ),
    },
    {
      id: 'horizontal',
      title: 'In a row',
      description: (
        <p>
          <code>direction=&quot;horizontal&quot;</code> sets short options side by side. They wrap onto more lines when
          the row runs out of room.
        </p>
      ),
    },
    {
      id: 'no-selection',
      title: 'No default and validation',
      description: (
        <p>
          Start with <code>null</code> when there is no safe default, so the user makes the choice. Show an{' '}
          <code>errorText</code> on the field if they try to go on without one.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Disabled options and read-only',
      description: (
        <p>
          Disable an option that does not apply and say why in its description. <code>readOnly</code> shows a choice
          that someone else set, and keeps it focusable and submitted with the form.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For one choice from two to about seven options that the user should compare before choosing.',
      'When the options need a word of explanation each.',
    ],
    avoid: [
      <>
        For a long list or one that changes. Use a <a href="#/components/select">Select</a>.
      </>,
      <>
        For options that need an image or more room to explain. Use <a href="#/components/tiles">Tiles</a>.
      </>,
      <>
        For switching a view rather than setting a value. Use a{' '}
        <a href="#/components/segmented-control">SegmentedControl</a>.
      </>,
      <>
        For a setting that is simply on or off. Use a <a href="#/components/toggle">Toggle</a>.
      </>,
    ],
    writing: [
      'Label the field with the question the options answer, such as "Instance size", not "Choose one".',
      'Keep option labels short and parallel. Put consequences such as price or downtime in the description.',
      'Order options in a way the reader expects: smallest to largest, or most common first.',
    ],
  },
  accessibility: [
    <>
      The group has <code>role=&quot;radiogroup&quot;</code>. Inside a FormField it is named by the field&apos;s label
      and described by its description and messages. Outside one, give it an <code>ariaLabel</code>.
    </>,
    'Each option is a native radio input sharing one name, so Tab moves into the group and the arrow keys move between options and select them.',
    <>
      <code>readOnly</code> sets <code>aria-readonly</code> on the group and keeps every option focusable. Disabled
      options are skipped.
    </>,
    <>
      When the choice shows or hides other fields, point <code>ariaControls</code> at them.
    </>,
    <>
      <code>ariaRequired</code> tells assistive technology that a choice is needed; it does not check anything itself.
    </>,
  ],
  related: ['radio-button', 'tiles', 'select', 'segmented-control', 'form-field'],
};

export default doc;
