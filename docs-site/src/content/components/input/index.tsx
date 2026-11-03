// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Input',
  folder: 'input',
  group: 'forms',
  summary: 'Lets the user type a single line of text, a number or a search.',
  description: (
    <>
      <p>
        An input is drawn as a line on a paper form: a light hairline edge with a darker ink baseline to write on. A
        read-only input drops the baseline and takes a raised fill, a disabled one is hatched, and an error or warning
        draws the edge, the baseline and a leading mark in the status color. Textarea, Select, Autosuggest and the date
        inputs share the same drawing.
      </p>
      <p>
        The input is controlled: pass <code>value</code> and update it in <code>onChange</code>. Put it in a{' '}
        <a href="#/components/form-field">FormField</a>, which gives it a label and its validation state.
      </p>
    </>
  ),
  marks: ['M12'],
  examples: [
    {
      id: 'basic',
      title: 'Text input',
      description: (
        <p>
          The most common use: a text input in a form field. For IDs, codes and host names, turn off autocorrect with{' '}
          <code>disableBrowserAutocorrect</code> and spell check with <code>spellcheck={'{false}'}</code>.
        </p>
      ),
    },
    {
      id: 'types',
      title: 'Types and keyboards',
      description: (
        <p>
          <code>type</code> sets the native input type. <code>inputMode</code> picks the on-screen keyboard and{' '}
          <code>autoComplete</code> tells the browser what to fill in. A <code>number</code> input loses focus when the
          page scrolls over it, so the value is not changed by accident.
        </p>
      ),
    },
    {
      id: 'search',
      title: 'Search',
      description: (
        <p>
          A <code>search</code> input shows a search icon, and a clear button while it has a value. Without a visible
          label it needs an <code>ariaLabel</code>.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Read-only, disabled and invalid',
      description: (
        <p>
          <code>readOnly</code> keeps the value focusable and selectable; <code>disabled</code> takes the input out of
          the tab order. The error and warning come from the surrounding form field.
        </p>
      ),
    },
    {
      id: 'keys',
      title: 'Inline label and key events',
      description: (
        <p>
          <code>inlineLabelText</code> draws a short label inside the top of the input, for places with no room for a
          form field. <code>onKeyDown</code> reports each key; call <code>preventDefault()</code> to stop its default
          action. Press Enter to add a tag.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a short free-text value: a name, an address, a number, a host.',
      'With type="search" to filter a list on the same page.',
      'Inside a FormField with a visible label, in almost every case.',
    ],
    avoid: [
      <>
        For text longer than one line. Use a <a href="#/components/textarea">Textarea</a>.
      </>,
      <>
        For a value chosen from a known list. Use a <a href="#/components/select">Select</a>, or an{' '}
        <a href="#/components/autosuggest">Autosuggest</a> when the user may also type their own.
      </>,
      <>
        For dates. Use a <a href="#/components/date-input">DateInput</a> or{' '}
        <a href="#/components/date-picker">DatePicker</a>.
      </>,
      'A placeholder in place of a label. It disappears as soon as the user types.',
      'disabled for a value the user should still be able to read and copy. Use readOnly.',
    ],
    writing: [
      'Use the placeholder for an example of the format, such as "survey-api", not for instructions.',
      'Name search inputs by what they find: "Find services", not "Search".',
    ],
  },
  accessibility: [
    <>
      The input is a native <code>&lt;input&gt;</code>. Inside a form field it is labelled by the field's label and
      described by its messages; outside one, give it an <code>ariaLabel</code>.
    </>,
    <>
      An error on the field sets <code>aria-invalid</code>. Set <code>ariaRequired</code> for a required value; the
      input does not show a required mark on its own.
    </>,
    <>
      The clear button of a search input is a real button named by <code>clearAriaLabel</code>, "Clear" by default. It
      moves focus back to the input.
    </>,
    'A disabled input cannot be focused, so screen reader users may miss it. Prefer readOnly, or say why the value is unavailable in the constraint text.',
    <>
      <code>autoFocus</code> moves focus when the input first renders. Use it only where the input is the first thing
      the user needs, such as a search page.
    </>,
  ],
  related: ['form-field', 'textarea', 'autosuggest', 'control-group', 'select'],
};

export default doc;
