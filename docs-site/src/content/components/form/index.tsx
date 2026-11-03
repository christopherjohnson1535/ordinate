// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Form',
  folder: 'form',
  group: 'forms',
  summary: 'Frames a set of fields with a title, an error for the whole form and the actions that submit it.',
  description: (
    <>
      <p>
        A form is drawn like a section of the sheet: a construction line in its kind's color opens it, an optional
        reference such as <code>C4</code> sits above the header, and the actions stand on a rule closed by hash marks.
        An error that applies to the whole form sits just above that rule.
      </p>
      <p>
        Form does not render a <code>&lt;form&gt;</code> element. Wrap it in your own <code>&lt;form&gt;</code> and
        handle <code>onSubmit</code> there; buttons submit by default, so give every button that should not submit{' '}
        <code>formAction="none"</code>.
      </p>
    </>
  ),
  marks: ['M1', 'M2', 'M8'],
  examples: [
    {
      id: 'complete',
      title: 'A complete form',
      description: (
        <p>
          A header, fields in the margin layout, a secondary action at the start of the footer and the main actions at
          the end. Submit with the region empty to see the form error and the field error together.
        </p>
      ),
    },
    {
      id: 'request-error',
      title: 'An error from the server',
      description: (
        <p>
          Use <code>errorText</code> for a failure that belongs to no single field, such as a request that did not go
          through. Say what happened and what to do next. Saving here always fails.
        </p>
      ),
    },
    {
      id: 'sections',
      title: 'Fields in sections',
      description: (
        <p>
          A long form groups its fields in Containers of the same kind. Give each container a reference under the
          form's, so a note elsewhere on the page can point at it.
        </p>
      ),
    },
    {
      id: 'kinds',
      title: 'Kind and embedded forms',
      description: (
        <p>
          The <code>kind</code> colors the opening line, the closing rule and the reference: <code>policy</code> here,
          for a rule the system follows. <code>variant="embedded"</code> is for a form inside a larger page; it looks
          the same as <code>full-page</code>.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a page or a section whose job is to create or change one thing.',
      'With one primary action, last in actions, and Cancel as a link button before it.',
      'With errorText for a failure the user cannot fix in one field, such as a timeout or a permission error.',
    ],
    avoid: [
      <>
        For a single setting that saves on its own. Use a <a href="#/components/toggle">Toggle</a> or an inline edit
        instead of a form with a Save button.
      </>,
      <>
        For a form spread over several steps. Use a <a href="#/components/wizard">Wizard</a>.
      </>,
      'Field-level problems in errorText. Put them on the field with FormField errorText, and use the form error to say that the form has problems.',
    ],
    writing: [
      'Title the form with what it does, as a verb and a noun: "Create project", "Edit survey-api".',
      'Repeat the title\'s verb on the primary button: "Create project", not "Submit".',
      'Write the form error as what happened, then what to do: "The settings were not saved because … Try again in a few minutes."',
    ],
  },
  accessibility: [
    <>
      The area for <code>errorText</code> is always in the page with <code>role="alert"</code>, so a new error is
      announced as soon as it appears. Name its icon with <code>errorIconAriaLabel</code>.
    </>,
    <>
      Form renders no <code>&lt;form&gt;</code> and no heading of its own. Wrap it in a <code>&lt;form&gt;</code> so
      Enter in a text field submits, and pass a heading in <code>header</code> at the right level for the page.
    </>,
    'The reference is plain text read before the header. Keep it short.',
    'After a failed submit, move focus to the first field with an error, or leave it on the button so the announced form error is heard.',
  ],
  related: ['form-field', 'container', 'header', 'button', 'wizard'],
};

export default doc;
