// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { InternalIcon } from '../icon/internal';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalLiveRegion } from '../live-region/internal';
import { InternalToggle } from '../toggle/internal';
import { CollectionPreferencesProps } from './interfaces';
import { moveItem } from './utils';

import styles from './styles.css.js';

type Direction = 'up' | 'down';

interface ContentDisplayProps {
  preference: CollectionPreferencesProps.ContentDisplayPreference;
  value: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
  onChange: (value: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>) => void;
}

/**
 * Finds the position a dragged row should take: before the first row whose middle is below the pointer.
 */
function getDropIndex(rows: ReadonlyArray<Element>, clientY: number, currentIndex: number): number {
  for (let index = 0; index < rows.length; index++) {
    const rect = rows[index].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      return index > currentIndex ? index - 1 : index;
    }
  }
  return rows.length - 1;
}

export function ContentDisplay({ preference, value, onChange }: ContentDisplayProps) {
  const { title, description, options, i18nStrings } = preference;
  const i18n = useInternalI18n('collection-preferences');
  const baseId = useId();
  const titleId = `${baseId}title`;
  const descriptionId = `${baseId}description`;
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef(new Map<string, ButtonProps.Ref | null>());
  const pendingFocus = useRef<{ id: string; direction: Direction } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [drag, setDrag] = useState<{ id: string; startIndex: number } | null>(null);

  const optionIndex = new Map(options.map((option, index) => [option.id, index]));
  const total = value.length;

  const announceMove = (id: string, index: number) => {
    const label = options[optionIndex.get(id)!].label;
    const position = index + 1;
    setAnnouncement(
      i18nStrings?.itemMovedAnnouncement?.(label, position, total) ??
        i18n('itemMovedAnnouncement', undefined, { label, position, total }) ??
        ''
    );
  };

  // Moving a row moves its buttons in the document, which can take focus away from the pressed button.
  // At either end the pressed button turns disabled, so focus goes to the other one.
  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) {
      return;
    }
    pendingFocus.current = null;
    const index = value.findIndex(item => item.id === target.id);
    const atEnd = target.direction === 'up' ? index === 0 : index === value.length - 1;
    const direction = atEnd ? (target.direction === 'up' ? 'down' : 'up') : target.direction;
    buttonRefs.current.get(`${target.id}:${direction}`)?.focus();
  }, [value]);

  useEffect(() => {
    if (!drag) {
      return;
    }
    const onPointerMove = (event: PointerEvent) => {
      const currentIndex = value.findIndex(item => item.id === drag.id);
      const rows = Array.from(listRef.current?.children ?? []);
      const dropIndex = getDropIndex(rows, event.clientY, currentIndex);
      if (dropIndex !== currentIndex) {
        onChange(moveItem(value, currentIndex, dropIndex));
      }
    };
    const onPointerUp = () => {
      setDrag(null);
      const index = value.findIndex(item => item.id === drag.id);
      if (index !== drag.startIndex) {
        announceMove(drag.id, index);
      }
    };
    // The row moves in the document while it is dragged, which would end pointer capture on the handle.
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  });

  const move = (index: number, direction: Direction) => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= total) {
      return;
    }
    pendingFocus.current = { id: value[index].id, direction };
    onChange(moveItem(value, index, target));
    announceMove(value[index].id, target);
  };

  const toggle = (id: string, visible: boolean) =>
    onChange(value.map(item => (item.id === id ? { ...item, visible } : item)));

  return (
    <div className={styles['content-display']}>
      <h3 id={titleId} className={styles['content-display-title']}>
        {i18n('contentDisplayTitle', title)}
      </h3>
      <p id={descriptionId} className={styles['content-display-description']}>
        {i18n('contentDisplayDescription', description)}
      </p>
      <ul
        ref={listRef}
        className={styles['content-display-list']}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {value.map((item, index) => {
          const option = options[optionIndex.get(item.id)!];
          const labelId = `${baseId}label-${optionIndex.get(item.id)}`;
          return (
            <li
              key={item.id}
              className={clsx(styles['content-display-option'], drag?.id === item.id && styles.dragging)}
            >
              <span
                className={styles['drag-handle']}
                aria-hidden="true"
                onPointerDown={event => {
                  if (event.button === 0) {
                    event.preventDefault();
                    setDrag({ id: item.id, startIndex: index });
                  }
                }}
              >
                <InternalIcon name="drag-indicator" />
              </span>
              <span id={labelId} className={styles['option-label']}>
                {option.label}
              </span>
              <span className={styles['option-actions']}>
                <InternalButton
                  ref={button => {
                    buttonRefs.current.set(`${item.id}:up`, button);
                  }}
                  className={styles['move-up-button']}
                  variant="icon"
                  iconName="arrow-up"
                  formAction="none"
                  disabled={index === 0}
                  ariaLabel={
                    i18nStrings?.moveUpAriaLabel?.(option.label) ??
                    i18n('moveUpAriaLabel', undefined, { label: option.label })
                  }
                  onClick={() => move(index, 'up')}
                />
                <InternalButton
                  ref={button => {
                    buttonRefs.current.set(`${item.id}:down`, button);
                  }}
                  className={styles['move-down-button']}
                  variant="icon"
                  iconName="arrow-down"
                  formAction="none"
                  disabled={index === total - 1}
                  ariaLabel={
                    i18nStrings?.moveDownAriaLabel?.(option.label) ??
                    i18n('moveDownAriaLabel', undefined, { label: option.label })
                  }
                  onClick={() => move(index, 'down')}
                />
                <InternalToggle
                  checked={item.visible}
                  disabled={option.alwaysVisible}
                  ariaLabelledby={labelId}
                  onChange={event => toggle(item.id, event.detail.checked)}
                />
              </span>
            </li>
          );
        })}
      </ul>
      <InternalLiveRegion hidden={true}>{announcement}</InternalLiveRegion>
    </div>
  );
}
