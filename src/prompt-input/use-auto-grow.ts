// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef } from 'react';

import { useBrowserLayoutEffect } from '../internal/hooks/use-browser-layout-effect';
import { useResizeObserver } from '../internal/hooks/use-resize-observer';

function toPixels(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Sizes a textarea to its text, between `minRows` and `maxRows` lines, and lets it scroll beyond
 * that. A `maxRows` of -1 removes the upper limit. The `rows` attribute covers server rendering.
 */
export function useAutoGrow(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  minRows: number,
  maxRows: number
): void {
  const widthRef = useRef<number | null>(null);

  const fit = useCallback(() => {
    const textarea = ref.current;
    if (!textarea) {
      return;
    }
    const style = getComputedStyle(textarea);
    const lineHeight = toPixels(style.lineHeight);
    if (lineHeight === 0) {
      return;
    }
    const padding = toPixels(style.paddingBlockStart) + toPixels(style.paddingBlockEnd);
    const minHeight = minRows * lineHeight + padding;
    const maxHeight = maxRows < 0 ? Infinity : Math.max(minRows, maxRows) * lineHeight + padding;

    // Collapsing first lets scrollHeight shrink when text is deleted.
    textarea.style.blockSize = 'auto';
    const contentHeight = textarea.scrollHeight;
    textarea.style.blockSize = `${Math.min(maxHeight, Math.max(minHeight, contentHeight))}px`;
    textarea.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
  }, [ref, minRows, maxRows]);

  useBrowserLayoutEffect(fit, [fit, value]);

  // Lines rewrap when the width changes. Height changes are our own, so they are ignored.
  useResizeObserver(ref, () => {
    const width = ref.current?.clientWidth ?? null;
    if (width !== widthRef.current) {
      widthRef.current = width;
      fit();
    }
  });
}
