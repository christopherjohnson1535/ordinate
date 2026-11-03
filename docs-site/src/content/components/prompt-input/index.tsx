// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'PromptInput',
  folder: 'prompt-input',
  group: 'forms',
  summary: 'Takes a message for an assistant or a command line, and sends it with Enter or the send button.',
  description: (
    <>
      <p>
        A prompt input is a text field that grows with its text and carries its own send button. It is drawn like the
        other text fields, a hairline edge with an ink baseline to write on, and attachments and extra controls sit
        inside the same edge, above and below the text.
      </p>
      <p>
        Enter sends the prompt and Shift+Enter starts a new line. The prompt is controlled: <code>onAction</code> hands
        you the text, and you clear <code>value</code> if the prompt should empty once sent.
      </p>
    </>
  ),
  marks: ['M12'],
  examples: [
    {
      id: 'chat',
      title: 'Send a message',
      description: (
        <p>
          Keep the text in state, clear it in <code>onAction</code>, and disable the action button while the prompt is
          empty or a reply is still arriving.
        </p>
      ),
    },
    {
      id: 'attachments',
      title: 'Attachments and extra actions',
      description: (
        <p>
          <code>secondaryContent</code> shows what goes with the prompt, such as attached files, above the text.{' '}
          <code>secondaryActions</code> adds a row of controls below it, and the send button moves into that row.
        </p>
      ),
    },
    {
      id: 'rows',
      title: 'Height',
      description: (
        <p>
          The prompt starts at <code>minRows</code> lines, grows with its text to <code>maxRows</code>, then scrolls.
          Give a longer task a taller start, and set <code>maxRows</code> to <code>-1</code> to let it grow without
          limit.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Validation and unavailable states',
      description: (
        <p>
          Inside a FormField, <code>errorText</code> and <code>warningText</code> draw the edge in the status color.
          Read-only keeps the text selectable; disabled hatches the field and takes it out of the tab order.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the message box of an assistant or chat, where Enter sends.',
      'For a single command run against a system, such as a query or a deploy command.',
    ],
    avoid: [
      <>
        For free text that is saved with a form, such as a description. Use a{' '}
        <a href="#/components/textarea">Textarea</a>, where Enter adds a line.
      </>,
      <>
        For a short value in a form. Use an <a href="#/components/input">Input</a>.
      </>,
      'Putting send, attach and other actions outside the prompt. Keep them in secondaryActions so they read as part of it.',
    ],
    writing: [
      'Label the prompt for what the user is talking to: "Ask the assistant", "Run a command".',
      'Use the placeholder for an example of a good prompt, not for instructions the user needs once they start typing.',
      'Say in the description that Shift+Enter adds a line when people are likely to write more than one.',
      'Name the action button for what it does when it is not "Send", such as "Run query".',
    ],
  },
  accessibility: [
    'The prompt is a native <textarea>. Enter sends and Shift+Enter adds a line break; while an input method is composing text, Enter is left to it.',
    <>
      The action button is named &quot;Send&quot; unless you set <code>actionButtonAriaLabel</code>. It is disabled
      while <code>disableActionButton</code>, <code>disabled</code> or <code>readOnly</code> is set, and Enter does not
      send then either.
    </>,
    <>
      Inside a FormField the prompt takes its label, description and error from the field. Without one, give it an{' '}
      <code>ariaLabel</code>.
    </>,
    'Icon buttons in secondaryActions have no visible text, so give each one an ariaLabel.',
    'Messages that arrive in reply are not announced by the prompt. Put the conversation in a live region, or announce new replies some other way.',
  ],
  related: ['textarea', 'input', 'form-field', 'token-group'],
};

export default doc;
