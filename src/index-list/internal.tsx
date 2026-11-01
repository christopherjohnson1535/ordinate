// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { LeaderRow } from '../internal/components/leader-row';
import { StretchedLink } from '../internal/components/stretched-link';
import { fireCancelableEvent } from '../internal/events';
import { IndexListProps } from './interfaces';

import styles from './styles.css.js';

interface RowNumber {
  text: string;
  // A number made up from the position repeats what an ordered list already announces.
  automatic: boolean;
}

function rowNumber(
  item: IndexListProps.Item,
  index: number,
  ordered: boolean,
  variant: IndexListProps.Variant
): RowNumber | undefined {
  if (item.number !== undefined) {
    return { text: item.number, automatic: false };
  }
  if (!ordered) {
    return undefined;
  }
  const position = String(index + 1);
  return { text: variant === 'numbered' ? position.padStart(2, '0') : position, automatic: true };
}

function NumberCell({ number }: { number: RowNumber | undefined }) {
  return (
    <span className={styles.number} aria-hidden={number?.automatic || undefined}>
      {number?.text}
    </span>
  );
}

export function InternalIndexList({
  items,
  variant = 'leaders',
  size = 'default',
  ordered = false,
  ariaLabel,
  onFollow,
  ...rest
}: IndexListProps) {
  const List = ordered ? 'ol' : 'ul';
  const numbers = items.map((item, index) => rowNumber(item, index, ordered, variant));
  const hasNumbers = numbers.some(number => number !== undefined);

  const renderLabel = (item: IndexListProps.Item) =>
    item.href ? (
      <StretchedLink
        href={item.href}
        onFollow={event => fireCancelableEvent(onFollow, { id: item.id, href: item.href! }, event)}
      >
        {item.label}
      </StretchedLink>
    ) : (
      item.label
    );

  return (
    <div
      {...rest}
      className={clsx(
        styles.root,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        hasNumbers && styles['has-numbers']
      )}
    >
      <List className={styles.list} aria-label={ariaLabel}>
        {items.map((item, index) => (
          <li key={item.id} className={styles.item}>
            {hasNumbers && <NumberCell number={numbers[index]} />}
            {variant === 'leaders' ? (
              <span className={styles.body}>
                <LeaderRow
                  label={renderLabel(item)}
                  value={item.value}
                  labelClassName={styles.label}
                  valueClassName={styles.value}
                />
                {item.meta && <span className={styles.meta}>{item.meta}</span>}
              </span>
            ) : (
              <>
                <span className={styles.label}>{renderLabel(item)}</span>
                {(item.meta || item.value) && (
                  <span className={styles.details}>
                    {item.meta && <span className={styles.meta}>{item.meta}</span>}
                    {item.meta && item.value && ' '}
                    {item.value && <span className={styles.value}>{item.value}</span>}
                  </span>
                )}
              </>
            )}
          </li>
        ))}
      </List>
    </div>
  );
}
