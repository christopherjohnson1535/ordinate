// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef } from 'react';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { ListProps } from './interfaces';

import styles from './styles.css.js';

type Direction = -1 | 1;

interface PendingFocus {
  id: string;
  direction: Direction;
}

function move<T>(items: ReadonlyArray<T>, from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function InternalList<T>({
  items,
  renderItem,
  tagOverride,
  ariaLabel,
  sortable = false,
  onSortingChange,
  i18nStrings,
  ...rest
}: ListProps<T>) {
  const i18n = useInternalI18n('list');
  const baseId = useId();
  const Tag = tagOverride ?? (sortable ? 'ol' : 'ul');
  const rows = items.map(renderItem);

  const buttonRefs = useRef(new Map<string, ButtonProps.Ref | null>());
  const pendingFocus = useRef<PendingFocus | null>(null);

  // Moving a row moves its element, which drops focus in most browsers. Put it back on the moved row,
  // on the other button once the row reaches an end and its own button is disabled.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) {
      return;
    }
    pendingFocus.current = null;
    const index = rows.findIndex(row => row.id === pending.id);
    const atEnd = pending.direction === -1 ? index === 0 : index === rows.length - 1;
    const direction = atEnd ? -pending.direction : pending.direction;
    buttonRefs.current.get(`${pending.id}:${direction}`)?.focus();
  });

  const moveRow = (index: number, direction: Direction) => {
    pendingFocus.current = { id: rows[index].id, direction };
    fireNonCancelableEvent(onSortingChange, { items: move(items, index, index + direction) });
  };

  const renderSortButton = (id: string, index: number, direction: Direction) => (
    <InternalButton
      ref={button => {
        buttonRefs.current.set(`${id}:${direction}`, button);
      }}
      variant="icon"
      iconName={direction === -1 ? 'arrow-up' : 'arrow-down'}
      formAction="none"
      ariaLabel={
        direction === -1
          ? i18n('moveUpAriaLabel', i18nStrings?.moveUpAriaLabel)
          : i18n('moveDownAriaLabel', i18nStrings?.moveDownAriaLabel)
      }
      disabled={direction === -1 ? index === 0 : index === rows.length - 1}
      onClick={() => moveRow(index, direction)}
    />
  );

  return (
    <Tag {...rest} className={styles.root} aria-label={ariaLabel}>
      {rows.map((row, index) => {
        const contentId = `${baseId}${index}`;
        return (
          <li key={row.id} className={styles.item}>
            <div className={styles.main}>
              {row.icon && <span className={styles.icon}>{row.icon}</span>}
              <div className={styles.text}>
                <div id={contentId} className={styles.content}>
                  {row.content}
                </div>
                {row.secondaryContent && <div className={styles['secondary-content']}>{row.secondaryContent}</div>}
              </div>
            </div>
            {row.actions && <div className={styles.actions}>{row.actions}</div>}
            {sortable && (
              <div className={styles['sort-controls']} role="group" aria-labelledby={contentId}>
                {renderSortButton(row.id, index, -1)}
                {renderSortButton(row.id, index, 1)}
              </div>
            )}
          </li>
        );
      })}
    </Tag>
  );
}
