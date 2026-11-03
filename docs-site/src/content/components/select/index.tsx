// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Select',
  folder: 'select',
  group: 'forms',
  summary: 'Lets the user choose one option from a list that opens below the field.',
  description: (
    <>
      <p>
        A select is a field-shaped button: a hairline edge with an ink baseline, the chosen option and a chevron. It
        opens a list on a plate, a white sheet with an ink edge on a hard offset, lifted off the drawing. The chosen
        option carries a check after its label. Options can have descriptions, tags, icons and group headings, and a
        long list can take a filter input at the top.
      </p>
      <p>
        The select is controlled: set <code>selectedOption</code> and update it in <code>onChange</code>. Options are
        matched by <code>value</code>, so the option you pass back does not need to be the same object.
      </p>
    </>
  ),
  marks: ['M9', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'Choose an option',
      description: (
        <p>
          Give each option a <code>label</code> and a <code>value</code>, and a <code>description</code> or{' '}
          <code>labelTag</code> where it helps the user tell options apart.
        </p>
      ),
    },
    {
      id: 'groups',
      title: 'Groups, icons and disabled options',
      description: (
        <p>
          An option with its own <code>options</code> is a group with a heading. Disabling a group disables every option
          in it; say why in its description.
        </p>
      ),
    },
    {
      id: 'filtering',
      title: 'Filtering a long list',
      description: (
        <p>
          <code>filteringType=&quot;auto&quot;</code> adds a filter input and hides options whose label, value,
          description or tags do not contain the text. Add <code>filteringTags</code> for words that should match
          without being shown.
        </p>
      ),
    },
    {
      id: 'async',
      title: 'Loading options',
      description: (
        <p>
          Load options in <code>onLoadItems</code> when the list opens, and report progress with{' '}
          <code>statusType</code>. On an error the list shows a retry button, which calls <code>onLoadItems</code>{' '}
          again.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Validation and unavailable states',
      description: (
        <p>
          A FormField&apos;s <code>errorText</code> draws the edge in the error color. Read-only keeps the select
          focusable so the value can be read; disabled hatches it.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For one choice from a list of more than about seven options, or a list that comes from the system.',
      'Where space is short and the options do not need to be compared side by side.',
    ],
    avoid: [
      <>
        For a few options that the user should compare. Use a <a href="#/components/radio-group">RadioGroup</a> or{' '}
        <a href="#/components/tiles">Tiles</a>.
      </>,
      <>
        For choosing more than one option. Use a <a href="#/components/multiselect">Multiselect</a>.
      </>,
      <>
        When the user may type a value that is not in the list. Use an{' '}
        <a href="#/components/autosuggest">Autosuggest</a>.
      </>,
      <>
        For actions. Use a <a href="#/components/button-dropdown">ButtonDropdown</a>.
      </>,
    ],
    writing: [
      'Write the placeholder as an instruction with the noun: "Choose a region".',
      'Keep option labels short and put the detail in the description or label tag.',
      'Write empty, noMatch and error texts that say what happened: "No vaults in us-mountain-1".',
    ],
  },
  accessibility: [
    <>
      The trigger is a native button with <code>aria-haspopup=&quot;listbox&quot;</code> and{' '}
      <code>aria-expanded</code>. Inside a FormField it is named by the field&apos;s label followed by the chosen option.
      Outside one, give it an <code>ariaLabel</code>.
    </>,
    'Enter, Space, Up or Down opens the list. Typing letters on the closed trigger opens the list at the first option that starts with them.',
    'In the list, Up and Down move the highlight, Home, End, Page Up and Page Down jump, and typing moves to a matching option. Enter or Space chooses it, Escape closes the list and focus goes back to the trigger.',
    <>
      The list is a <code>listbox</code> of <code>option</code>s with <code>aria-selected</code> on the chosen one.
      With filtering, the filter input is a combobox that keeps focus while the arrow keys move the highlight.
    </>,
    'Loading, finished and error texts sit in a polite live region, so they are announced as they change.',
    'A read-only select stays focusable and is marked aria-disabled; it does not open.',
  ],
  related: ['multiselect', 'autosuggest', 'radio-group', 'tiles', 'form-field'],
};

export default doc;
