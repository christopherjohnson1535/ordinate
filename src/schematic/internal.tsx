// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useMemo } from 'react';
import clsx from 'clsx';

import { flowRoute, junctionPath, labelPositions, partPaths, wirePath } from './geometry';
import { SchematicProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalSchematicProps extends SchematicProps {
  /**
   * Lets other components position the schematic. Not part of the public API.
   */
  className?: string;
}

const shown: SchematicProps.State = {};

function stateClasses(state: SchematicProps.State | undefined) {
  return clsx(
    state ? styles.shown : styles.hidden,
    state?.accent && styles.accent,
    state?.dimmed && styles.dimmed,
    state?.status === 'pending' && styles.pending,
    state?.status === 'removed' && styles.removed
  );
}

export function InternalSchematic({
  width,
  height,
  parts,
  wires = [],
  scene,
  variant = 'schematic',
  ariaLabel,
  ariaDescribedby,
  className,
  ...rest
}: InternalSchematicProps) {
  const stateOf = (id: string) => (scene ? scene[id] : shown);
  return (
    <div {...rest} className={clsx(styles.root, styles[`variant-${variant}`], className)}>
      <svg
        className={styles.drawing}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        // A drawing keeps its geometry in right-to-left pages.
        direction="ltr"
      >
        <g>
          {wires.map(wire => (
            <WireShape key={wire.id} wire={wire} variant={variant} state={stateOf(wire.id)} />
          ))}
        </g>
        <g>
          {parts.map(part => (
            <PartShape key={part.id} part={part} variant={variant} state={stateOf(part.id)} />
          ))}
        </g>
      </svg>
    </div>
  );
}

interface PartShapeProps {
  part: SchematicProps.Part;
  variant: SchematicProps.Variant;
  state: SchematicProps.State | undefined;
}

const PartShape = memo(function PartShape({ part, variant, state }: PartShapeProps) {
  const { x, y, width, height, id, size } = part;
  const paths = useMemo(
    () => partPaths({ x, y, width, height, id, size, label: '' }, variant),
    [x, y, width, height, id, size, variant]
  );
  const positions = labelPositions(part);
  const cx = x + width / 2;
  return (
    <g className={clsx(styles.part, size === 'small' && styles.small, stateClasses(state))} data-part-id={id}>
      <path className={styles.solid} d={paths.solid} />
      <path className={styles.hatch} d={paths.hatch} pathLength={1} />
      <path className={styles.outline} d={paths.outline} pathLength={1} />
      <path className={styles.cross} d={paths.cross} pathLength={1} />
      <text className={styles.label} x={cx} y={positions.label} textAnchor="middle" dominantBaseline="central">
        {part.label}
      </text>
      <text className={styles.detail} x={cx} y={positions.detail} textAnchor="middle" dominantBaseline="central">
        {part.detail ?? ''}
      </text>
    </g>
  );
});

interface WireShapeProps {
  wire: SchematicProps.Wire;
  variant: SchematicProps.Variant;
  state: SchematicProps.State | undefined;
}

const WireShape = memo(function WireShape({ wire, variant, state }: WireShapeProps) {
  const d = useMemo(() => wirePath(wire, variant), [wire, variant]);
  const route = wire.flow ? `path("${flowRoute(wire)}")` : undefined;
  return (
    <g className={clsx(styles.wire, wire.flow && styles.flow, stateClasses(state))} data-wire-id={wire.id}>
      <path className={styles['wire-line']} d={d} pathLength={1} />
      {wire.junctions?.length ? <path className={styles.junction} d={junctionPath(wire)} /> : null}
      {route && (
        <>
          <circle className={styles['flow-dot']} r={3.5} style={{ offsetPath: route }} />
          <circle
            className={clsx(styles['flow-dot'], styles['flow-dot-second'])}
            r={3.5}
            style={{ offsetPath: route }}
          />
        </>
      )}
    </g>
  );
});
