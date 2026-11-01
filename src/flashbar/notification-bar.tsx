// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { ExpandIcon } from '../internal/components/expand-icon';
import { typeIcons } from './flash';
import { FlashbarProps } from './interfaces';

import styles from './styles.css.js';

// The most pressing types are counted first.
const countOrder: ReadonlyArray<FlashbarProps.Type> = ['error', 'warning', 'success', 'info', 'in-progress'];

interface NotificationBarProps {
  items: ReadonlyArray<FlashbarProps.MessageDefinition>;
  expanded: boolean;
  controlsId: string;
  text?: string;
  countText: (type: FlashbarProps.Type, count: number) => string | undefined;
  onToggle: () => void;
}

/**
 * The button under a stack. Its text counts the items by type, so its accessible name says what the
 * collapsed stack holds.
 */
export function NotificationBar({ items, expanded, controlsId, text, countText, onToggle }: NotificationBarProps) {
  const counts = countOrder
    .map(type => ({ type, count: items.filter(item => (item.type ?? 'info') === type).length }))
    .filter(({ count }) => count > 0);

  return (
    <button
      type="button"
      className={styles['notification-bar']}
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
    >
      {/* The spaces between the parts are not drawn in flex layout, but keep the accessible name readable. */}
      <span>{text}</span>{' '}
      <span className={styles.counts}>
        {counts.map(({ type, count }) => (
          <React.Fragment key={type}>
            <span className={clsx(styles.count, styles[`type-${type}`])}>
              <InternalIcon name={typeIcons[type]} className={styles['count-icon']} />
              <span className={styles['count-text']}>{countText(type, count)}</span>
            </span>{' '}
          </React.Fragment>
        ))}
      </span>
      <ExpandIcon expanded={expanded} collapsedDirection="down" className={styles['notification-bar-icon']} />
    </button>
  );
}
