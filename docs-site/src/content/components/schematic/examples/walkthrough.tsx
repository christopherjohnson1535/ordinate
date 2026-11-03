// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Schematic, { SchematicProps } from '@ordinate/components/schematic';
import SpaceBetween from '@ordinate/components/space-between';

const nodeX = [20, 175, 330, 485];

const parts: SchematicProps.Part[] = [
  { id: 'gateway', x: 250, y: 24, width: 140, height: 48, label: 'Gateway', detail: 'gw-north-01' },
  ...nodeX.map((x, i) => ({
    id: `node${i + 1}`,
    x,
    y: 160,
    width: 135,
    height: 56,
    label: `node-0${i + 1}`,
    detail: i === 3 ? 'base-2026.11' : 'base-2026.10',
  })),
];

const wires: SchematicProps.Wire[] = nodeX.map((x, i) => ({
  id: `to-node${i + 1}`,
  points: [[320, 72], [320, 116], [x + 67, 116], [x + 67, 160]] as SchematicProps.Point[],
  junctions: [[320, 116]] as SchematicProps.Point[],
  flow: true,
}));

const serving = { gateway: {}, node2: {}, node3: {}, 'to-node2': {}, 'to-node3': {} };

const steps: { title: string; scene: Record<string, SchematicProps.State> }[] = [
  { title: 'Three nodes answer behind the gateway.', scene: { ...serving, node1: {}, 'to-node1': {} } },
  {
    title: 'A node with the new image starts.',
    scene: { ...serving, node1: {}, 'to-node1': {}, node4: { accent: true, status: 'pending' } },
  },
  {
    title: 'It passes its health check and the gateway sends it traffic.',
    scene: { ...serving, node1: {}, 'to-node1': {}, node4: { accent: true }, 'to-node4': {} },
  },
  {
    title: 'The oldest node is drained and removed.',
    scene: { ...serving, node1: { status: 'removed' }, node4: { accent: true }, 'to-node4': {} },
  },
];

export default function Walkthrough() {
  const [index, setIndex] = useState(0);
  const step = steps[index];

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Back
        </Button>
        <Button variant="primary" disabled={index === steps.length - 1} onClick={() => setIndex(index + 1)}>
          Next step
        </Button>
        <Box id="replace-step" color="text-body-secondary">
          {index + 1} of {steps.length}: {step.title}
        </Box>
      </SpaceBetween>
      <Schematic
        width={640}
        height={240}
        parts={parts}
        wires={wires}
        scene={step.scene}
        ariaLabel={step.title}
        ariaDescribedby="replace-step"
      />
    </SpaceBetween>
  );
}
