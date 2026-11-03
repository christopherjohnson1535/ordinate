// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Schematic, { SchematicProps } from '@ordinate/components/schematic';

const states: { id: string; label: string; state: SchematicProps.State }[] = [
  { id: 'plain', label: 'Shown', state: {} },
  { id: 'accent', label: 'Accent', state: { accent: true } },
  { id: 'dimmed', label: 'Dimmed', state: { dimmed: true } },
  { id: 'pending', label: 'Pending', state: { accent: true, status: 'pending' } },
  { id: 'removed', label: 'Removed', state: { status: 'removed' } },
];

const parts: SchematicProps.Part[] = states.map((s, i) => ({
  id: s.id,
  x: 16 + i * 124,
  y: 24,
  width: 104,
  height: 64,
  label: s.label,
  detail: `replica ${i + 1}`,
  size: 'small',
}));

export default function States() {
  return (
    <Schematic
      width={636}
      height={112}
      parts={parts}
      scene={Object.fromEntries(states.map(s => [s.id, s.state]))}
      ariaLabel="Five replicas: one shown plainly, one accented as new, one dimmed, one pending and one crossed out as removed."
    />
  );
}
