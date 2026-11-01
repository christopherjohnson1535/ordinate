// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { SchematicProps } from './interfaces';
import { InternalSchematic } from './internal';

export type { SchematicProps };

/**
 * A drawing of boxes and right-angle wires that moves from one state to the next. Describe the parts
 * and wires once, and set `scene` to say which are shown and how: parts draw themselves on and off as
 * the scene changes. The same description draws as a schematic, a sketch or a chalkboard.
 */
export default function Schematic({
  width,
  height,
  parts,
  wires,
  scene,
  variant = 'schematic',
  ariaLabel,
  ariaDescribedby,
  ...props
}: SchematicProps) {
  return (
    <InternalSchematic
      {...getBaseProps(props)}
      width={width}
      height={height}
      parts={parts}
      wires={wires}
      scene={scene}
      variant={variant}
      ariaLabel={ariaLabel}
      ariaDescribedby={ariaDescribedby}
    />
  );
}
