// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useResizeObserver } from './use-resize-observer';

/**
 * Tracks the inner width of an element. Returns `null` until the element has been measured, and
 * while it has no width at all (hidden, or rendered without layout), so callers can keep their
 * preferred layout instead of collapsing to nothing.
 */
export function useContainerWidth(ref: React.RefObject<HTMLElement | null>): number | null {
  const [width, setWidth] = useState<number | null>(null);
  useResizeObserver(ref, () => {
    const measured = ref.current?.clientWidth ?? 0;
    setWidth(measured > 0 ? measured : null);
  });
  return width;
}
