// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type Point = readonly [number, number];

const round = (value: number) => Math.round(value * 100) / 100;

const isDrawable = ([x, y]: Point) => Number.isFinite(x) && Number.isFinite(y);

/**
 * An SVG path through the points. Points that cannot be drawn, such as zero on a log
 * scale, break the line into separate runs.
 */
export function linePath(points: ReadonlyArray<Point>): string {
  let path = '';
  let drawing = false;
  for (const point of points) {
    if (!isDrawable(point)) {
      drawing = false;
      continue;
    }
    path += `${drawing ? 'L' : 'M'}${round(point[0])},${round(point[1])}`;
    drawing = true;
  }
  return path;
}

/**
 * A closed SVG path between a top edge and a bottom edge with the same x positions, as in a
 * stacked area. Positions where either edge cannot be drawn are left out.
 */
export function areaPath(top: ReadonlyArray<Point>, bottom: ReadonlyArray<Point>): string {
  const pairs = top
    .map((point, index) => [point, bottom[index]] as const)
    .filter(([t, b]) => isDrawable(t) && b && isDrawable(b));
  if (pairs.length === 0) {
    return '';
  }
  const upper = pairs.map(([point]) => point);
  const lower = pairs.map(([, point]) => point).reverse();
  return `${linePath(upper)}L${linePath(lower).slice(1)}Z`;
}

/**
 * A point on a circle. Angles are in radians, start at twelve o'clock and run clockwise.
 */
export function polarToCartesian(cx: number, cy: number, radius: number, angle: number): [number, number] {
  return [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)];
}

export interface ArcOptions {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  /**
   * Radians from twelve o'clock, clockwise. An end angle smaller than the start draws
   * counterclockwise, which is how a pie is mirrored in right-to-left layout.
   */
  startAngle: number;
  endAngle: number;
}

/**
 * An SVG path for a pie slice, or a ring segment when `innerRadius` is above zero. A full
 * circle is drawn as two halves, because a single arc cannot start and end at the same point.
 */
export function arcPath({ cx, cy, innerRadius, outerRadius, startAngle, endAngle }: ArcOptions): string {
  const sweep = endAngle - startAngle;
  if (Math.abs(sweep) >= 2 * Math.PI - 1e-9) {
    const middle = startAngle + sweep / 2;
    return (
      arcPath({ cx, cy, innerRadius, outerRadius, startAngle, endAngle: middle }) +
      arcPath({ cx, cy, innerRadius, outerRadius, startAngle: middle, endAngle })
    );
  }
  const large = Math.abs(sweep) > Math.PI ? 1 : 0;
  const clockwise = sweep >= 0 ? 1 : 0;
  const [x0, y0] = polarToCartesian(cx, cy, outerRadius, startAngle);
  const [x1, y1] = polarToCartesian(cx, cy, outerRadius, endAngle);
  const outer = `M${round(x0)},${round(y0)}A${round(outerRadius)},${round(outerRadius)} 0 ${large} ${clockwise} ${round(x1)},${round(y1)}`;
  if (innerRadius <= 0) {
    return `${outer}L${round(cx)},${round(cy)}Z`;
  }
  const [x2, y2] = polarToCartesian(cx, cy, innerRadius, endAngle);
  const [x3, y3] = polarToCartesian(cx, cy, innerRadius, startAngle);
  return `${outer}L${round(x2)},${round(y2)}A${round(innerRadius)},${round(innerRadius)} 0 ${large} ${1 - clockwise} ${round(x3)},${round(y3)}Z`;
}
