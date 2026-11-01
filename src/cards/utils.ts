// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '../internal/logging';
import { CardsProps } from './interfaces';

export const defaultCardsPerRow: ReadonlyArray<CardsProps.CardsLayout> = [
  { cards: 1 },
  { minWidth: 768, cards: 2 },
  { minWidth: 992, cards: 3 },
  { minWidth: 1200, cards: 4 },
  { minWidth: 1400, cards: 5 },
  { minWidth: 1920, cards: 6 },
];

/**
 * The number of cards per row at `width`: the layout with the largest `minWidth` that fits.
 */
export function getCardsPerRow(layouts: ReadonlyArray<CardsProps.CardsLayout>, width: number): number {
  let match: CardsProps.CardsLayout | undefined;
  for (const layout of layouts) {
    const minWidth = layout.minWidth ?? 0;
    if (minWidth <= width && (!match || minWidth >= (match.minWidth ?? 0))) {
      match = layout;
    }
  }
  const cards = match?.cards ?? 1;
  if (!Number.isInteger(cards) || cards < 1) {
    warnOnce('Cards', '`cardsPerRow` needs a whole number of at least 1 in `cards`.');
    return Math.max(Math.round(cards) || 1, 1);
  }
  return cards;
}

export function getTrackKey<T>(trackBy: CardsProps.TrackBy<T> | undefined, item: T): unknown {
  if (trackBy === undefined) {
    return item;
  }
  if (typeof trackBy === 'function') {
    return trackBy(item);
  }
  return (item as Record<string, unknown>)[trackBy];
}

export function getVisibleSections<T>(
  sections: ReadonlyArray<CardsProps.SectionDefinition<T>>,
  visibleSections: ReadonlyArray<string> | undefined
): ReadonlyArray<CardsProps.SectionDefinition<T>> {
  if (!visibleSections) {
    return sections;
  }
  return sections.filter(section => section.id === undefined || visibleSections.includes(section.id));
}

export function getSectionWidth(width: number | undefined): number {
  if (width === undefined) {
    return 100;
  }
  return Math.min(Math.max(width, 1), 100);
}
