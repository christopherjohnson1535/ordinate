// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useState } from 'react';
import clsx from 'clsx';

import { useBrowserLayoutEffect } from '../../hooks/use-browser-layout-effect';
import { useResizeObserver } from '../../hooks/use-resize-observer';
import { CropMarks } from '../crop-marks';

import styles from './styles.css.js';

export interface MarkerPosition {
  /** Distance from the row's inline start, so it holds in either reading direction. */
  start: number;
  size: number;
}

/**
 * Measures where the marker for the chosen item of a row should stand. `getParts` returns the elements the
 * marker should take in, such as a tab and its close button, or nothing when no item is chosen. The row must be
 * the offset parent of the parts. The marker only slides once it has a place to slide from, so it does not fly
 * in on the first render.
 */
export function useSlidingMarker(rowRef: RefObject<HTMLElement | null>, getParts: () => HTMLElement[]) {
  const [position, setPosition] = useState<MarkerPosition | null>(null);
  const [placed, setPlaced] = useState(false);

  const measure = () => {
    const row = rowRef.current;
    const parts = getParts();
    if (!row || parts.length === 0) {
      setPosition(null);
      return;
    }
    const left = Math.min(...parts.map(part => part.offsetLeft));
    const size = Math.max(...parts.map(part => part.offsetLeft + part.offsetWidth)) - left;
    const rtl = getComputedStyle(row).direction === 'rtl';
    const start = rtl ? row.offsetWidth - left - size : left;
    setPosition(current => (current && current.start === start && current.size === size ? current : { start, size }));
  };
  useBrowserLayoutEffect(measure);
  useResizeObserver(rowRef, measure);
  useBrowserLayoutEffect(() => {
    if (position && !placed) {
      const frame = requestAnimationFrame(() => setPlaced(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [position, placed]);

  return { position, placed };
}

export interface SlidingMarkerProps {
  position: MarkerPosition | null;
  placed: boolean;
  className?: string;
}

/**
 * Ink crop marks at the corners of the chosen item in a row, as on the open tab, the chosen segment and the
 * current page. They slide to the next item, quickly and slowing as they land, and move at once with reduced
 * motion. Render it inside the row, which must be positioned. Drawing only, hidden from screen readers.
 */
export function SlidingMarker({ position, placed, className }: SlidingMarkerProps) {
  if (!position) {
    return null;
  }
  return (
    <span
      className={clsx(styles.marker, placed && styles.placed, className)}
      style={{ insetInlineStart: position.start, inlineSize: position.size }}
      aria-hidden="true"
    >
      <CropMarks selected={true} open={true} />
    </span>
  );
}
