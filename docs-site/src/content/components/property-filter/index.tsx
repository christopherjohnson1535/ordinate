// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'PropertyFilter',
  folder: 'property-filter',
  group: 'collections',
  summary: 'Narrows a collection with conditions on its properties, such as Status = Running and vCPUs >= 4.',
  description: (
    <>
      <p>
        A property filter reads as one query line inside a text field on an ink baseline: "where", then each condition
        as a token, joined by "and" or "or", then the input for the next condition and a result count at the end. The
        property and operator are set in mono, the value in sans, and the joins in small mono capitals. Each token is a
        hairline box with no offset, and opens an editor in a popover when clicked.
      </p>
      <p>
        The user types a property name, an operator and a value, helped by suggestions at each step, and Enter adds the
        condition. Text that names no property becomes a free-text condition that matches any property. The filter is
        controlled and matches nothing itself: pass the query to <code>useCollection</code>, or to your server.
      </p>
    </>
  ),
  marks: ['M3'],
  examples: [
    {
      id: 'collection',
      title: 'Filtering a table',
      description: (
        <p>
          Give <code>useCollection</code> the filtering properties and spread its <code>propertyFilterProps</code> onto
          the filter: they carry the query, the change handler and value suggestions taken from the items. Type
          “Status”, pick an operator and a value, or type “vCPUs &gt; 8” and press Enter. Inside a table, set{' '}
          <code>expandToViewport</code> so the suggestions are not clipped.
        </p>
      ),
    },
    {
      id: 'operation-and-limit',
      title: 'And, or, and a token limit',
      description: (
        <p>
          The join word after the first condition is a select that switches the whole query between <code>and</code> and{' '}
          <code>or</code>. <code>tokenLimit</code> hides conditions past the limit behind a "+2 more" button. Options
          with a <code>label</code> show it in place of the stored value.
        </p>
      ),
    },
    {
      id: 'properties-only',
      title: 'Properties only',
      description: (
        <p>
          <code>disableFreeTextFiltering</code> accepts only text that names a property. <code>hideOperations</code>{' '}
          writes the join as plain text, for filters that always combine with <code>and</code>.
        </p>
      ),
    },
    {
      id: 'async',
      title: 'Suggestions from a server',
      description: (
        <p>
          <code>onLoadItems</code> asks for suggestions as the user types, with the property and the text so far. Set{' '}
          <code>filteringStatusType</code> to <code>loading</code> while the request runs, and pass the results in{' '}
          <code>filteringOptions</code>.
        </p>
      ),
    },
    {
      id: 'custom-control',
      title: 'Saved filter sets',
      description: (
        <p>
          <code>customControl</code> puts a control before the query line, such as a select of saved sets.{' '}
          <code>customFilterActions</code> replaces the Clear filters button; clear the filters yourself from it if you
          still offer that.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a collection the user narrows by several properties at once, such as status, zone and size.',
      'When a condition needs an operator other than "contains", such as "does not equal" or "greater than".',
      'Above a Table or Cards, in their filter slot.',
    ],
    avoid: [
      <>
        When the user only searches by name or ID. Use a <a href="#/components/text-filter">TextFilter</a>.
      </>,
      <>
        For two or three fixed choices, such as Running or Stopped. Use a{' '}
        <a href="#/components/segmented-control">SegmentedControl</a> or a <a href="#/components/select">Select</a> next
        to a text filter.
      </>,
      'Listing every operator on every property: give each property only the operators that make sense for its values.',
    ],
    writing: [
      'Name properties as the column headers do: "Instance type", "Zone".',
      'Write the placeholder as "Find" and the plural of what is listed: "Find instances".',
      'Write the count as a number and "match" or "matches": "1 match", "12 matches".',
      'Give values a label when they are stored as codes, so the token reads "Severity = Critical", not "sev1".',
    ],
  },
  accessibility: [
    <>
      The input is a combobox with a list of suggestions. Arrow keys move through them, Enter picks one or adds the
      typed condition, Escape closes the list and then clears the text. Name it with <code>filteringAriaLabel</code>.
    </>,
    <>
      Each token is a button that opens its editor in a dialog. Its accessible name repeats the visible text, such as
      "Status = Running", so voice control users can say what they see.
    </>,
    'Each token has a remove button named after its condition, such as "Remove filter, Status = Running". After a remove, focus moves to the next token, or to the input when none is left.',
    'The select that switches between and and or is named "Combine filters with".',
    <>
      <code>countText</code> is in a live region, so screen readers announce the new count after each change.
    </>,
    'A disabled property filter is out of the tab order, and so are its tokens and buttons.',
  ],
  related: ['text-filter', 'table', 'cards', 'token-group', 'autosuggest'],
};

export default doc;
