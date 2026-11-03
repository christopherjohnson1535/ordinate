// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'OpeningHours',
  folder: 'opening-hours',
  group: 'website-flows',
  summary: 'Shows when a shop, café or service is open, day by day, with today marked.',
  description: (
    <>
      <p>
        OpeningHours is a timetable: one row per day, the day's name at the start and its hours at the end. A heavy rule
        opens the table, as on a printed timetable, and hairlines part the days. Closed days read "Closed" in a quieter
        color, and a short note can sit under any day's hours.
      </p>
      <p>
        You write times on a 24-hour clock, such as <code>08:00</code> and <code>17:30</code>. Day names and times are
        shown in the visitor's language and clock, or in the <code>locale</code> and <code>timeFormat</code> you set.
        With <code>highlightToday</code>, today's row is marked from the visitor's own clock once the page has loaded.
        For hours that are not weekly, such as holidays, pass free-form <code>rows</code> instead of <code>days</code>.
      </p>
    </>
  ),
  examples: [
    {
      id: 'week',
      title: 'A week',
      description: (
        <p>
          A workshop's week with a closed day, notes and today marked. Shown in the <code>shopfront</code> style, where
          the opening rule is heavy and the today mark is a sunflower marker.
        </p>
      ),
    },
    {
      id: 'inverted',
      title: 'Inverted, like a sign in the window',
      description: (
        <p>
          <code>variant="inverted"</code> draws the table on a dark band of its own. A day with no times is closed, and{' '}
          <code>closedText</code> changes what closed days say. Shown in the <code>shopfront</code> style.
        </p>
      ),
    },
    {
      id: 'clock-and-language',
      title: 'Clock and language',
      description: (
        <p>
          Change the language to see day names and times follow it: 5:30 PM in en-US, 17:30 in en-GB and de-DE.{' '}
          <code>timeFormat</code> fixes the clock whatever the language. Shown in the <code>editorial</code> style.
        </p>
      ),
    },
    {
      id: 'holidays',
      title: 'Holiday hours',
      description: (
        <p>
          Free-form <code>rows</code> for dates outside the weekly pattern. Their values are shown as you write them.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'On a website for a place people visit: a shop, a café, a workshop, a surgery.',
      'With every day of the week, closed days included, so visitors do not have to guess.',
      'With a second table of rows for holidays, close to the weekly one.',
    ],
    avoid: [
      <>
        For data with more than two columns, such as a class timetable. Use a <a href="#/components/table">Table</a>.
      </>,
      'Rewriting the times as text, such as "8am–6pm". Pass them as times so each visitor sees their own format.',
    ],
    writing: [
      'Keep notes to a few words that change a visit: "Kitchen closes at 9", "Late repairs until 8".',
      'Set closedText when a reason helps, such as "Closed, riding". Keep it short.',
      'Write holiday rows with the date in full and the times in the same form as the week.',
    ],
  },
  accessibility: [
    <>
      The hours are a <code>table</code>: each day is a row header, so a screen reader reads the day with its hours. The{' '}
      <code>caption</code> names the table; without one, put a heading nearby.
    </>,
    <>
      Times are <code>time</code> elements with a machine-readable value, such as <code>17:30</code>.
    </>,
    'The today mark is a word in the row header, read after the day name, so it does not depend on color.',
    'Today is worked out in the browser, so server-rendered markup has no mark until the page loads. A page left open overnight shows the new day when the visitor comes back to it.',
  ],
  related: ['site-footer', 'section', 'how-it-works', 'table'],
};

export default doc;
