// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Calendar',
  folder: 'calendar',
  group: 'dates-and-files',
  summary: 'Lets the user pick a day, or a month, from a grid that is always on the page.',
  description: (
    <>
      <p>
        A calendar is drawn like a schedule on a sheet: the month lettered in mono capitals over a grid of figures of
        equal width. Today is circled, the chosen day carries ink crop marks as one of a set, and days that cannot be
        chosen are hatched. With <code>granularity="month"</code> the grid shows the twelve months of a year instead.
      </p>
      <p>
        The value is an ISO string, <code>YYYY-MM-DD</code> or <code>YYYY-MM</code>, and the calendar is controlled: set{' '}
        <code>value</code> again in <code>onChange</code>. Most forms want a{' '}
        <a href="#/components/date-picker">DatePicker</a>, which opens this calendar from a date input.
      </p>
    </>
  ),
  marks: ['M5', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'Pick a day',
      description: (
        <p>
          Give the calendar a name with <code>ariaLabel</code> or <code>ariaLabelledby</code>, since it has no label of
          its own. The month of the value is shown first.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'disabled-dates',
      title: 'Days that cannot be chosen',
      description: (
        <p>
          <code>isDateEnabled</code> hatches the days it returns <code>false</code> for, and{' '}
          <code>dateDisabledReason</code> says why under the grid while the day is focused or under the pointer.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'month',
      title: 'Pick a month',
      description: (
        <p>
          With <code>granularity="month"</code> the value is <code>YYYY-MM</code> and the buttons page by year. Use it
          for billing periods, budgets and reports that run by the month.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'locale',
      title: 'Locale and first day of the week',
      description: (
        <p>
          Month and weekday names follow <code>locale</code>, which defaults to the page’s <code>lang</code>. The week
          starts on the locale’s usual first day unless you set <code>startOfWeek</code>.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'When the date is the main thing on the page or panel, such as booking a site visit or choosing a delivery day.',
      'When seeing the days around the value helps the choice, for example to avoid weekends.',
    ],
    avoid: [
      <>
        In a form with other fields. Use a <a href="#/components/date-picker">DatePicker</a>, which takes the space of
        an input until it is opened.
      </>,
      <>
        For a date the user knows by heart, such as a date of birth. Use a{' '}
        <a href="#/components/date-input">DateInput</a>.
      </>,
      <>
        For a span of days. Use a <a href="#/components/date-range-picker">DateRangePicker</a>, which draws the range
        and its length.
      </>,
    ],
    writing: [
      'Write the disabled reason as a plain statement of the rule: "The workshop is closed on Mondays."',
      'Name the calendar for what the date is for, such as "Site visit", not "Calendar".',
    ],
  },
  accessibility: [
    'The days are a WAI-ARIA grid with a single tab stop. Arrow keys move by day and by week, Home and End go to the ends of the week, and Page Up and Page Down move by month, or by year with Shift. Enter or Space picks the focused day.',
    'With month granularity the arrow keys move by month and by row, and Page Up and Page Down move by year, or by ten years with Shift.',
    'Left and right arrows follow the reading direction, so they are mirrored in right-to-left pages.',
    'The month title is a polite live region, so paging to another month is announced.',
    <>
      Today is marked <code>aria-current="date"</code> and its name starts with “Today”. Weekday headings carry the full
      weekday name for screen readers.
    </>,
    <>
      Disabled days stay focusable and are marked <code>aria-disabled</code>, with the disabled reason read as their
      description, so keyboard users learn why they cannot pick them.
    </>,
    <>
      The calendar is a <code>group</code> with no visible label: name it with <code>ariaLabel</code> or{' '}
      <code>ariaLabelledby</code>.
    </>,
  ],
  related: ['date-picker', 'date-input', 'date-range-picker', 'time-input'],
};

export default doc;
