// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface MenuTileProps extends BaseComponentProps {
  /**
   * The name of the group of items, such as "Tune-ups" or "Breakfast".
   */
  title: React.ReactNode;
  /**
   * The items and their prices, each on its own line with dots leading from the name to the price.
   * Add a `description` to say what is included.
   */
  items?: ReadonlyArray<MenuTileProps.Item>;
  /**
   * A sentence under the title about the group as a whole.
   */
  description?: React.ReactNode;
  /**
   * A short note in a pill next to the title, such as "Most booked" or "New". Keep it to a word or
   * two.
   */
  badge?: React.ReactNode;
  /**
   * * `default` is a plain card.
   * * `accent` sits on the style's accent color, to set one group a little apart.
   * * `emphasis` fills the card with the style's emphasis color, for the one group you want everyone
   *   to see.
   */
  tone?: MenuTileProps.Tone;
  /**
   * Content at the bottom of the card, such as a "Book now" button or a note about opening hours.
   */
  footer?: React.ReactNode;
  /**
   * The heading level of the title, from 1 to 6. Pick the level that fits the page outline: tiles
   * under an `h2` section heading use 3.
   */
  headingLevel?: MenuTileProps.HeadingLevel;
}

export namespace MenuTileProps {
  export type Tone = 'default' | 'accent' | 'emphasis';
  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

  export interface Item {
    /**
     * What is on offer, such as "Flat tire repair".
     */
    label: React.ReactNode;
    /**
     * The price or amount, such as "$18" or "from $40".
     */
    value: React.ReactNode;
    /**
     * A short note under the item, such as what is included.
     */
    description?: React.ReactNode;
  }
}
