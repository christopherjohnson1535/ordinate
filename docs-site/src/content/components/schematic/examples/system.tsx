// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Schematic, { SchematicProps } from '@ordinate/components/schematic';

// Requests from clients pass the gateway to three nodes, which share one database.
const nodeX = [90, 250, 410];

const parts: SchematicProps.Part[] = [
  { id: 'clients', x: 250, y: 20, width: 140, height: 48, label: 'Clients', detail: 'HTTPS' },
  { id: 'gateway', x: 250, y: 110, width: 140, height: 48, label: 'Gateway', detail: 'gw-north-01' },
  ...nodeX.map((x, i) => ({
    id: `node${i + 1}`,
    x,
    y: 210,
    width: 140,
    height: 52,
    label: `node-0${i + 1}`,
    detail: i === 2 ? 'us-mountain-1b' : 'us-mountain-1a',
  })),
  { id: 'database', x: 250, y: 316, width: 140, height: 48, label: 'Database', detail: 'postgres 17' },
];

const wires: SchematicProps.Wire[] = [
  {
    id: 'clients-gateway',
    points: [
      [320, 68],
      [320, 110],
    ],
    flow: true,
  },
  ...nodeX.map(x => ({
    id: `gateway-node-${x}`,
    points: [[320, 158], [320, 184], [x + 70, 184], [x + 70, 210]] as SchematicProps.Point[],
    junctions: [[320, 184]] as SchematicProps.Point[],
    flow: true,
  })),
  ...nodeX.map(x => ({
    id: `node-${x}-database`,
    points: [[x + 70, 262], [x + 70, 290], [320, 290], [320, 316]] as SchematicProps.Point[],
    junctions: [[320, 290]] as SchematicProps.Point[],
  })),
];

export default function System() {
  return (
    <Schematic
      width={640}
      height={384}
      parts={parts}
      wires={wires}
      ariaLabel="Clients reach a gateway, which spreads requests over three nodes. The nodes share one database."
    />
  );
}
