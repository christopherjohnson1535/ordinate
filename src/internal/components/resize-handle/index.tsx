// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { getIsRtl, getLogicalArrowStep } from '../../direction';

import styles from './styles.css.js';

/**
 * The edge of the panel the handle sits on. A panel docked at the bottom grows upward from
 * its `block-start` edge; a panel docked at the end of the line grows toward the start; a
 * panel in the page flow, such as an editor, grows downward from its `block-end` edge.
 */
export type ResizeEdge = 'block-start' | 'block-end' | 'inline-start';

const isBlockEdge = (edge: ResizeEdge) => edge !== 'inline-start';

export interface ResizeHandleProps {
  edge: ResizeEdge;
  size: number;
  minSize: number;
  maxSize: number;
  onResize: (size: number) => void;
  ariaLabel?: string;
  /**
   * ID of the panel the handle resizes.
   */
  ariaControls?: string;
  className?: string;
}

const keyboardStep = 16;

export function clampSize(size: number, minSize: number, maxSize: number): number {
  return Math.round(Math.max(minSize, Math.min(size, Math.max(minSize, maxSize))));
}

// Screen readers announce the position as a share of the range, which reads better than pixels.
function toPercent(size: number, minSize: number, maxSize: number) {
  if (maxSize <= minSize) {
    return 100;
  }
  return Math.round(((clampSize(size, minSize, maxSize) - minSize) / (maxSize - minSize)) * 100);
}

function getKeyboardDelta(event: React.KeyboardEvent<HTMLElement>, edge: ResizeEdge): number {
  if (isBlockEdge(edge)) {
    const grow = edge === 'block-start' ? 'ArrowUp' : 'ArrowDown';
    const shrink = edge === 'block-start' ? 'ArrowDown' : 'ArrowUp';
    if (event.key === grow) {
      return keyboardStep;
    }
    return event.key === shrink ? -keyboardStep : 0;
  }
  // Moving the edge toward the start of the line makes a panel at the end wider.
  return -getLogicalArrowStep(event.key, event.currentTarget) * keyboardStep;
}

/**
 * A separator on the edge of a panel that resizes it with a pointer drag or the arrow keys.
 * Home and End jump to the smallest and largest size. It is drawn as a grip of three short ticks
 * across the panel's edge.
 */
export function ResizeHandle({
  edge,
  size,
  minSize,
  maxSize,
  onResize,
  ariaLabel,
  ariaControls,
  className,
}: ResizeHandleProps) {
  const drag = useRef<{ x: number; y: number; size: number; rtl: boolean } | null>(null);
  const resize = (next: number) => {
    const clamped = clampSize(next, minSize, maxSize);
    if (clamped !== size) {
      onResize(clamped);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    // Keeps the drag from selecting text on the page.
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.currentTarget.focus();
    drag.current = { x: event.clientX, y: event.clientY, size, rtl: getIsRtl(event.currentTarget) };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) {
      return;
    }
    let delta: number;
    if (edge === 'block-start') {
      delta = start.y - event.clientY;
    } else if (edge === 'block-end') {
      delta = event.clientY - start.y;
    } else {
      delta = start.rtl ? event.clientX - start.x : start.x - event.clientX;
    }
    resize(start.size + delta);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null;
    if (event.key === 'Home') {
      next = minSize;
    } else if (event.key === 'End') {
      next = maxSize;
    } else {
      const delta = getKeyboardDelta(event, edge);
      next = delta === 0 ? null : size + delta;
    }
    if (next !== null) {
      event.preventDefault();
      resize(next);
    }
  };

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-orientation={isBlockEdge(edge) ? 'horizontal' : 'vertical'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={toPercent(size, minSize, maxSize)}
      className={clsx(styles.handle, styles[`edge-${edge}`], className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.grip} aria-hidden="true">
        <span className={styles.tick} />
        <span className={styles.tick} />
        <span className={styles.tick} />
      </span>
    </div>
  );
}
