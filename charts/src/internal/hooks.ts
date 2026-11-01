// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { getIsRtl } from './direction';

// Layout effects do nothing on the server, and React warns when they are used there.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Tracks the inner width of an element. Returns `null` until it has been measured, and while
 * it has no width at all, so the chart can draw at a default width instead of collapsing.
 */
export function useContainerWidth(ref: React.RefObject<HTMLElement | null>): number | null {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const measure = () => {
      const measured = element.clientWidth;
      setWidth(measured > 0 ? measured : null);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

/**
 * Whether the element is laid out right to left. It is read after every render, because the
 * direction can change on an ancestor without the chart rendering for another reason.
 */
export function useIsRtl(ref: React.RefObject<Element | null>): boolean {
  const [rtl, setRtl] = useState(false);
  useBrowserLayoutEffect(() => {
    const next = getIsRtl(ref.current);
    if (next !== rtl) {
      setRtl(next);
    }
  });
  useEffect(() => {
    // The direction attribute is usually set on the document element, which no React render follows.
    if (typeof MutationObserver === 'undefined') {
      return;
    }
    const observer = new MutationObserver(() => setRtl(getIsRtl(ref.current)));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, [ref]);
  return rtl;
}

/**
 * A stable ID usable inside `url(#…)` references, which do not accept the characters React's
 * own IDs may contain.
 */
export function useSvgId(prefix: string): string {
  const id = React.useId();
  return `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}
