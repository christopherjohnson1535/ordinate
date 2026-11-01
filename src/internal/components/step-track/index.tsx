// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export interface StepTrackItem {
  key: string;
  /**
   * The mark at the start of the step, placed in the marker column. Leave it out when `head`
   * starts with its own mark one marker column wide, followed by a `space-xs` gap, as a status
   * indicator lays out its icon.
   */
  marker?: React.ReactNode;
  /**
   * The first line of the step, usually its title.
   */
  head: React.ReactNode;
  /**
   * Content below the head, lined up with it past the marker column.
   */
  details?: React.ReactNode;
  /**
   * Draws the line leading into this step dashed, like a hidden line on a drawing, to show a
   * part of the path not taken yet.
   */
  upcoming?: boolean;
  /**
   * Attributes for the list item, such as `aria-current`.
   */
  itemProps?: React.LiHTMLAttributes<HTMLLIElement>;
}

export interface StepTrackProps {
  items: ReadonlyArray<StepTrackItem>;
  orientation?: 'vertical' | 'horizontal';
  /**
   * The size of the marker column: `icon` fits a status icon, `balloon` a numbered balloon.
   */
  markerSize?: 'icon' | 'balloon';
  ariaLabel?: string;
  ariaLabelledby?: string;
  className?: string;
}

/**
 * An ordered list of steps joined by a thin drafting line between their markers. Steps and the
 * wizard's navigation both draw their progress with it.
 */
export function StepTrack({
  items,
  orientation = 'vertical',
  markerSize = 'icon',
  ariaLabel,
  ariaLabelledby,
  className,
}: StepTrackProps) {
  return (
    <ol
      className={clsx(styles.root, styles[`orientation-${orientation}`], styles[`marker-${markerSize}`], className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {items.map((item, index) => {
        const next = items[index + 1];
        return (
          <li key={item.key} {...item.itemProps} className={clsx(styles.item, item.itemProps?.className)}>
            {item.marker !== undefined && <span className={styles.marker}>{item.marker}</span>}
            <div className={clsx(styles.head, item.marker === undefined && styles['head-with-marker'])}>
              {item.head}
            </div>
            {next && (
              <span
                className={clsx(styles.connector, next.upcoming && styles['connector-upcoming'])}
                aria-hidden="true"
              />
            )}
            {item.details !== undefined && item.details !== null && (
              <div className={styles.details}>{item.details}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
