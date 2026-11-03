// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Cards',
  folder: 'cards',
  group: 'collections',
  summary: 'Shows a collection of items as a grid of cards that the user can filter, page and select.',
  description: (
    <>
      <p>
        Cards lays out one <a href="#/components/item-card">ItemCard</a> per item. Each card is marked out by crop marks
        in the color of the collection’s <code>kind</code>, with an optional reference such as R2 at the end of its
        header row. A selected card closes its marks into an ink frame. In the <code>container</code> variant the
        collection sits on its own sheet: a construction line opens it, and the counter of a Header passed as{' '}
        <code>header</code> moves into a dimension line under the heading.
      </p>
      <p>
        Cards holds no state. You pass the items to show, the selection and the filter, and update them in the event
        handlers. <code>useCollection</code> from <code>@ordinate/collection-hooks</code> does the filtering, paging and selection for you.
      </p>
    </>
  ),
  marks: ['M5', 'M8', 'M1', 'M3', 'M12'],
  examples: [
    {
      id: 'basic',
      title: 'A collection of resources',
      description: (
        <p>
          <code>cardDefinition</code> says how a card shows an item: a <code>header</code>, a <code>reference</code>{' '}
          and <code>sections</code>. Sections whose <code>width</code> adds up to 100 or less share a row, like cells
          of a title block.
        </p>
      ),
    },
    {
      id: 'selection',
      title: 'Selection',
      description: (
        <p>
          <code>selectionType="multi"</code> puts a checkbox on each card, <code>single</code> a radio button. With{' '}
          <code>entireCardClickable</code> a click anywhere on a card selects it, and its crop marks reach out under the
          pointer. <code>isItemDisabled</code> hatches cards that cannot be picked.
        </p>
      ),
    },
    {
      id: 'collection',
      title: 'Filtering, pages and preferences',
      description: (
        <p>
          <code>useCollection</code> filters and pages the items and returns props for the TextFilter, the Pagination
          and the cards. CollectionPreferences sets the page size and which sections show, through{' '}
          <code>visibleSections</code>.
        </p>
      ),
    },
    {
      id: 'empty-and-loading',
      title: 'Empty and loading',
      description: (
        <p>
          <code>empty</code> shows when there are no items, usually with a way to create the first one.{' '}
          <code>loading</code> shows a spinner and <code>loadingText</code> in place of the cards.
        </p>
      ),
    },
    {
      id: 'cards-per-row',
      title: 'Cards per row and the full-page variant',
      description: (
        <p>
          <code>cardsPerRow</code> sets how many cards share a row at each width of the component, not of the window.
          This example drops to one card below 500 px. It also uses the <code>full-page</code> variant, which leaves the
          header on the page background for cards that fill the main content area.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a collection where each item is read on its own, with a few properties and perhaps an image.',
      'When the user browses or picks items, such as templates, drawing sheets or nodes.',
    ],
    avoid: [
      <>
        When the user compares items property by property, or sorts by a column. Use a{' '}
        <a href="#/components/table">Table</a>.
      </>,
      <>
        For a short list of names with an action each. Use a <a href="#/components/list">List</a>.
      </>,
      <>
        For a handful of cards you place yourself. Use <a href="#/components/item-card">ItemCard</a> directly.
      </>,
      'Links or buttons inside cards together with entireCardClickable: a click meant for them could select the card.',
    ],
    writing: [
      'Name the collection in the header with a plural noun, and put the count in the Header counter: "Nodes" and "(12)".',
      'Keep section headers to one or two words, in sentence case.',
      'In the empty state, say what is missing and how to add it: "No nodes yet" and "Add a node".',
    ],
  },
  accessibility: [
    <>
      The cards are a list (<code>ul</code>), named by the header or by <code>ariaLabels.cardsLabel</code>. With
      selection on and no <code>cardsLabel</code>, <code>ariaLabels.selectionGroupLabel</code> names it.
    </>,
    <>
      Each selection control is named by the card header, or by <code>ariaLabels.itemSelectionLabel</code> when the
      header is not enough.
    </>,
    'Keyboard users select with the checkbox or radio button, by Tab and Space. entireCardClickable only adds a pointer target.',
    'In the container variant the dimension line is drawing only. The heading keeps the count for screen readers.',
    'The loading state is a status indicator with text, so it is read out.',
  ],
  related: ['item-card', 'table', 'pagination', 'text-filter', 'property-filter', 'collection-preferences'],
};

export default doc;
