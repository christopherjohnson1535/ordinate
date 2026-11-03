// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Autosuggest',
  folder: 'autosuggest',
  group: 'forms',
  summary: 'A text input that suggests values as the user types, while still taking any text.',
  description: (
    <>
      <p>
        An autosuggest is an <a href="#/components/input">Input</a> with a list of suggestions that drops from it as a
        plate: a white sheet with a hairline ink edge on a hard offset. The suggestion under the pointer or the arrow
        keys is a raised row, and group labels are lettered in small mono capitals.
      </p>
      <p>
        The value is always the text in the input. Choosing a suggestion puts its <code>value</code> into the input; the
        user can also keep their own text, which the list offers as its first row, "Use: …". Hide that row with{' '}
        <code>hideEnteredTextOption</code> when only suggestions are allowed.
      </p>
    </>
  ),
  marks: ['M9', 'M13', 'M1'],
  examples: [
    {
      id: 'basic',
      title: 'Suggestions with your own text',
      description: (
        <p>
          With <code>filteringType="auto"</code>, the default, the list hides suggestions whose label, value,
          description or tags do not contain the text. Type "survey", or a host of your own.
        </p>
      ),
    },
    {
      id: 'groups',
      title: 'Groups, icons and onSelect',
      description: (
        <p>
          Put suggestions in groups to show them under a label. <code>onSelect</code> fires when a row is chosen, with
          the suggestion in <code>event.detail.selectedOption</code>; use it to act on the choice, here to run a
          command and clear the input.
        </p>
      ),
    },
    {
      id: 'async',
      title: 'Loading suggestions',
      description: (
        <p>
          With <code>filteringType="manual"</code> the list shows every option it is given. Fetch them in{' '}
          <code>onLoadItems</code>, which is called as the text changes, and report progress with{' '}
          <code>statusType</code>.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Warning, load error and read-only',
      description: (
        <p>
          Validation comes from the surrounding form field. A failed load sets <code>statusType="error"</code>; the
          recovery button calls <code>onLoadItems</code> with <code>samePage</code> set. Open the second list to see it.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a free-text value where most people type one of a few known values: a host, a tag, a person.',
      'For a command line or quick search that offers recent entries.',
    ],
    avoid: [
      <>
        When the value must be one of the options. Use a <a href="#/components/select">Select</a> with filtering.
      </>,
      <>
        For choosing several values. Use a <a href="#/components/multiselect">Multiselect</a>.
      </>,
      <>
        For filtering a table by properties. Use a <a href="#/components/property-filter">PropertyFilter</a>.
      </>,
    ],
    writing: [
      'Write the entered-text row as an action: "Use "east-1"", not just the text again.',
      'Say in empty what to do next when nothing matches: "No services match".',
      'Keep suggestion labels short and put the detail in the description.',
    ],
  },
  accessibility: [
    <>
      The input has <code>role="combobox"</code> with <code>aria-autocomplete="list"</code>. Focus stays in the
      input; the highlighted suggestion is set with <code>aria-activedescendant</code>.
    </>,
    'Arrow Down and Arrow Up open the list and move through it, Page Up and Page Down move by a page, Enter chooses the highlighted suggestion, and Tab closes the list.',
    'Escape closes the list; pressed again with the list closed, it clears the input.',
    'Enter on a highlighted suggestion does not submit a surrounding form. Enter with nothing highlighted closes the list and submits as usual.',
    'Disabled suggestions stay in the list and are skipped by the arrow keys.',
    <>
      Inside a form field the list is labelled by the field's label. Without one, set <code>ariaLabel</code>.
    </>,
  ],
  related: ['input', 'select', 'multiselect', 'property-filter', 'form-field'],
};

export default doc;
