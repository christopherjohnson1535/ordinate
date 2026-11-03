// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'DatePicker',
  folder: 'date-picker',
  group: 'dates-and-files',
  summary: 'Lets the user type a date or pick it from a calendar that opens under the field.',
  description: (
    <>
      <p>
        A date picker is a <a href="#/components/date-input">DateInput</a> with a calendar button beside it. The button
        opens a <a href="#/components/calendar">Calendar</a> on a plate, lifted off the sheet onto its hard offset, and
        picking a day closes it and returns focus to the button. The user can also type the date and never open the
        calendar.
      </p>
      <p>
        The value is <code>YYYY-MM-DD</code>, or <code>YYYY-MM</code> with month granularity, and it can be partial
        while the user types. <code>isDateEnabled</code> only governs the calendar: typed dates are not checked, so
        validate them too.
      </p>
    </>
  ),
  marks: ['M9', 'M5', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'In a form field',
      description: (
        <p>
          The most common use. The calendar opens with focus on the chosen day, or on today when there is none.
        </p>
      ),
    },
    {
      id: 'disabled-dates',
      title: 'Limiting the dates',
      description: (
        <p>
          Disable the days that cannot be chosen and say why. Check a typed date against the same rule and show an
          error in the form field.
        </p>
      ),
    },
    {
      id: 'month',
      title: 'Month picker',
      description: (
        <p>
          With <code>granularity="month"</code> the calendar shows the months of a year and the value is{' '}
          <code>YYYY-MM</code>.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Read-only and disabled',
      description: (
        <p>
          Both keep the calendar closed. A read-only picker still lets the user focus and copy the date.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a single date in a form, where the user may want to see the days around it.',
      'When some dates cannot be chosen and the calendar can show which ones.',
    ],
    avoid: [
      <>
        For a start and an end date. Use a <a href="#/components/date-range-picker">DateRangePicker</a>.
      </>,
      <>
        For a date far in the past, such as a date of birth, where paging month by month is slow. Use a{' '}
        <a href="#/components/date-input">DateInput</a>.
      </>,
      <>
        When the date is the main thing on the page. Show a <a href="#/components/calendar">Calendar</a> directly.
      </>,
    ],
    writing: [
      'Put the format, YYYY/MM/DD, in the placeholder and in the field’s constraint text.',
      'Leave openCalendarAriaLabel unset unless you translate it: by default it names the selected date too.',
    ],
  },
  accessibility: [
    <>
      The calendar button is named “Choose date”, or “Choose date, selected date is …” once there is a value, and has{' '}
      <code>aria-haspopup="dialog"</code> and <code>aria-expanded</code>.
    </>,
    'Opening the calendar moves focus into its grid. Tab stays inside the popup, and Escape or picking a day closes it and returns focus to the button.',
    'The calendar grid has the same keys as Calendar: arrows, Home and End, and Page Up and Page Down.',
    'The input works without the calendar, so a user who prefers typing never has to open it.',
    'Inside a FormField the label, description and error are tied to the input.',
  ],
  related: ['date-input', 'calendar', 'date-range-picker', 'time-input', 'form-field'],
};

export default doc;
