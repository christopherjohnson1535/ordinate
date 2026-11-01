// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { getIsRtl, getLogicalArrowStep } from '../internal/direction';
import { PanelLayoutProps } from './interfaces';
import { PanelSize } from './use-panel-size';

import styles from './styles.css.js';

const keyboardStep = 10;

interface ResizeHandleProps {
  handleRef: React.Ref<HTMLDivElement>;
  panelId: string;
  panelPosition: PanelLayoutProps.PanelPosition;
  panelSize: PanelSize;
  ariaLabel?: string;
}

interface DragStart {
  clientX: number;
  size: number;
}

export function ResizeHandle({ handleRef, panelId, panelPosition, panelSize, ariaLabel }: ResizeHandleProps) {
  const { size, min, max, resize } = panelSize;
  const dragStart = useRef<DragStart | null>(null);
  const [dragging, setDragging] = useState(false);
  // Moving toward the end of the line widens a panel at the start and narrows one at the end.
  const growthDirection = panelPosition === 'side-start' ? 1 : -1;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = getLogicalArrowStep(event.key, event.currentTarget);
    if (step !== 0) {
      resize(size + step * growthDirection * keyboardStep);
    } else if (event.key === 'Home') {
      resize(min);
    } else if (event.key === 'End' && Number.isFinite(max)) {
      resize(max);
    } else {
      return;
    }
    event.preventDefault();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.currentTarget.focus();
    dragStart.current = { clientX: event.clientX, size };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start) {
      return;
    }
    const delta = event.clientX - start.clientX;
    const logicalDelta = getIsRtl(event.currentTarget) ? -delta : delta;
    resize(start.size + logicalDelta * growthDirection);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={handleRef}
      className={clsx(styles.handle, dragging && styles.dragging)}
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-controls={panelId}
      aria-valuenow={size}
      aria-valuemin={min}
      aria-valuemax={Number.isFinite(max) ? max : undefined}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <span className={styles.grip} />
    </div>
  );
}
