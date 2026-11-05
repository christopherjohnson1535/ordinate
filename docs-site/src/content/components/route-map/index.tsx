// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'RouteMap',
  folder: 'route-map',
  group: 'code-and-drawings',
  summary: 'Shows the parts of a course or a program as lines of stops, and how far someone has come.',
  description: (
    <>
      <p>
        A route map is drawn like a transit map. Each line is a row: its title and description at the start, then its
        stops left to right on an ink line. With a <code>terminus</code>, every line runs on past its stops and bends at
        right angles onto one shared run into a square station, where the route ends.
      </p>
      <p>
        A stop is <code>planned</code> (faint), <code>open</code> (in ink) or <code>done</code> (filled in). A{' '}
        <code>station</code> is drawn as a square, for a stop that matters more than the others. The current stop is
        ringed in the accent color with a note above it, “You are here” unless you set <code>currentStopLabel</code>,
        and the selected line sits on a highlight band. A long terminus title or description wraps onto more lines, and
        the map grows to fit it. The map scales to the width of its container and scrolls sideways once it is too narrow
        to read.
      </p>
    </>
  ),
  marks: ['M11'],
  examples: [
    {
      id: 'course',
      title: 'A course',
      description: (
        <p>
          Four modules of lessons, each ending in a lab drawn as a station, all leading to one capstone. The ring marks
          where the learner left off.
        </p>
      ),
    },
    {
      id: 'links',
      title: 'Lines as links',
      description: (
        <p>
          Give a line an <code>href</code> and its title, description and stops become one link. Handle{' '}
          <code>onFollow</code> and call <code>preventDefault()</code> to route in the page, here to select the line and
          show its details.
        </p>
      ),
    },
    {
      id: 'without-terminus',
      title: 'Without a terminus',
      description: (
        <p>
          Leave out <code>terminus</code> when the lines do not lead to one place. Each line then ends at its last stop.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a course, a training program or an onboarding plan made of parts that people work through.',
      'To show where someone left off and what is still ahead, next to the details of the part they are in.',
    ],
    avoid: [
      <>
        For the steps of one task in a fixed order. Use <a href="#/components/steps">Steps</a> or a{' '}
        <a href="#/components/wizard">Wizard</a>.
      </>,
      <>
        For how the parts of a system connect. Use a <a href="#/components/schematic">Schematic</a>.
      </>,
      'For many lines or very long lines. Past six lines or about twelve stops a line, the map gets hard to read; split it into sections.',
    ],
    writing: [
      'Name each line for what it covers, in a few words: "Storage and backups".',
      'Use the description for progress, such as "2 of 6 lessons done".',
      'Keep currentStopLabel short, such as "Next up" or "You are here".',
    ],
  },
  accessibility: [
    <>
      The map is a <code>group</code> named by <code>ariaLabel</code>. The titles, descriptions and the current-stop
      note are text that screen readers read; the lines and stops are drawing only.
    </>,
    'The status of each stop is shown by shape and fill only. Say the progress in the line’s description, such as "2 of 6 lessons done".',
    <>
      A line or terminus with an <code>href</code> is a link, reached with Tab and followed with Enter. Its name is its
      title and description.
    </>,
    <>
      <code>onFollow</code> fires on plain left clicks and Enter. Clicks with a modifier key are left to the browser, so
      people can open a line in a new tab.
    </>,
    'The map keeps its geometry in right-to-left pages.',
  ],
  related: ['schematic', 'steps', 'progress-bar', 'wizard'],
};

export default doc;
