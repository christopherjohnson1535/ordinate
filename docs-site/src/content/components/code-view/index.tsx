// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'CodeView',
  folder: 'code-view',
  group: 'code-and-drawings',
  summary: 'Shows read-only code with line numbers, syntax coloring, highlighted lines and notes.',
  description: (
    <>
      <p>
        CodeView sets code in the mono face with line numbers in a column before it. It colors the code with the same
        Lezer grammars and the same colors as <a href="#/components/code-editor">CodeEditor</a>, without loading the
        editor. Each language’s grammar loads the first time a code view uses it, so the code shows uncolored for a
        moment the first time.
      </p>
      <p>
        <code>highlightedLines</code> sets lines on the highlight color with an accent mark on the leading edge.{' '}
        <code>lineNotes</code> adds a short note at the end of a line, in the body face, which is left out when the code
        is copied.
      </p>
    </>
  ),
  examples: [
    {
      id: 'file',
      title: 'A file',
      description: (
        <p>
          The common case: a whole file, colored by its <code>language</code> and named by <code>ariaLabel</code>.
        </p>
      ),
    },
    {
      id: 'highlighted-lines',
      title: 'Highlighted lines and notes',
      description: (
        <p>
          Highlight the lines that changed and say what they were with a note, as in a review of a configuration change.
        </p>
      ),
    },
    {
      id: 'languages',
      title: 'Languages',
      description: (
        <p>
          JavaScript, TypeScript, JSON, YAML, HTML, CSS, Python and Markdown are colored. <code>text</code>, the
          default, shows the code uncolored.
        </p>
      ),
    },
    {
      id: 'wrapping',
      title: 'Wrapping and line numbers',
      description: (
        <p>
          Long lines scroll sideways unless you set <code>wrapLines</code>. Turn off <code>lineNumbers</code> for a
          snippet of a line or two.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a file or a snippet that people read and copy, such as a configuration or an example request.',
      'With highlighted lines and notes, to point at what changed or what matters.',
    ],
    avoid: [
      <>
        For code people edit. Use a <a href="#/components/code-editor">CodeEditor</a>.
      </>,
      <>
        For commands and their output. Use a <a href="#/components/terminal">Terminal</a>.
      </>,
      <>
        For a name or a short command inside a sentence. Use <code>inline-code</code> on a{' '}
        <a href="#/components/box">Box</a>.
      </>,
    ],
    writing: [
      'Keep notes to a few words, such as "was 3" or "required".',
      'Name the code view with its file name when it shows a file.',
    ],
  },
  accessibility: [
    <>
      With <code>ariaLabel</code> or <code>ariaLabelledby</code>, the code view is a <code>region</code> that screen
      reader users can find in the landmarks list. Without a name it has no role.
    </>,
    'The code view is focusable, so keyboard users can reach it and scroll long lines with the arrow keys.',
    'Line numbers are hidden from screen readers and are not selected when the code is copied.',
    'Highlighted lines are not announced. When a highlight carries meaning, say it in a line note or in the text around the code.',
    'The code is always set left to right, also in right-to-left pages.',
  ],
  related: ['code-editor', 'terminal', 'copy-to-clipboard', 'text-content'],
};

export default doc;
