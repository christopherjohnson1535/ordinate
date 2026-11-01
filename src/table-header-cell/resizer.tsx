// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { getIsRtl, getLogicalArrowStep } from '../internal/direction';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';

import styles from './styles.css.js';

const keyboardStep = 10;

interface ResizerProps {
  cellRef: React.RefObject<HTMLTableCellElement | null>;
  width?: number;
  minWidth: number;
  maxWidth?: number;
  labelledby: string;
  roleDescription?: string;
  onResize: (width: number) => void;
  onResizeEnd: (width: number) => void;
}

interface Drag {
  pointerId: number;
  startX: number;
  startWidth: number;
  direction: 1 | -1;
  width: number;
}

/**
 * The handle at the end of a header cell. It follows the window splitter pattern: a focusable
 * separator whose value is the column width.
 */
export function Resizer({
  cellRef,
  width,
  minWidth,
  maxWidth,
  labelledby,
  roleDescription,
  onResize,
  onResizeEnd,
}: ResizerProps) {
  const dragRef = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState(false);
  // A column without a set width, such as the flexible last one, still needs a value to announce.
  const [renderedWidth, setRenderedWidth] = useState<number>();
  useResizeObserver(cellRef, () => setRenderedWidth(cellRef.current?.getBoundingClientRect().width || undefined));

  const clamp = (value: number) => Math.round(Math.min(Math.max(value, minWidth), maxWidth ?? Infinity));
  const currentWidth = () => width ?? cellRef.current?.getBoundingClientRect().width ?? minWidth;

  const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    const startWidth = cellRef.current?.getBoundingClientRect().width ?? currentWidth();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth,
      // Columns grow toward the end of the line, which is to the left in right-to-left layout.
      direction: getIsRtl(event.currentTarget) ? -1 : 1,
      width: startWidth,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    const next = clamp(drag.startWidth + (event.clientX - drag.startX) * drag.direction);
    if (next !== drag.width) {
      drag.width = next;
      onResize(next);
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    dragRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    onResizeEnd(drag.width);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const step = getLogicalArrowStep(event.key, event.currentTarget);
    if (step === 0) {
      return;
    }
    event.preventDefault();
    const next = clamp(currentWidth() + step * keyboardStep);
    onResize(next);
    onResizeEnd(next);
  };

  return (
    <span
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-labelledby={labelledby}
      aria-roledescription={roleDescription}
      aria-valuenow={Math.round(width ?? renderedWidth ?? minWidth)}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      className={clsx(styles.resizer, dragging && styles['resizer-active'])}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      // Clicks on the handle must not reach a sorting button or a row click handler.
      onClick={event => event.stopPropagation()}
    />
  );
}
