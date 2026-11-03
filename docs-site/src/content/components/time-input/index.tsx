// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TimeInput',
  folder: 'time-input',
  group: 'dates-and-files',
  summary: 'Lets the user type a time of day, with the colons filled in as they type.',
  description: (
    <>
      <p>
        A time input is a text field on an ink baseline with the time lettered in mono. It takes hours, minutes and
        seconds by default, or fewer parts with <code>format</code>. The colons appear as each part is complete, a digit
        that cannot start an hour or minute is padded, and impossible values such as 25 hours or 61 minutes are refused
        as they are typed.
      </p>
      <p>
        The input is controlled, and its value can be partial while the user types, such as <code>14:3</code>. Check
        that it is complete before you use it. With <code>use24Hour={'{false}'}</code> the hours run from 01 to 12 and
        the value has no AM or PM part, so pair the input with a control for that.
      </p>
    </>
  ),
  examples: [
    {
      id: 'basic',
      title: 'Hours and minutes',
      description: (
        <p>
          The most common form. Put the format in the <code>placeholder</code> and the field’s{' '}
          <code>constraintText</code>.
        </p>
      ),
    },
    {
      id: 'with-date',
      title: 'With a date',
      description: (
        <p>
          A date and a time side by side, read together as one moment. A <code>ColumnLayout</code> keeps the two fields
          the same width.
        </p>
      ),
    },
    {
      id: 'twelve-hour',
      title: '12-hour clock',
      description: (
        <p>
          With <code>use24Hour={'{false}'}</code> the value has no AM or PM, so a segmented control beside it says which
          half of the day.
        </p>
      ),
    },
    {
      id: 'formats',
      title: 'Formats',
      description: (
        <p>
          <code>format</code> sets which parts the user enters: <code>hh</code>, <code>hh:mm</code> or{' '}
          <code>hh:mm:ss</code>, the default.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a time of day: a delivery slot, the start of a maintenance window, when a job should run.',
      'Next to a DatePicker or DateInput when the user picks a date and a time.',
    ],
    avoid: [
      <>
        For a duration, such as “90 minutes”. Use a number <a href="#/components/input">Input</a> with the unit in the
        label.
      </>,
      <>
        For a start and an end time. Use a <a href="#/components/date-range-picker">DateRangePicker</a>, which checks
        that the end comes after the start.
      </>,
      'A 12-hour clock without a way to choose AM or PM.',
    ],
    writing: [
      'Show the format in lowercase, such as hh:mm, and say which clock you use: "24-hour clock".',
      'Say which time zone the time is in when it is not plain from the page.',
    ],
  },
  accessibility: [
    <>
      The input has <code>inputmode="numeric"</code>, so touch devices show a number pad, and browser autocomplete and
      spell checking are off.
    </>,
    'Inside a FormField the label, description, constraint and error are tied to the input. Without one, give it an ariaLabel.',
    'The format is not announced on its own: say it in the constraint text as well as the placeholder.',
  ],
  related: ['date-input', 'date-picker', 'date-range-picker', 'input'],
};

export default doc;
