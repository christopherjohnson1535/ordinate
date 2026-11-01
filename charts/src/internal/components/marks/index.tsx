// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useSvgId } from '../../hooks';
import { FillPattern, MarkerShape, SeriesStyle } from '../../series-style';

import styles from './styles.css.js';

const tile = 8;

// Strokes inside one 8 by 8 tile. Diagonals run past the tile edges so neighboring tiles join up.
const patternPaths: Record<Exclude<FillPattern, 'solid' | 'dots'>, string> = {
  diagonal: 'M0,8L8,0M-2,2L2,-2M6,10L10,6',
  'reverse-diagonal': 'M0,0L8,8M-2,6L2,10M6,-2L10,2',
  'cross-hatch': 'M0,8L8,0M-2,2L2,-2M6,10L10,6M0,0L8,8M-2,6L2,10M6,-2L10,2',
  horizontal: 'M0,2H8M0,6H8',
  vertical: 'M2,0V8M6,0V8',
  grid: 'M0,4H8M4,0V8',
};

/**
 * An SVG `<pattern>` for one series fill. It is drawn in `currentColor`, set from the series
 * color, over a light tint of the same color, so it follows the color mode.
 */
export function PatternDefinition({ id, pattern, color }: { id: string; pattern: FillPattern; color: string }) {
  if (pattern === 'solid') {
    return null;
  }
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={tile} height={tile} style={{ color }}>
      <rect width={tile} height={tile} className={styles['pattern-tint']} />
      {pattern === 'dots' ? (
        <>
          <circle cx={2} cy={2} r={1.5} className={styles['pattern-dot']} />
          <circle cx={6} cy={6} r={1.5} className={styles['pattern-dot']} />
        </>
      ) : (
        <path d={patternPaths[pattern]} className={styles['pattern-stroke']} />
      )}
    </pattern>
  );
}

/**
 * The `fill` value for a series: its color for the solid pattern, otherwise its pattern.
 */
export function fillFor(style: SeriesStyle, patternId: string): string {
  return style.pattern === 'solid' ? 'currentColor' : `url(#${patternId})`;
}

const filledMarkers: Partial<Record<MarkerShape, string>> = {
  square: 'M-3.5,-3.5H3.5V3.5H-3.5Z',
  triangle: 'M0,-4.6L4.3,3.2H-4.3Z',
  diamond: 'M0,-5L5,0L0,5L-5,0Z',
  'triangle-down': 'M0,4.6L4.3,-3.2H-4.3Z',
};

/**
 * A point marker centered on `x`, `y`, in the series color with a ring of the background
 * around it, so it stays readable where lines cross.
 */
export function Marker({
  shape,
  x,
  y,
  color,
  emphasized = false,
  className,
}: {
  shape: MarkerShape;
  x: number;
  y: number;
  color: string;
  emphasized?: boolean;
  className?: string;
}) {
  const transform = `translate(${Math.round(x * 100) / 100},${Math.round(y * 100) / 100})${emphasized ? ' scale(1.4)' : ''}`;
  const props = { transform, style: { color }, className: clsx(styles.marker, className) };
  switch (shape) {
    case 'circle':
      return <circle {...props} r={4} className={clsx(props.className, styles['marker-filled'])} />;
    case 'ring':
      return <circle {...props} r={3.5} className={clsx(props.className, styles['marker-outline'])} />;
    case 'square-outline':
      return (
        <rect
          {...props}
          x={-3.5}
          y={-3.5}
          width={7}
          height={7}
          className={clsx(props.className, styles['marker-outline'])}
        />
      );
    case 'cross':
      return (
        <g {...props}>
          <path d="M-3.5,-3.5L3.5,3.5M3.5,-3.5L-3.5,3.5" className={styles['marker-cross-halo']} />
          <path d="M-3.5,-3.5L3.5,3.5M3.5,-3.5L-3.5,3.5" className={styles['marker-cross']} />
        </g>
      );
    default:
      return <path {...props} d={filledMarkers[shape]} className={clsx(props.className, styles['marker-filled'])} />;
  }
}

export type SwatchKind = 'fill' | 'line' | 'threshold';

/**
 * A small key for a series, drawn the same way as the series itself: a patterned square for
 * fills, a line with its dash and marker for lines, and a dashed rule for thresholds.
 */
export function Swatch({ kind, seriesStyle }: { kind: SwatchKind; seriesStyle: SeriesStyle }) {
  const patternId = useSvgId('ord-swatch');
  if (kind === 'fill') {
    return (
      <svg className={styles['swatch-fill']} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <defs>
          <PatternDefinition id={patternId} pattern={seriesStyle.pattern} color={seriesStyle.color} />
        </defs>
        <rect
          x={0.5}
          y={0.5}
          width={13}
          height={13}
          style={{ color: seriesStyle.color }}
          fill={fillFor(seriesStyle, patternId)}
          className={styles['swatch-outline']}
        />
      </svg>
    );
  }
  return (
    <svg className={styles['swatch-line']} viewBox="0 0 24 14" aria-hidden="true" focusable="false">
      <line
        x1={0}
        y1={7}
        x2={24}
        y2={7}
        style={{ color: seriesStyle.color }}
        strokeDasharray={seriesStyle.dash}
        className={kind === 'threshold' ? styles['swatch-threshold'] : styles['swatch-stroke']}
      />
      {kind === 'line' && <Marker shape={seriesStyle.marker} x={12} y={7} color={seriesStyle.color} />}
    </svg>
  );
}
