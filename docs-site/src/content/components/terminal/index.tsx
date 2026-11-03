// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Terminal',
  folder: 'terminal',
  group: 'code-and-drawings',
  summary: 'Shows a transcript of terminal commands and what they printed.',
  description: (
    <>
      <p>
        A terminal is a dark panel in the mono face, on the terminal colors in light and dark mode alike. You give it
        the lines of the transcript, and each line’s <code>type</code> sets its color and weight: commands in bright
        ink, output in a softer one, table headers in bold, results in the success and error colors, and notes in
        italics.
      </p>
      <p>
        Long lines wrap with a hanging indent. Lines laid out in columns, with three or more spaces between words,
        never wrap, so the tables that command-line tools print stay aligned.
      </p>
    </>
  ),
  examples: [
    {
      id: 'transcript',
      title: 'A command and its output',
      description: (
        <p>
          Write each command with its prompt; the terminal shows the text as given. A <code>header</code> line sets
          the column names of a table in bold.
        </p>
      ),
    },
    {
      id: 'results',
      title: 'Results',
      description: (
        <p>
          <code>success</code> and <code>error</code> lines color a result. Start them with a word that says the
          same, such as PASS and FAIL, because color is never the only difference.
        </p>
      ),
    },
    {
      id: 'walkthrough',
      title: 'A walkthrough',
      description: (
        <p>
          In a step-by-step guide, mark the output that a step added with <code>highlighted</code>, so the reader sees
          what changed.
        </p>
      ),
    },
    {
      id: 'wrapping',
      title: 'Wrapping',
      description: (
        <p>
          On the left, the long command wraps and the table keeps its columns. With <code>wrapLines</code> off, on the
          right, every line scrolls sideways.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For commands people run and the output they should expect, in a guide or a runbook.',
      'For the output of a job, a check or a build, kept as a transcript.',
    ],
    avoid: [
      <>
        For a file or a snippet of code. Use a <a href="#/components/code-view">CodeView</a>.
      </>,
      'For a live log that keeps growing. The terminal shows the lines it is given; it has no scrolling to the end and no streaming.',
      'Long transcripts. Show the commands and the lines that matter, and link to the full log.',
    ],
    writing: [
      'Write commands with their prompt, such as "$ ord nodes list", so they read as typed.',
      'Start success and error lines with a word that says the result: "PASS", "FAIL", "Rollout finished".',
      'Use a muted line for a note about the output, not for the output itself.',
    ],
  },
  accessibility: [
    <>
      With <code>ariaLabel</code> or <code>ariaLabelledby</code>, the terminal is a <code>region</code> that screen
      reader users can find in the landmarks list.
    </>,
    'The terminal is focusable, so keyboard users can reach it and scroll lines that do not wrap.',
    'Line types and highlights are color and weight only. Put the meaning in the words of the line.',
    'The text is always set left to right, also in right-to-left pages.',
  ],
  related: ['code-view', 'code-editor', 'steps'],
};

export default doc;
