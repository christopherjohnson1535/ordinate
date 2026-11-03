// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TextFilter',
  folder: 'text-filter',
  group: 'collections',
  summary: 'Narrows a collection to the items that contain the text the user types.',
  description: (
    <>
      <p>
        A text filter is a search field on an ink baseline, with a clear button once it holds text. While it has text, a
        result count such as "12 matches" is lettered in small mono capitals at the end of the field, as a measure.
      </p>
      <p>
        The filter is controlled and does no filtering itself: keep the text in state, update it in{' '}
        <code>onChange</code> and filter the items yourself, or pass it <code>filterProps</code> from{' '}
        <code>useCollection</code>. <code>onDelayedChange</code> fires once typing pauses for 200 ms, for work such as a
        request to a server.
      </p>
    </>
  ),
  marks: ['M3'],
  examples: [
    {
      id: 'basic',
      title: 'Filtering a list',
      description: (
        <p>
          Filter the items on every change and show how many match in <code>countText</code>. The count is announced to
          screen readers as it changes.
        </p>
      ),
    },
    {
      id: 'collection',
      title: 'With a table and useCollection',
      description: (
        <p>
          Spread <code>filterProps</code> from <code>useCollection</code> onto the filter and put it in the table’s{' '}
          <code>filter</code> slot. The hook returns <code>filteredItemsCount</code> for the count and a no-match message
          for the table.
        </p>
      ),
    },
    {
      id: 'delayed',
      title: 'Filtering on a server',
      description: (
        <p>
          Keep <code>onChange</code> for the field and send requests from <code>onDelayedChange</code>, which waits
          until typing pauses.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For finding items in a collection by name, ID or other text, when the user knows what they are looking for.',
      'Above a Table or Cards, in their filter slot.',
    ],
    avoid: [
      <>
        When the user narrows by named properties, such as status or zone. Use a{' '}
        <a href="#/components/property-filter">PropertyFilter</a>.
      </>,
      <>
        For a search across the whole product. Use an <a href="#/components/input">Input</a> with{' '}
        <code>type="search"</code> in the top navigation.
      </>,
    ],
    writing: [
      'Write the placeholder as "Find" and the plural of what is listed: "Find instances".',
      'Say what the filter searches in filteringAriaLabel when it is more than the name: "Find instances by name or ID".',
      'Write the count as a number and "match" or "matches": "1 match", "12 matches".',
    ],
  },
  accessibility: [
    <>
      The input is a search field (<code>type="search"</code>) named by <code>filteringAriaLabel</code>, or "Filter"
      when it is not set.
    </>,
    <>
      The clear button is named by <code>filteringClearAriaLabel</code>, or "Clear filter", and returns focus to the
      input.
    </>,
    <>
      <code>countText</code> is in a live region, so screen readers announce the new count as the user types.
    </>,
    'Browser autocomplete and autocorrect are turned off, so they do not cover the field or change what is typed.',
    'A disabled filter is out of the tab order.',
  ],
  related: ['property-filter', 'table', 'cards', 'input'],
};

export default doc;
