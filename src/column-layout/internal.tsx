// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { childKey, flattenChildren } from '../internal/flatten-children';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';
import { getColumnCount } from './column-count';
import { ColumnLayoutProps } from './interfaces';

import styles from './styles.css.js';

interface Measurement {
  /**
   * `null` until measured, and while the layout has no width (hidden, or rendered without layout).
   */
  width: number | null;
  gap: number;
}

function useMeasurement(ref: React.RefObject<HTMLElement | null>): Measurement {
  const [measurement, setMeasurement] = useState<Measurement>({ width: null, gap: 0 });
  useResizeObserver(ref, () => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const width = element.clientWidth > 0 ? element.clientWidth : null;
    const gap = parseFloat(window.getComputedStyle(element).columnGap) || 0;
    setMeasurement(current => (current.width === width && current.gap === gap ? current : { width, gap }));
  });
  return measurement;
}

function ruleClasses(variant: ColumnLayoutProps.Variant, borders: ColumnLayoutProps.Borders) {
  if (variant === 'text-grid') {
    return styles['vertical-rules'];
  }
  return clsx(
    (borders === 'vertical' || borders === 'all') && styles['vertical-rules'],
    (borders === 'horizontal' || borders === 'all') && styles['horizontal-rules']
  );
}

// Where a cell sits decides which of its rules are drawn and how far they reach.
function cellPosition(index: number, total: number, count: number) {
  const column = index % count;
  const lastRowStart = Math.floor((total - 1) / count) * count;
  return clsx(
    column === 0 && styles['first-in-row'],
    (column === count - 1 || index === total - 1) && styles['last-in-row'],
    index < count && styles['first-row'],
    index >= lastRowStart && styles['last-row']
  );
}

export function InternalColumnLayout({
  columns = 1,
  variant = 'default',
  borders = 'none',
  minColumnWidth,
  disableGutters = false,
  children,
  ...rest
}: ColumnLayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { width, gap } = useMeasurement(rootRef);
  const count = getColumnCount({ columns, width, minColumnWidth, gap });
  const items = flattenChildren(children);

  return (
    <div
      {...rest}
      ref={rootRef}
      className={clsx(
        styles.root,
        styles[`variant-${variant}`],
        ruleClasses(variant, borders),
        !disableGutters && styles.gutters
      )}
      style={{ '--column-count': count } as React.CSSProperties}
      data-column-count={count}
    >
      {items.map((child, index) => (
        <div key={childKey(child, index)} className={clsx(styles.item, cellPosition(index, items.length, count))}>
          {child}
        </div>
      ))}
    </div>
  );
}
