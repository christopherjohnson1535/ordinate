// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'CodeEditor',
  folder: 'code-editor',
  group: 'forms',
  summary: 'Lets the user write and edit code, with syntax highlighting, a status bar and a resize handle.',
  description: (
    <>
      <p>
        A code editor is a hairline-edged field with the code above and a status bar below. The status bar shows the
        language, the cursor position, counts of syntax errors and warnings, a toggle for what Tab does and a button for
        the user's preferences. A handle on the bottom edge resizes the editing area.
      </p>
      <p>
        The engine is CodeMirror 6. It is loaded with a dynamic <code>import()</code> the first time an editor renders,
        and each language is loaded only when an editor uses it, so a page without a code editor downloads none of it.
        The editor shows a loading state until the engine is ready. Supported languages are JavaScript, TypeScript,
        JSON, YAML, HTML, CSS, Python and Markdown, and <code>text</code> for anything else.
      </p>
    </>
  ),
  examples: [
    {
      id: 'basic',
      title: 'Editor in a form field',
      description: (
        <p>
          The editor is controlled: update <code>value</code> in <code>onChange</code>. Use <code>onDelayedChange</code>
          , called half a second after typing stops, for work such as saving a draft. Store <code>preferences</code> and{' '}
          <code>editorContentHeight</code> per user to keep their choices.
        </p>
      ),
    },
    {
      id: 'languages',
      title: 'Languages',
      description: (
        <p>
          <code>language</code> sets the highlighting, indentation and completions. Switch languages to see each one
          load on first use. Syntax errors found by the language's parser are marked in the code and counted in the
          status bar.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Validation',
      description: (
        <p>
          The editor takes its label and error state from the surrounding form field. Here the JSON is checked in{' '}
          <code>onDelayedChange</code>, so the error does not change on every key. Close the brace to clear it.
        </p>
      ),
    },
    {
      id: 'read-only',
      title: 'Read-only, loading and fixed theme',
      description: (
        <p>
          <code>readOnly</code> keeps the code focusable, selectable and searchable. <code>loading</code> shows the
          loading state while the code itself loads. A <code>theme</code> of <code>dark</code> or <code>light</code>{' '}
          holds regardless of the page mode, and <code>languageLabel</code> names a language the editor does not
          highlight.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For code or configuration the user writes or edits: policies, templates, scripts, service definitions.',
      'Inside a FormField, with stretch, so the editor takes the full width and has a visible label.',
    ],
    avoid: [
      <>
        For showing code the user only reads. Use a <a href="#/components/code-view">CodeView</a>, which is lighter and
        needs no engine.
      </>,
      <>
        For plain text. Use a <a href="#/components/textarea">Textarea</a>.
      </>,
      'For a single line of code, such as an expression. Use an Input with spellcheck and autocorrect turned off.',
    ],
    writing: [
      'Label the field with what the code is: "Access policy", "Service definition".',
      'Write errors from your own validation in the form field errorText, with what to fix.',
    ],
  },
  accessibility: [
    <>
      Inside a form field, the editing area is labelled by the field's label and described by its messages. Without one,
      set <code>ariaLabel</code>. The editor and the status bar are each a named group.
    </>,
    'Tab indents inside the editor. To leave it, press Escape and then Tab, or turn on "Tab moves focus" in the status bar or with Ctrl+M (Shift+Alt+M on macOS).',
    'The error and warning counts in the status bar are buttons that move the cursor to the next problem.',
    'The resize handle is a separator that takes focus; Arrow Up and Arrow Down change the height, Home and End go to the smallest and largest.',
    <>
      The preferences open in a modal and return focus to the preferences button when it closes. A read-only editor is
      marked <code>aria-readonly</code>.
    </>,
    'Code is laid out left to right in every page direction; only the status bar follows the page.',
  ],
  related: ['code-view', 'textarea', 'form-field', 'input'],
};

export default doc;
