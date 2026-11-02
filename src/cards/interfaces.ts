// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface CardsProps<T = unknown> extends BaseComponentProps {
  /**
   * The items to show, one card each.
   */
  items: ReadonlyArray<T>;
  /**
   * How a card shows an item:
   * * `header(item)` (optional): the title of the card, often a link to the item.
   * * `reference(item)` (optional): a short reference at the end of the header row, such as R1, in the
   *   color of `kind`.
   * * `sections` (optional): the blocks of the card body, each with:
   *   * `id` (optional): identifies the section for `visibleSections`. Sections without an ID are always shown.
   *   * `header` (optional): a short label above the section.
   *   * `content(item)` (optional): the section's value for the item.
   *   * `width` (optional): the share of the card's width the section takes, from 1 to 100 percent.
   *     Sections that add up to 100 or less share a row. Defaults to 100.
   */
  cardDefinition: CardsProps.CardDefinition<T>;
  /**
   * The number of cards in a row for each width of the component. Each entry applies from its
   * `minWidth` in pixels up to the next one, for example
   * `[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 900, cards: 3 }]`.
   * By default there is one card per row on narrow screens, rising to six on very wide ones.
   */
  cardsPerRow?: ReadonlyArray<CardsProps.CardsLayout>;
  /**
   * Identifies items across renders, as the name of a property or a function that returns a key.
   * Set it when items are recreated between renders, for example after fetching, so selection
   * still matches them. Without it, items are compared by reference.
   */
  trackBy?: CardsProps.TrackBy<T>;
  /**
   * Adds a control to each card for selecting it: `single` uses radio buttons, `multi` checkboxes.
   */
  selectionType?: CardsProps.SelectionType;
  /**
   * The selected items. Selection is controlled: update this in `onSelectionChange`.
   */
  selectedItems?: ReadonlyArray<T>;
  /**
   * Called when the user changes the selection, with the new selection in `event.detail.selectedItems`.
   */
  onSelectionChange?: NonCancelableEventHandler<CardsProps.SelectionChangeDetail<T>>;
  /**
   * Returns whether an item cannot be selected. Its card is dimmed and its control disabled.
   */
  isItemDisabled?: (item: T) => boolean;
  /**
   * Shows a loading state in place of the cards, for example while the items are fetched.
   */
  loading?: boolean;
  /**
   * Text shown with the loading spinner, such as "Loading instances".
   */
  loadingText?: string;
  /**
   * Shown in place of the cards when there are no items and nothing is loading.
   * Usually a short message and a button to create the first item.
   */
  empty?: React.ReactNode;
  /**
   * The heading of the collection. Use the Header component, with a counter and actions as needed.
   * It also names the list of cards for assistive technology, unless `ariaLabels.cardsLabel` is set.
   */
  header?: React.ReactNode;
  /**
   * A control that filters the items, shown below the header at the start of the tools row.
   */
  filter?: React.ReactNode;
  /**
   * Pagination for the items, shown at the end of the tools row.
   */
  pagination?: React.ReactNode;
  /**
   * A collection preferences control, shown at the very end of the tools row.
   */
  preferences?: React.ReactNode;
  /**
   * The IDs of the sections to show, usually from collection preferences. When not set, every
   * section is shown. Sections keep the order of `cardDefinition.sections`.
   */
  visibleSections?: ReadonlyArray<string>;
  /**
   * Accessible names:
   * * `itemSelectionLabel(data, item)`: names the selection control of a card, with the current
   *   selection in `data.selectedItems`. Without it, the control is named by the card header.
   * * `selectionGroupLabel`: names the list of cards when selection is on and no `cardsLabel` is set.
   * * `cardsLabel`: names the list of cards.
   */
  ariaLabels?: CardsProps.AriaLabels<T>;
  /**
   * - `container` puts the header, tools and cards on one sheet.
   * - `full-page` leaves the header and tools on the page background, for cards that fill the main
   *   content area.
   */
  variant?: CardsProps.Variant;
  /**
   * Lets a click anywhere on a card select it, not only on its control. Use it only when cards contain
   * no other controls or links. Keyboard users still select with the control.
   */
  entireCardClickable?: boolean;
  /**
   * What the items are, told by the color of each card's corner marks and reference: `configuration`,
   * `resource`, `policy` or `neutral`. Neutral graphite when left out.
   */
  kind?: CardsProps.Kind;
}

export namespace CardsProps {
  export type Variant = 'container' | 'full-page';

  export type Kind = 'configuration' | 'resource' | 'policy' | 'neutral';

  export type SelectionType = 'single' | 'multi';

  export type TrackBy<T> = string | ((item: T) => string);

  export interface CardDefinition<T> {
    header?: (item: T) => React.ReactNode;
    reference?: (item: T) => React.ReactNode;
    sections?: ReadonlyArray<SectionDefinition<T>>;
  }

  export interface SectionDefinition<T> {
    id?: string;
    header?: React.ReactNode;
    content?: (item: T) => React.ReactNode;
    width?: number;
  }

  export interface CardsLayout {
    cards: number;
    minWidth?: number;
  }

  export interface SelectionState<T> {
    selectedItems: ReadonlyArray<T>;
  }

  export interface SelectionChangeDetail<T> {
    selectedItems: T[];
  }

  export interface AriaLabels<T> {
    itemSelectionLabel?: (data: SelectionState<T>, item: T) => string;
    selectionGroupLabel?: string;
    cardsLabel?: string;
  }
}
