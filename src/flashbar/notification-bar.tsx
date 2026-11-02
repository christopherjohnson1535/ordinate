// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { FlashbarProps } from './interfaces';
import { InternalMessageDefinition } from './internal';

import styles from './styles.css.js';

// The most pressing types are counted first.
const countOrder: ReadonlyArray<FlashbarProps.CountType> = ['fault', 'caution', 'complete', 'note', 'underway'];

function countType(item: InternalMessageDefinition): FlashbarProps.CountType {
  return item.loading ? 'underway' : item.type;
}

interface NotificationBarProps {
  items: ReadonlyArray<InternalMessageDefinition>;
  expanded: boolean;
  controlsId: string;
  ariaLabel?: string;
  buttonText?: string;
  countText: (type: FlashbarProps.CountType, count: number) => string | undefined;
  onToggle: () => void;
}

/**
 * The summary row under a stack: a key square and a count for each type, like the legend of a drawing, and a
 * quiet button that shows every item or collapses them again.
 */
export function NotificationBar({
  items,
  expanded,
  controlsId,
  ariaLabel,
  buttonText,
  countText,
  onToggle,
}: NotificationBarProps) {
  const counts = countOrder
    .map(type => ({ type, count: items.filter(item => countType(item) === type).length }))
    .filter(({ count }) => count > 0);

  return (
    <div className={styles.summary} role="group" aria-label={ariaLabel}>
      <ul className={styles.counts}>
        {counts.map(({ type, count }) => (
          <li key={type} className={clsx(styles.count, styles[`count-${type}`])}>
            <span className={styles.key} aria-hidden="true" />
            {countText(type, count)}
          </li>
        ))}
      </ul>
      <InternalButton
        className={styles['notification-bar']}
        variant="link"
        formAction="none"
        iconName={expanded ? 'chevron-up' : 'chevron-down'}
        iconAlign="right"
        ariaExpanded={expanded}
        ariaControls={controlsId}
        onClick={onToggle}
      >
        {buttonText}
      </InternalButton>
    </div>
  );
}
