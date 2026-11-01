// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { arcPath, polarToCartesian } from '../utils/paths';

export interface PieSlice {
  startAngle: number;
  endAngle: number;
  /** Angle through the middle of the slice. */
  midAngle: number;
  /** Share of the total, from 0 to 1. */
  fraction: number;
}

/**
 * Splits a circle into slices proportional to `values`, clockwise from twelve o'clock, or
 * counterclockwise when `mirrored`, as in right-to-left layout. Negative and missing values
 * get no slice.
 */
export function computeSlices(values: ReadonlyArray<number>, mirrored = false): PieSlice[] {
  const clean = values.map(value => (Number.isFinite(value) && value > 0 ? value : 0));
  const total = clean.reduce((sum, value) => sum + value, 0);
  const direction = mirrored ? -1 : 1;
  let angle = 0;
  return clean.map(value => {
    const fraction = total > 0 ? value / total : 0;
    const sweep = fraction * 2 * Math.PI * direction;
    const slice = { startAngle: angle, endAngle: angle + sweep, midAngle: angle + sweep / 2, fraction };
    angle += sweep;
    return slice;
  });
}

export interface PieGeometry {
  cx: number;
  cy: number;
  outerRadius: number;
  innerRadius: number;
}

export function slicePath(slice: PieSlice, { cx, cy, outerRadius, innerRadius }: PieGeometry): string {
  return arcPath({ cx, cy, innerRadius, outerRadius, startAngle: slice.startAngle, endAngle: slice.endAngle });
}

/**
 * The point in the middle of a slice's ring, where its detail popover points.
 */
export function sliceCentroid(slice: PieSlice, { cx, cy, outerRadius, innerRadius }: PieGeometry): [number, number] {
  return polarToCartesian(cx, cy, (outerRadius + innerRadius) / 2 || outerRadius / 2, slice.midAngle);
}

export interface LabelInput {
  midAngle: number;
  /** Height the label needs, for one or two lines. */
  height: number;
}

export interface LabelPlacement {
  side: 'left' | 'right';
  /** Where the leader line leaves the slice. */
  start: [number, number];
  /** Where the leader line bends toward the label. */
  elbow: [number, number];
  /** Where the label text starts, and the vertical middle of the label. */
  x: number;
  y: number;
}

/**
 * Places labels in two columns beside the pie, each joined to its slice by a leader line.
 * Labels on one side keep their order and are pushed apart so they never overlap, and pulled
 * back inside `[0, height]` when they would run off the drawing.
 */
export function placeLabels(
  labels: ReadonlyArray<LabelInput>,
  { cx, cy, outerRadius }: PieGeometry,
  height: number,
  { leader = 14, column = 22, gap = 4 }: { leader?: number; column?: number; gap?: number } = {}
): LabelPlacement[] {
  const placements: LabelPlacement[] = labels.map(label => {
    const side = Math.sin(label.midAngle) >= 0 ? 'right' : 'left';
    const start = polarToCartesian(cx, cy, outerRadius + 2, label.midAngle);
    const elbow = polarToCartesian(cx, cy, outerRadius + leader, label.midAngle);
    const x = side === 'right' ? cx + outerRadius + column : cx - outerRadius - column;
    return { side, start, elbow, x, y: elbow[1] };
  });
  for (const side of ['left', 'right'] as const) {
    const indexes = placements
      .map((placement, index) => ({ placement, index }))
      .filter(({ placement }) => placement.side === side)
      .sort((a, b) => a.placement.y - b.placement.y);
    // Push down from the top, then back up from the bottom.
    let floor = -Infinity;
    for (const { placement, index } of indexes) {
      const half = labels[index].height / 2;
      placement.y = Math.max(placement.y, floor + half);
      floor = placement.y + labels[index].height - half + gap;
    }
    let ceiling = height;
    for (const { placement, index } of [...indexes].reverse()) {
      const below = labels[index].height / 2;
      placement.y = Math.min(placement.y, ceiling - below);
      ceiling = placement.y - below - gap;
    }
    for (const { placement, index } of indexes) {
      placement.y = Math.max(placement.y, labels[index].height / 2);
    }
  }
  return placements;
}
