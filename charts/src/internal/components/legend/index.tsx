// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { getLogicalArrowStep } from '../../direction';
import { SeriesStyle } from '../../series-style';
import { Swatch, SwatchKind } from '../marks';

import styles from './styles.css.js';

export interface LegendItem {
  id: string;
  title: string;
  kind: SwatchKind;
  style: SeriesStyle;
}

export interface LegendProps {
  items: ReadonlyArray<LegendItem>;
  title?: string;
  ariaLabel: string;
  highlightedId: string | null;
  /** Called with the item to emphasize, or `null` to clear the emphasis. */
  onHighlight: (id: string | null) => void;
}

/**
 * The key below a chart. Each item is drawn like its series. Pointing at or focusing an item
 * emphasizes its series; clicking keeps the emphasis after the pointer leaves, for touch
 * screens. The items form one tab stop and the arrow keys move between them.
 */
export function Legend({ items, title, ariaLabel, highlightedId, onHighlight }: LegendProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const titleId = React.useId();
  const tabIndex = Math.min(activeIndex, items.length - 1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step =
      getLogicalArrowStep(event.key, event.currentTarget) ||
      (event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0);
    let next: number | null = null;
    if (step !== 0) {
      next = (tabIndex + step + items.length) % items.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = items.length - 1;
    } else if (event.key === 'Escape' && highlightedId !== null) {
      event.stopPropagation();
      setPinnedId(null);
      onHighlight(null);
      return;
    }
    if (next !== null) {
      event.preventDefault();
      setActiveIndex(next);
      itemRefs.current[next]?.focus();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      {title && (
        <div id={titleId} className={styles.title}>
          {title}
        </div>
      )}
      <div
        role="toolbar"
        aria-label={title ? undefined : ariaLabel}
        aria-labelledby={title ? titleId : undefined}
        className={styles.items}
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => {
          const highlighted = highlightedId === item.id;
          return (
            <button
              key={item.id}
              ref={element => {
                itemRefs.current[index] = element;
              }}
              type="button"
              tabIndex={index === tabIndex ? 0 : -1}
              aria-pressed={highlighted}
              className={clsx(
                styles.item,
                highlighted && styles['item-highlighted'],
                highlightedId !== null && !highlighted && styles['item-dimmed']
              )}
              onMouseEnter={() => onHighlight(item.id)}
              onMouseLeave={() => onHighlight(pinnedId)}
              onFocus={() => {
                setActiveIndex(index);
                onHighlight(item.id);
              }}
              onBlur={() => onHighlight(pinnedId)}
              onClick={() => {
                const next = pinnedId === item.id ? null : item.id;
                setPinnedId(next);
                onHighlight(next);
              }}
            >
              <Swatch kind={item.kind} seriesStyle={item.style} />
              <span className={styles.label}>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
