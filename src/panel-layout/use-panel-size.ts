// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { PanelLayoutProps } from './interfaces';

interface PanelSizeOptions {
  panelSize?: number;
  defaultPanelSize: number;
  minPanelSize: number;
  maxPanelSize?: number;
  /**
   * The width of the whole layout, once measured.
   */
  containerWidth: number | null;
  onPanelResize?: NonCancelableEventHandler<PanelLayoutProps.PanelResizeDetail>;
}

export interface PanelSize {
  size: number;
  min: number;
  /**
   * `Infinity` until the layout is measured, when no `maxPanelSize` is set.
   */
  max: number;
  resize: (requested: number) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * The panel width, controlled through `panelSize` or kept here, always within the limits.
 */
export function usePanelSize({
  panelSize,
  defaultPanelSize,
  minPanelSize,
  maxPanelSize,
  containerWidth,
  onPanelResize,
}: PanelSizeOptions): PanelSize {
  const [uncontrolledSize, setUncontrolledSize] = useState(defaultPanelSize);
  const min = Math.max(0, minPanelSize);
  const max = Math.max(min, Math.min(maxPanelSize ?? Infinity, containerWidth ?? Infinity));
  const size = clamp(panelSize ?? uncontrolledSize, min, max);

  const resize = (requested: number) => {
    const next = clamp(Math.round(requested), min, max);
    if (next === size) {
      return;
    }
    if (panelSize === undefined) {
      setUncontrolledSize(next);
    }
    fireNonCancelableEvent(onPanelResize, { panelSize: next });
  };

  return { size, min, max, resize };
}
