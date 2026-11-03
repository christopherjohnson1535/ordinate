// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Slider',
  folder: 'slider',
  group: 'forms',
  summary: 'Sets a number within a range by dragging an index along a scale.',
  description: (
    <>
      <p>
        A slider is drawn as a scale: a hairline base with a graduation at each step, mono labels on the major ticks at
        the ends and at any reference values, an ink fill from the minimum to the value, and an ink index line with the
        value lettered above it. The fill is a dimension line, the measure of how much is set. A native range input lies
        over the drawing, invisible, and takes the pointer and the keyboard.
      </p>
      <p>
        The slider is controlled: set <code>value</code> and update it in <code>onChange</code>, which fires while the
        index moves. Use <code>valueFormatter</code> to add units; it formats the labels, the lettered value and what
        screen readers hear.
      </p>
    </>
  ),
  marks: ['M3', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'Set a value',
      description: (
        <p>
          A slider in a FormField, with a formatter for the unit. With 40 steps or fewer, every step gets a tick.
        </p>
      ),
    },
    {
      id: 'reference-values',
      title: 'Steps and reference values',
      description: (
        <p>
          <code>step</code> sets how far each move goes. <code>referenceValues</code> label points on the scale that
          mean something, such as a default or a limit, with a major tick.
        </p>
      ),
    },
    {
      id: 'with-input',
      title: 'With a number field',
      description: (
        <p>
          When people know the exact number they want, pair the slider with an Input in the field&apos;s{' '}
          <code>secondaryControl</code> and keep both on the same state.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Validation and unavailable states',
      description: (
        <p>
          A FormField&apos;s <code>errorText</code> or <code>warningText</code> colors the scale. Read-only keeps the
          slider focusable; disabled hatches the scale below its base.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a value where the position in the range matters more than the exact number, such as a threshold or a share.',
      'For ranges small enough that every value can be reached with the arrow keys in a few presses.',
    ],
    avoid: [
      <>
        For an exact number from a large range, such as a port. Use an <a href="#/components/input">Input</a> with{' '}
        <code>type=&quot;number&quot;</code>.
      </>,
      <>
        For a handful of named levels. Use a <a href="#/components/radio-group">RadioGroup</a> or a{' '}
        <a href="#/components/segmented-control">SegmentedControl</a>.
      </>,
      <>
        For showing progress the user cannot change. Use a <a href="#/components/progress-bar">ProgressBar</a>.
      </>,
    ],
    writing: [
      'Label the field with what the number is, and put the unit in the valueFormatter, not in the label.',
      'Use the description to say what a higher value does: "More nodes handle more traffic and cost more."',
      'Keep formatted values short, such as "64 GiB" or "40%", so they fit under the ticks.',
    ],
  },
  accessibility: [
    'The control is a native <input type="range">: the arrow keys move one step, Page Up and Page Down move further, and Home and End go to the ends.',
    <>
      Inside a FormField it is named by the field&apos;s label. Outside one, give it an <code>ariaLabel</code>.
    </>,
    <>
      With a <code>valueFormatter</code>, screen readers hear the formatted value through <code>aria-valuetext</code>.
      The labels drawn under the scale are hidden from them.
    </>,
    <>
      <code>ariaDescription</code> adds a description for screen readers only, such as what the values mean.
    </>,
    <>
      Read-only sets <code>aria-readonly</code> and ignores changes but keeps the slider focusable. Disabled removes it
      from the tab order.
    </>,
  ],
  related: ['input', 'progress-bar', 'form-field', 'segmented-control'],
};

export default doc;
