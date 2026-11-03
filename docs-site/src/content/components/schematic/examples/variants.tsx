// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Schematic, { SchematicProps } from '@ordinate/components/schematic';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

import '@ordinate/global-styles/drawing-fonts.css';

const parts: SchematicProps.Part[] = [
  { id: 'client', x: 16, y: 40, width: 120, height: 56, label: 'Browser' },
  { id: 'gateway', x: 176, y: 40, width: 120, height: 56, label: 'Gateway', detail: 'TLS' },
  { id: 'service', x: 336, y: 40, width: 120, height: 56, label: 'Service', detail: '3 nodes' },
  { id: 'database', x: 496, y: 40, width: 128, height: 56, label: 'Database', detail: 'primary' },
  { id: 'cache', x: 336, y: 150, width: 120, height: 52, label: 'Cache', detail: 'new' },
];

const wires: SchematicProps.Wire[] = [
  {
    id: 'client-gateway',
    points: [
      [136, 68],
      [176, 68],
    ],
    flow: true,
  },
  {
    id: 'gateway-service',
    points: [
      [296, 68],
      [336, 68],
    ],
    flow: true,
  },
  {
    id: 'service-database',
    points: [
      [456, 68],
      [496, 68],
    ],
  },
  {
    id: 'service-cache',
    points: [
      [396, 96],
      [396, 150],
    ],
  },
];

const scene: Record<string, SchematicProps.State> = {
  client: {},
  gateway: {},
  service: {},
  database: {},
  cache: { accent: true },
  'client-gateway': {},
  'gateway-service': {},
  'service-database': {},
  'service-cache': { accent: true },
};

export default function Variants() {
  const [variant, setVariant] = useState<SchematicProps.Variant>('sketch');

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="Variant"
        selectedId={variant}
        onChange={event => setVariant(event.detail.selectedId as SchematicProps.Variant)}
        options={[
          { id: 'schematic', text: 'Schematic' },
          { id: 'sketch', text: 'Sketch' },
          { id: 'chalkboard', text: 'Chalkboard' },
        ]}
      />
      <Schematic
        width={640}
        height={220}
        parts={parts}
        wires={wires}
        scene={scene}
        variant={variant}
        ariaLabel="A request goes from the browser through the gateway to the service and its database. A new cache sits beside the service."
      />
    </SpaceBetween>
  );
}
