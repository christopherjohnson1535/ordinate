// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useLayoutEffect, useState } from 'react';
import type React from 'react';

import { getIsRtl } from '../../direction';
import { computeFloatingPosition, FloatingSide, PhysicalSide } from './position';

// Layout effects do nothing on the server, and React warns when they are used there.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const viewportMargin = 8;

export interface FloatingPositionOptions {
  /**
   * Whether the panel is shown. Position is only tracked while it is.
   */
  open: boolean;
  trigger: React.RefObject<Element | null>;
  /**
   * The panel. It must be `position: fixed`, because the returned style is in viewport coordinates.
   */
  panel: React.RefObject<HTMLElement | null>;
  /**
   * The arrow, absolutely positioned inside the panel. Its rendered size decides how far the
   * panel sits from the trigger.
   */
  arrow?: React.RefObject<HTMLElement | null>;
  preferredSide: FloatingSide;
  /**
   * Space in pixels between the arrow's tip and the trigger.
   */
  gap?: number;
  /**
   * Changes whenever the trigger moves without changing size, such as the marker that follows
   * the pointer across a chart, so the panel is placed again.
   */
  triggerKey?: string | number;
}

export interface FloatingPosition {
  /**
   * The side the panel is on after flipping, in logical terms.
   */
  side: FloatingSide;
  /**
   * The side the panel is on in screen terms. Use it to draw the arrow.
   */
  physicalSide: PhysicalSide;
  /**
   * Style for the panel. It keeps the panel transparent until the first measurement, so it
   * never flashes at the wrong place.
   */
  panelStyle: React.CSSProperties;
  /**
   * Style for the arrow, relative to the panel's padding box.
   */
  arrowStyle: React.CSSProperties;
}

interface Layout {
  side: FloatingSide;
  physicalSide: PhysicalSide;
  top: number;
  left: number;
  arrowTop: number;
  arrowLeft: number;
}

function sameLayout(a: Layout | null, b: Layout) {
  return (
    a !== null &&
    a.side === b.side &&
    a.top === b.top &&
    a.left === b.left &&
    a.arrowTop === b.arrowTop &&
    a.arrowLeft === b.arrowLeft
  );
}

function measure(
  trigger: Element,
  panel: HTMLElement,
  arrow: HTMLElement | null,
  preferredSide: FloatingSide,
  gap: number
): Layout {
  const depth = arrow ? Math.min(arrow.offsetWidth, arrow.offsetHeight) : 0;
  const breadth = arrow ? Math.max(arrow.offsetWidth, arrow.offsetHeight) : 0;
  const root = trigger.ownerDocument.documentElement;
  const result = computeFloatingPosition({
    trigger: trigger.getBoundingClientRect(),
    panel: { width: panel.offsetWidth, height: panel.offsetHeight },
    viewport: { width: root.clientWidth, height: root.clientHeight },
    arrow: { depth, breadth },
    preferredSide,
    rtl: getIsRtl(trigger),
    gap,
    margin: viewportMargin,
  });

  // The arrow is positioned from the panel's padding box, so its base covers the panel border.
  const { physicalSide, arrowOffset } = result;
  const vertical = physicalSide === 'top' || physicalSide === 'bottom';
  const along = arrowOffset - breadth / 2 - (vertical ? panel.clientLeft : panel.clientTop);
  const across = {
    top: panel.clientHeight,
    bottom: -depth,
    left: panel.clientWidth,
    right: -depth,
  }[physicalSide];

  return {
    side: result.side,
    physicalSide,
    top: Math.round(result.top),
    left: Math.round(result.left),
    arrowTop: Math.round(vertical ? across : along),
    arrowLeft: Math.round(vertical ? along : across),
  };
}

/**
 * Keeps a fixed-position panel next to its trigger while it is open: on the preferred
 * side when there is room, flipped when there is not, inside the viewport, and following
 * the trigger through scrolling, resizing and content changes.
 *
 * The returned styles use physical `top` and `left` on purpose: they come from measured
 * screen coordinates, in which right-to-left layout is already accounted for.
 */
export function useFloatingPosition({
  open,
  trigger,
  panel,
  arrow,
  preferredSide,
  gap = 4,
  triggerKey,
}: FloatingPositionOptions): FloatingPosition {
  const [layout, setLayout] = useState<Layout | null>(null);

  useBrowserLayoutEffect(() => {
    if (!open) {
      return;
    }
    const update = () => {
      const triggerElement = trigger.current;
      const panelElement = panel.current;
      if (!triggerElement || !panelElement) {
        return;
      }
      const arrowElement = arrow === undefined ? null : arrow.current;
      const next = measure(triggerElement, panelElement, arrowElement, preferredSide, gap);
      setLayout(current => (sameLayout(current, next) ? current : next));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    if (panel.current) {
      observer?.observe(panel.current);
    }
    if (trigger.current) {
      observer?.observe(trigger.current);
    }
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      observer?.disconnect();
    };
  }, [open, trigger, panel, arrow, preferredSide, gap, triggerKey]);

  return {
    side: layout?.side ?? preferredSide,
    physicalSide: layout?.physicalSide ?? preferredSide,
    // Transparent rather than hidden, so the owner can move focus into the panel before it is placed.
    panelStyle: layout
      ? { top: layout.top, left: layout.left }
      : { top: 0, left: 0, opacity: 0, pointerEvents: 'none' },
    arrowStyle: layout ? { top: layout.arrowTop, left: layout.arrowLeft } : {},
  };
}
