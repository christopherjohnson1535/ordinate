// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'DateRangePicker',
  folder: 'date-range-picker',
  group: 'dates-and-files',
  summary: 'Lets the user choose a span of time, either counted back from now or between two dates.',
  description: (
    <>
      <p>
        The trigger is drawn as a text field with a calendar icon and the range written out, such as “Last 6 hours” or
        “Mar 5 – 18, 2026”. It opens a plate with two modes, chosen with a segmented control. Relative mode lists your{' '}
        <code>relativeOptions</code> and a custom duration. Absolute mode shows two months side by side, or one on a
        narrow screen, with inputs for the start and end dates and times. The chosen days carry crop marks, the days
        between them take a raised band, and the range’s length is lettered under the months as a measure.
      </p>
      <p>
        Nothing changes until the user presses Apply. The picker then checks that the range is complete and in order,
        runs your <code>isValidRange</code>, and either calls <code>onChange</code> and closes or shows the error in the
        popup. An absolute value holds ISO strings, <code>YYYY-MM-DDTHH:mm:ss</code>, or <code>YYYY-MM-DD</code> with{' '}
        <code>dateOnly</code>. A relative value holds an amount and a unit counted back from now.
      </p>
    </>
  ),
  marks: ['M9', 'M5', 'M3', 'M12'],
  examples: [
    {
      id: 'relative',
      title: 'Relative range',
      description: (
        <p>
          The usual filter for logs and metrics: a few ready-made ranges, a custom duration, and absolute mode one click
          away. Keep the <code>key</code> of each option so the value can be matched back to it.
        </p>
      ),
    },
    {
      id: 'absolute',
      title: 'Absolute range with times',
      description: (
        <p>
          Picking a day starts a range and the next pick ends it; the start and end times default to the start and end
          of the day. <code>timeInputFormat</code> sets which parts of the time the user enters.
        </p>
      ),
    },
    {
      id: 'date-only',
      title: 'Whole days only',
      description: (
        <p>
          With <code>dateOnly</code> and <code>rangeSelectorMode="absolute-only"</code> the popup is just the calendar
          and two date inputs. Days that cannot be chosen are hatched, with the reason read to screen readers.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Checking the range',
      description: (
        <p>
          <code>isValidRange</code> runs when the user presses Apply. Return an error message to keep the popup open and
          say what to change.
        </p>
      ),
    },
    {
      id: 'relative-only',
      title: 'Relative only',
      description: (
        <p>
          <code>rangeSelectorMode="relative-only"</code> hides the mode switch. Without a clear button the user must
          always keep a range.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To filter a collection, a log or a chart by time.',
      'For a booking or reporting period with a start and an end.',
      'In relative mode when the data is live and the user wants “the last hour”, whatever time it is.',
    ],
    avoid: [
      <>
        For a single date. Use a <a href="#/components/date-picker">DatePicker</a>.
      </>,
      'Relative options that a custom duration covers just as well. Offer the three or four ranges people use most.',
      'Allowing a range your service cannot answer. Refuse it in isValidRange and say what the limit is.',
    ],
    writing: [
      'Write the placeholder as an instruction: "Filter by a date and time range".',
      'Make isValidRange errors say what to change: "Choose a range of 31 days or less."',
      'Leave formatRelativeRange unset unless you translate it: the default reads "Last 6 hours".',
    ],
  },
  accessibility: [
    <>
      The trigger is a native button with <code>aria-haspopup="dialog"</code> and <code>aria-expanded</code>. Its name
      is the field label followed by the range it shows.
    </>,
    'Opening the popup moves focus to the calendar or to the list of relative ranges. Tab stays inside the popup, and Escape closes it without applying and returns focus to the trigger.',
    'The calendar grids share one tab stop and the keys of Calendar. When both ends are chosen, the range is announced through a live region.',
    'Errors from Apply are shown with role="alert", so they are announced as they appear.',
    'Disabled days stay focusable, with the reason read as their description.',
    'The popup is labelled “Choose a date range”; replace it with dialogAriaLabel when you translate the picker.',
  ],
  related: ['date-picker', 'calendar', 'time-input', 'property-filter', 'segmented-control'],
};

export default doc;
