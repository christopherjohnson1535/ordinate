// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import rough from 'roughjs';

import { SchematicProps } from './interfaces';

// Every stroke is drawn with pathLength=1, so the styles can draw it on and take it off by moving
// stroke-dashoffset between 1 and 0, whatever its real length.

type Point = SchematicProps.Point;

export interface PartPaths {
  /** The box, filled so wires pass behind it. Empty in the sketch variant, which leaves the paper. */
  solid: string;
  hatch: string;
  outline: string;
  cross: string;
}

const generator = rough.generator();

// Rough.js separates the strokes it draws by color, so these only tell outline from fill.
const OUTLINE = '#000';
const FILL = '#f00';

/** Rounds the long decimals Rough.js produces, which only make the markup bigger. */
const tidy = (d: string) => d.replace(/-?\d+\.\d+/g, m => String(Math.round(parseFloat(m) * 10) / 10));

/** A stable seed per ID, so a sketch looks the same on every render and on the server. */
const seedOf = (id: string) => [...id].reduce((hash, c) => (hash * 31 + c.charCodeAt(0)) >>> 0, 7) % 100000;

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;

const polyline = (points: ReadonlyArray<Point>) => 'M' + points.map(([x, y]) => `${x} ${y}`).join('L');

const dot = ([x, y]: Point) => `M${x - 2.5} ${y}a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0`;

/** Diagonal lines at -45 degrees across a box, `gap` apart. */
function hatch(x: number, y: number, w: number, h: number, gap: number): string {
  let d = '';
  for (let c = gap; c < w + h; c += gap) {
    const x1 = Math.min(c, w);
    const y1 = c - x1;
    const y2 = Math.min(c, h);
    const x2 = c - y2;
    d += `M${x + x1} ${y + y1}L${x + x2} ${y + y2}`;
  }
  return d;
}

/** The two points the arrowhead is aimed along: the end and the last point before it. */
function tail(points: ReadonlyArray<Point>): [Point, Point] {
  const end = points[points.length - 1];
  for (let i = points.length - 2; i >= 0; i--) {
    if (points[i][0] !== end[0] || points[i][1] !== end[1]) {
      return [points[i], end];
    }
  }
  return [[end[0], end[1] - 1], end];
}

function arrowhead(points: ReadonlyArray<Point>): Point[] {
  const [[ax, ay], [bx, by]] = tail(points);
  const angle = Math.atan2(by - ay, bx - ax);
  const length = 7;
  const spread = 0.52;
  return [
    [bx - length * Math.cos(angle - spread), by - length * Math.sin(angle - spread)],
    [bx, by],
    [bx - length * Math.cos(angle + spread), by - length * Math.sin(angle + spread)],
  ];
}

export function partPaths(part: SchematicProps.Part, variant: SchematicProps.Variant): PartPaths {
  const { x, y, width: w, height: h } = part;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const k = Math.min(w, h) * 0.34;
  const cross = `M${cx - k} ${cy - k}L${cx + k} ${cy + k}M${cx + k} ${cy - k}L${cx - k} ${cy + k}`;

  if (variant === 'sketch') {
    const paths = generator.toPaths(
      generator.rectangle(x, y, w, h, {
        seed: seedOf(part.id),
        roughness: 1,
        bowing: 1,
        stroke: OUTLINE,
        strokeWidth: 1.5,
        fill: FILL,
        fillStyle: 'hachure',
        hachureAngle: -41,
        hachureGap: 6,
      })
    );
    const join = (color: string) =>
      tidy(
        paths
          .filter(p => p.stroke === color)
          .map(p => p.d)
          .join(' ')
      );
    return { solid: '', hatch: join(FILL), outline: join(OUTLINE), cross };
  }

  return {
    solid: rect(x, y, w, h),
    hatch: hatch(x, y, w, h, part.size === 'small' ? 7 : 8),
    outline: rect(x, y, w, h),
    cross,
  };
}

export function wirePath(wire: SchematicProps.Wire, variant: SchematicProps.Variant): string {
  const head = arrowhead(wire.points);
  if (variant === 'sketch') {
    const seed = seedOf(wire.id);
    const shaft = generator.toPaths(
      generator.linearPath(wire.points as Point[] as [number, number][], { seed, roughness: 0.9, stroke: OUTLINE })
    );
    const tip = generator.toPaths(generator.linearPath(head as [number, number][], { seed: seed + 1, roughness: 0.6 }));
    return tidy([...shaft, ...tip].map(p => p.d).join(' '));
  }
  return tidy(polyline(wire.points) + polyline(head));
}

/** The dots where a wire branches off a shared run. */
export function junctionPath(wire: SchematicProps.Wire): string {
  return (wire.junctions ?? []).map(dot).join('');
}

/** The route the flow dots follow: the wire without its arrowhead. */
export function flowRoute(wire: SchematicProps.Wire): string {
  return polyline(wire.points);
}

/** Where the label and detail lines sit: centered as a pair, or the label alone in the middle. */
export function labelPositions(part: SchematicProps.Part): { label: number; detail: number } {
  const center = part.y + part.height / 2;
  if (!part.detail) {
    return { label: center, detail: center };
  }
  const gap = part.size === 'small' ? 17 : 21;
  return { label: center - gap / 2, detail: center + gap / 2 };
}
