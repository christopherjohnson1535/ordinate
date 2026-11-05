// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Textarea',
  folder: 'textarea',
  group: 'forms',
  summary: 'Takes text that runs to more than one line, such as a description, a note or a script.',
  description: (
    <>
      <p>
        A textarea is drawn like every text field: a hairline edge with an ink baseline to write on. Read-only drops the
        baseline and takes a raised fill, disabled is hatched, and an error or warning draws the edge in its status
        color. By default the user can drag it taller; it always fills the width of its container.
      </p>
      <p>
        A limit on the length is a measure, so it is drawn as a dimension line under the control: set the surrounding
        FormField&apos;s <code>characterCountText</code> on every change, and the field draws and announces it. The
        textarea itself does not count or cut text.
      </p>
    </>
  ),
  marks: ['M3', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'In a form field',
      description: (
        <p>
          The common case: a labelled textarea with a description. Set <code>rows</code> to the length of text you
          expect.
        </p>
      ),
    },
    {
      id: 'character-limit',
      title: 'Character limit',
      description: (
        <p>
          <code>characterCountText</code> on the FormField draws the count as a dimension line under the control. Go
          past the limit and an <code>errorText</code> says how to fix it; the text is never cut.
        </p>
      ),
    },
    {
      id: 'code',
      title: 'Code and keyboard shortcuts',
      description: (
        <p>
          For scripts and identifiers, turn off <code>spellcheck</code> and browser autocorrect. <code>onKeyDown</code>{' '}
          can take a shortcut such as Ctrl+Enter; call <code>preventDefault()</code> to stop the line break.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Warning, read-only and disabled',
      description: (
        <p>
          Set the FormField&apos;s <code>warningText</code> for a value that is allowed but worth a second look. The
          textarea takes the warning&apos;s color from the field. Read-only text can still be selected and copied.
          Disabled hatches the field and takes it out of the tab order; say why next to it.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For free text that may run to several lines: descriptions, notes, comments, addresses, scripts.',
      'When the text is saved with a form and Enter should start a new line.',
    ],
    avoid: [
      <>
        For a short value on one line, such as a name. Use an <a href="#/components/input">Input</a>.
      </>,
      <>
        For a message that is sent with Enter, such as a chat. Use a <a href="#/components/prompt-input">PromptInput</a>
        .
      </>,
      <>
        For code that needs line numbers and highlighting. Use a <a href="#/components/code-editor">CodeEditor</a>.
      </>,
    ],
    writing: [
      'Label the field with what to write: "Change summary", not "Text".',
      'State the limit in the count, such as "84 of 200 characters", rather than in a separate sentence.',
      'Use the placeholder for an example only. It disappears once the user starts typing.',
    ],
  },
  accessibility: [
    'The control is a native <textarea>, so it behaves as the platform expects for typing, selection and resizing.',
    <>
      Inside a FormField it takes its label, description, constraint and messages from the field. Without one, give it
      an <code>ariaLabel</code>.
    </>,
    <>
      The FormField announces <code>characterCountText</code> after typing pauses for a second, so the count is not read
      on every key.
    </>,
    <>
      A FormField&apos;s <code>warningText</code> puts the textarea in its warning state and describes it. The{' '}
      <code>warning</code> prop only changes how the field looks, so when you set it yourself, say what the warning is
      about in text you point to with <code>ariaDescribedby</code>.
    </>,
    'Read-only keeps the text focusable and selectable. Disabled removes it from the tab order.',
    'Use autoFocus only when the textarea is the obvious next step, such as the only field in a modal.',
  ],
  related: ['input', 'prompt-input', 'form-field', 'code-editor'],
};

export default doc;
