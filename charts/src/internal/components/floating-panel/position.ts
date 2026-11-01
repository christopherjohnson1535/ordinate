// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * A side of the trigger. `right` and `left` are logical: `right` is the end of the
 * line, which is the physical left in right-to-left layout.
 */
export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * A side in screen coordinates, after right-to-left mapping.
 */
export type PhysicalSide = 'top' | 'right' | 'bottom' | 'left';

export interface Box {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface FloatingPositionInput {
  /**
   * The trigger's rectangle in viewport coordinates.
   */
  trigger: Box;
  /**
   * The panel's border-box size.
   */
  panel: Size;
  /**
   * The visible viewport, without scroll bars.
   */
  viewport: Size;
  /**
   * The arrow's size: `depth` is how far it sticks out of the panel, `breadth` how wide its base is.
   */
  arrow: { depth: number; breadth: number };
  preferredSide: FloatingSide;
  rtl: boolean;
  /**
   * Space between the arrow's tip and the trigger.
   */
  gap: number;
  /**
   * The closest the panel may come to the viewport edge.
   */
  margin: number;
}

export interface FloatingPositionResult {
  /**
   * The side the panel ended up on, in the same logical terms as `preferredSide`.
   */
  side: FloatingSide;
  physicalSide: PhysicalSide;
  /**
   * The panel's border-box position in viewport coordinates.
   */
  top: number;
  left: number;
  /**
   * Where the middle of the arrow sits along the panel edge facing the trigger, measured
   * from the panel's left edge (top and bottom sides) or top edge (left and right sides).
   */
  arrowOffset: number;
}

const opposite: Record<FloatingSide, FloatingSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

export function toPhysicalSide(side: FloatingSide, rtl: boolean): PhysicalSide {
  return rtl && (side === 'left' || side === 'right') ? opposite[side] : side;
}

function isVertical(side: FloatingSide | PhysicalSide) {
  return side === 'top' || side === 'bottom';
}

function clamp(value: number, min: number, max: number) {
  return max < min ? min : Math.min(Math.max(value, min), max);
}

// The preferred side, then its opposite, then the two sides across.
function candidateSides(preferred: FloatingSide): FloatingSide[] {
  const across: FloatingSide[] = isVertical(preferred) ? ['right', 'left'] : ['bottom', 'top'];
  return [preferred, opposite[preferred], ...across];
}

/**
 * Places a panel next to a trigger. Tries the preferred side first, then the opposite
 * side, then the two sides across, and takes the first one where the panel fits inside
 * the viewport. When none fits it takes the side with the most room. Along the edge, the
 * panel is centered on the trigger and then pushed back inside the viewport, and the
 * arrow follows the trigger's center so it keeps pointing at it.
 */
export function computeFloatingPosition(input: FloatingPositionInput): FloatingPositionResult {
  const { trigger, panel, viewport, arrow, preferredSide, rtl, gap, margin } = input;
  const distance = arrow.depth + gap;

  const room: Record<PhysicalSide, number> = {
    top: trigger.top - margin,
    bottom: viewport.height - trigger.bottom - margin,
    left: trigger.left - margin,
    right: viewport.width - trigger.right - margin,
  };

  const slack = (side: FloatingSide) => {
    const physical = toPhysicalSide(side, rtl);
    const needed = (isVertical(physical) ? panel.height : panel.width) + distance;
    const crossRoom = isVertical(physical) ? viewport.width - 2 * margin : viewport.height - 2 * margin;
    const crossSize = isVertical(physical) ? panel.width : panel.height;
    return Math.min(room[physical] - needed, crossRoom - crossSize);
  };

  const candidates = candidateSides(preferredSide);
  const side =
    candidates.find(candidate => slack(candidate) >= 0) ??
    candidates.reduce((best, candidate) => (slack(candidate) > slack(best) ? candidate : best));
  const physicalSide = toPhysicalSide(side, rtl);

  const centerX = (trigger.left + trigger.right) / 2;
  const centerY = (trigger.top + trigger.bottom) / 2;
  let top: number;
  let left: number;
  if (isVertical(physicalSide)) {
    top = physicalSide === 'top' ? trigger.top - distance - panel.height : trigger.bottom + distance;
    left = clamp(centerX - panel.width / 2, margin, viewport.width - margin - panel.width);
  } else {
    left = physicalSide === 'left' ? trigger.left - distance - panel.width : trigger.right + distance;
    top = clamp(centerY - panel.height / 2, margin, viewport.height - margin - panel.height);
  }

  const edgeLength = isVertical(physicalSide) ? panel.width : panel.height;
  const triggerCenter = isVertical(physicalSide) ? centerX - left : centerY - top;
  // Keeps the arrow off the panel's corners.
  const inset = arrow.breadth / 2 + arrow.depth;
  const arrowOffset = edgeLength < 2 * inset ? edgeLength / 2 : clamp(triggerCenter, inset, edgeLength - inset);

  return { side, physicalSide, top, left, arrowOffset };
}
