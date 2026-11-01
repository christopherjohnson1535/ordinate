// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useContainerWidth } from '../internal/hooks/use-container-width';

import styles from './styles.css.js';

// Drawing sheets leave out I and O, which read as the figures 1 and 0.
const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const cellWidth = 160;
const minCells = 2;
// Used until the sheet is measured, and on the server.
const defaultCells = 6;

export function getGridReferenceLetters(width: number | null): string[] {
  const count =
    width === null ? defaultCells : Math.min(letters.length, Math.max(minCells, Math.round(width / cellWidth)));
  return letters.slice(0, count).split('');
}

/**
 * The lettered divisions along the top edge of a drawing sheet, so a place on it can be named
 * ("see C"). Decorative: the letters say nothing a screen reader needs.
 */
export function GridReference() {
  const ref = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(ref);
  return (
    <div ref={ref} className={styles['grid-reference']} aria-hidden="true">
      {getGridReferenceLetters(width).map(letter => (
        <span key={letter} className={styles['grid-reference-cell']}>
          {letter}
        </span>
      ))}
    </div>
  );
}
