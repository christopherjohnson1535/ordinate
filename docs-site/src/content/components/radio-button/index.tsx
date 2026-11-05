// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'RadioButton',
  folder: 'radio-button',
  group: 'forms',
  summary: 'One option of a set, for building a radio group whose items need a layout of their own.',
  description: (
    <>
      <p>
        A radio button keeps its familiar circle. Once selected, its ring turns ink and a little heavier, with an ink
        dot inside. A disabled radio button is hatched.
      </p>
      <p>
        Most forms want a <a href="#/components/radio-group">RadioGroup</a>, which lays out the buttons, shares their
        name and takes its label from a FormField. Reach for RadioButton when each option needs something of its own
        next to it, such as a field that applies only to that option. You then give the buttons the same{' '}
        <code>name</code> and put them in a FormField, which labels them as a group.
      </p>
    </>
  ),
  marks: ['M12'],
  examples: [
    {
      id: 'standalone',
      title: 'A set of radio buttons',
      description: (
        <p>
          Give every button the same <code>name</code>, set <code>checked</code> from your state and update it in{' '}
          <code>onSelect</code>. The form field labels the buttons as a group, and each keeps its own label.
        </p>
      ),
    },
    {
      id: 'with-fields',
      title: 'Options with their own fields',
      description: (
        <p>
          The reason to build a group by hand: an option that needs a field of its own. Show the field only while its
          option is selected.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Disabled and read-only',
      description: (
        <p>
          A disabled radio button is hatched and skipped by Tab. Read-only keeps the set focusable so the choice can
          still be read; set it on every button of a group or on none.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a group of options whose layout RadioGroup cannot give, such as an option followed by its own field.',
      'With two to about seven options that are all worth seeing at once.',
    ],
    avoid: [
      <>
        For a plain list of options. Use a <a href="#/components/radio-group">RadioGroup</a>, which wires up the name,
        the group role and the label for you.
      </>,
      <>
        For options that need a picture or a longer description. Use <a href="#/components/tiles">Tiles</a>.
      </>,
      <>
        For a single setting that is on or off. Use a <a href="#/components/toggle">Toggle</a> or a{' '}
        <a href="#/components/checkbox">Checkbox</a>.
      </>,
    ],
    writing: [
      'Keep labels short and parallel, so the options read as answers to the same question.',
      'Put what an option costs or changes in its description, not in the label.',
    ],
  },
  accessibility: [
    'Each radio button is a native <input type="radio">, so the arrow keys move between the buttons that share a name and Space selects.',
    <>
      The buttons do not form a group on their own. Put them in a FormField: a field with several radio buttons gives
      them <code>role=&quot;group&quot;</code>, named by its label and described by its description.
    </>,
    'Clicking the label selects the radio button. The description is tied to it with aria-describedby.',
    <>
      A read-only radio button stays focusable and is marked <code>aria-disabled</code>. A disabled one is removed from
      the tab order.
    </>,
    <>
      For a radio button without a visible label, set <code>ariaLabel</code>.
    </>,
    <>
      Each radio button in a FormField keeps an ID of its own. Set <code>controlId</code> on a button to choose it.
    </>,
  ],
  related: ['radio-group', 'tiles', 'checkbox', 'toggle'],
};

export default doc;
