// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Schematic, { SchematicProps } from '@ordinate/components/schematic';
import SpaceBetween from '@ordinate/components/space-between';

import '@ordinate/global-styles/drawing-fonts.css';

const wires: SchematicProps.Wire[] = [
  {
    id: 'app-primary',
    points: [
      [200, 100],
      [200, 180],
    ],
    flow: true,
  },
  {
    id: 'app-replica',
    points: [
      [420, 100],
      [420, 180],
    ],
    flow: true,
  },
  {
    id: 'replication',
    points: [
      [270, 212],
      [350, 212],
    ],
  },
];

const steps = [
  { title: 'The app writes to the primary, which copies every change to the replica.', promoted: false },
  { title: 'The primary stops answering.', promoted: false },
  { title: 'The replica is promoted and the app writes to it instead.', promoted: true },
];

const scenes: Record<string, SchematicProps.State>[] = [
  { app: {}, primary: {}, replica: {}, 'app-primary': {}, replication: {} },
  { app: {}, primary: { status: 'removed' }, replica: {}, replication: { dimmed: true } },
  { app: {}, primary: { status: 'removed', dimmed: true }, replica: { accent: true }, 'app-replica': {} },
];

export default function Failover() {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const parts: SchematicProps.Part[] = [
    { id: 'app', x: 160, y: 40, width: 300, height: 60, label: 'App', detail: 'north-annex web' },
    { id: 'primary', x: 130, y: 180, width: 140, height: 64, label: 'Primary', detail: 'db-north-1' },
    {
      id: 'replica',
      x: 350,
      y: 180,
      width: 140,
      height: 64,
      label: step.promoted ? 'Primary' : 'Replica',
      detail: 'db-north-2',
    },
  ];

  return (
    <SpaceBetween size="m">
      <Schematic
        width={620}
        height={280}
        parts={parts}
        wires={wires}
        scene={scenes[index]}
        variant="chalkboard"
        ariaLabel={step.title}
      />
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Back
        </Button>
        <Button variant="primary" disabled={index === steps.length - 1} onClick={() => setIndex(index + 1)}>
          Next step
        </Button>
        <Box color="text-body-secondary">{step.title}</Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}
