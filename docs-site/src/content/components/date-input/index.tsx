// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'DateInput',
  folder: 'date-input',
  group: 'dates-and-files',
  summary: 'Lets the user type a date, or a year and month, with the separators filled in as they type.',
  description: (
    <>
      <p>
        A date input is a text field on an ink baseline with the date lettered in mono, so the figures keep their
        place as the user types. It shows the date as <code>YYYY/MM/DD</code> and stores it as{' '}
        <code>YYYY-MM-DD</code>. The slashes appear on their own, a digit that cannot start a month or day is padded (4
        becomes 04), and impossible values such as a 13th month or 31 February are refused as they are typed.
      </p>
      <p>
        The input is controlled, and its value can be partial while the user types, such as <code>2026-03</code>.
        Check that it is complete before you use it.
      </p>
    </>
  ),
  examples: [
    {
      id: 'basic',
      title: 'In a form field',
      description: (
        <p>
          Put the format in the <code>placeholder</code> and in the field’s <code>constraintText</code>, since the
          placeholder disappears once the user starts typing.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Checking a complete date',
      description: (
        <p>
          Check the value on blur, not on every keystroke, so the user is not told a date is wrong while they are still
          typing it.
        </p>
      ),
    },
    {
      id: 'month',
      title: 'Year and month',
      description: (
        <p>
          With <code>granularity="month"</code> the input takes <code>YYYY/MM</code> and the value is{' '}
          <code>YYYY-MM</code>, for things like card expiry dates and billing periods.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Read-only and disabled',
      description: (
        <p>
          A read-only input keeps its value focusable and selectable, so it can be copied. A disabled input is left out
          of the tab order.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a date the user already knows and can type faster than they can find it, such as a date of birth or a contract start date.',
      'Inside your own date controls, where a calendar would get in the way.',
    ],
    avoid: [
      <>
        When the user needs to see the days around the date. Use a <a href="#/components/date-picker">DatePicker</a>.
      </>,
      <>
        For a start and an end. Use a <a href="#/components/date-range-picker">DateRangePicker</a>.
      </>,
    ],
    writing: [
      'Show the format as YYYY/MM/DD in the placeholder and in the constraint text.',
      'Write error messages that say what to do: "Enter a date in 2026 or later", not "Invalid date".',
    ],
  },
  accessibility: [
    <>
      The input has <code>inputmode="numeric"</code>, so touch devices show a number pad, and browser autocomplete
      and spell checking are off.
    </>,
    'Inside a FormField the label, description, constraint and error are tied to the input. Without one, give it an ariaLabel.',
    'Typed and pasted text both go through the mask, and autofilled values are brought back into it.',
    <>
      The format is not announced on its own: say it in the field’s <code>constraintText</code> as well as the
      placeholder.
    </>,
  ],
  related: ['date-picker', 'time-input', 'calendar', 'input', 'form-field'],
};

export default doc;
