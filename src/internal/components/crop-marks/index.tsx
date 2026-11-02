// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ConstructionKind } from '../construction';

import styles from './styles.css.js';

export interface CropMarksProps {
  /**
   * The color of the marks. Neutral graphite when left out.
   */
  kind?: ConstructionKind;
  /**
   * Closes the marks into a frame in ink, for a chosen card or tile.
   */
  selected?: boolean;
  /**
   * Lets the marks reach further while the pointer is over the parent, for a card that responds to a click.
   */
  interactive?: boolean;
  /**
   * With `selected`, draws only the heavier ink corners and leaves the sides open, for a mark that moves
   * between items in a row, such as the open tab.
   */
  open?: boolean;
}

/**
 * Marks at the four corners of the nearest positioned ancestor, standing where a border's corners would be.
 * A card drawn this way needs no box. Drawing only, hidden from screen readers. Render it as a direct child of
 * the card, so the card's hover can reach it.
 */
export function CropMarks({ kind = 'neutral', selected = false, interactive = false, open = false }: CropMarksProps) {
  return (
    <span
      className={clsx(
        styles.root,
        styles[`kind-${kind}`],
        selected && styles.selected,
        interactive && styles.interactive,
        open && styles.open
      )}
      aria-hidden="true"
    >
      <span className={clsx(styles.corner, styles['start-start'])} />
      <span className={clsx(styles.corner, styles['start-end'])} />
      <span className={clsx(styles.corner, styles['end-start'])} />
      <span className={clsx(styles.corner, styles['end-end'])} />
      <span className={styles.frame} />
    </span>
  );
}
