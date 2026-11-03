// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'MenuTile',
  folder: 'menu-tile',
  group: 'website-content',
  summary: 'Lists a group of things on offer with their prices, such as a café menu or a repair price list.',
  description: (
    <>
      <p>
        A menu tile is one card of a price list: a title, an optional sentence about the group, and the items, each with
        a dotted leader running from its name to its price. An item can carry a short note under it, and the tile can
        end in a footer with a button or a note about opening hours.
      </p>
      <p>
        <code>tone</code> sets one tile apart: <code>accent</code> lays it on the style's accent tint and{' '}
        <code>emphasis</code> fills it with the emphasis color, with every part switching to the matching text color.
        Both colors come from the page style. In <code>shopfront</code> accent is sunflower and emphasis is cobalt, with
        rounded corners; in the console style emphasis is ink.
      </p>
    </>
  ),
  examples: [
    {
      id: 'price-list',
      title: 'A price list',
      description: (
        <p>
          Three groups of repairs for a bicycle workshop, in the <code>shopfront</code> style. The most booked group
          uses <code>emphasis</code> and a badge, and ends in a booking button.
        </p>
      ),
    },
    {
      id: 'cafe-menu',
      title: 'A café menu',
      description: (
        <p>
          Item descriptions say what comes with a dish. Leave out the currency sign when every price on the page is in
          the same currency, as printed menus do.
        </p>
      ),
    },
    {
      id: 'tones',
      title: 'Tones in each style',
      description: (
        <p>
          <code>default</code>, <code>accent</code> and <code>emphasis</code> side by side. Switch the page style to see
          how each one draws them.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For prices on a website: a café or restaurant menu, a repair or treatment list, class fees.',
      'With two to four tiles in a row, each holding one group.',
      <>
        With <code>emphasis</code> on at most one tile, for the group most people come for.
      </>,
    ],
    avoid: [
      <>
        For one long list with no groups. Use an <a href="#/components/index-list">IndexList</a>.
      </>,
      <>
        For plans that people compare feature by feature. Use a <a href="#/components/table">Table</a>.
      </>,
      'More than one badge in a row of tiles. A badge stands out only when it is rare.',
    ],
    writing: [
      'Name the group in a word or two: "Breakfast", "Quick fixes", "Wheels".',
      'Write prices the way the shop says them: "£12", "from £30", "Ask us".',
      'Keep item descriptions to what is included, in a few words.',
      'Keep the badge to a word or two: "New", "Most booked".',
    ],
  },
  accessibility: [
    <>
      The title is a heading, level 3 by default. Set <code>headingLevel</code> to fit the page outline.
    </>,
    'The items are a list. The dotted leaders are drawing only and hidden from screen readers, and a space keeps each name apart from its price when the row is read as one line.',
    'The badge is plain text next to the title, so it is read with it.',
    'On the emphasis tone the text, the item notes and the badge outline all switch to the on-emphasis color, which keeps their contrast in each style and mode.',
  ],
  related: ['index-list', 'opening-hours', 'section', 'call-to-action'],
};

export default doc;
