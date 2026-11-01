// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Schematic, { SchematicProps } from '~components/schematic';
import SegmentedControl from '~components/segmented-control';

import '~global-styles/drawing-fonts.css';
import styles from '../drawings.module.scss';

// A deployment rolling three Pods from v1 to v2 behind a service.
const podX = [60, 160, 260, 360];
const parts: SchematicProps.Part[] = [
  { id: 'deployment', x: 150, y: 20, width: 180, height: 52, label: 'Deployment web', detail: 'replicas: 3' },
  { id: 'rs1', x: 40, y: 120, width: 180, height: 52, label: 'ReplicaSet v1' },
  { id: 'rs2', x: 260, y: 120, width: 180, height: 52, label: 'ReplicaSet v2' },
  ...podX.map((x, i) => ({
    id: `pod${i}`,
    x,
    y: 230,
    width: 60,
    height: 52,
    label: 'v1',
    detail: 'app=web',
    size: 'small' as const,
  })),
  { id: 'service', x: 150, y: 360, width: 180, height: 52, label: 'Service web', detail: 'selector app=web' },
];
const wires: SchematicProps.Wire[] = [
  {
    id: 'd-rs1',
    points: [
      [240, 72],
      [240, 96],
      [130, 96],
      [130, 120],
    ],
  },
  {
    id: 'd-rs2',
    points: [
      [240, 72],
      [240, 96],
      [350, 96],
      [350, 120],
    ],
    junctions: [[240, 96]],
  },
  ...podX.map((x, i) => ({
    id: `rs-pod${i}`,
    points: [
      [i < 3 ? 130 : 350, 172],
      [i < 3 ? 130 : 350, 200],
      [x + 30, 200],
      [x + 30, 230],
    ] as SchematicProps.Point[],
  })),
  ...podX.map((x, i) => ({
    id: `svc-pod${i}`,
    points: [
      [240, 360],
      [240, 320],
      [x + 30, 320],
      [x + 30, 282],
    ] as SchematicProps.Point[],
    junctions: [[x + 30, 320]] as SchematicProps.Point[],
    flow: true,
  })),
];

type Scene = Record<string, SchematicProps.State>;
const base: Scene = { deployment: {}, rs1: {}, 'd-rs1': {}, service: {} };
const v1Pods: Scene = Object.fromEntries(
  [0, 1, 2].flatMap(i => [
    [`pod${i}`, {}],
    [`rs-pod${i}`, {}],
    [`svc-pod${i}`, {}],
  ])
);
const steps: { title: string; scene: Scene; labels?: Record<string, string> }[] = [
  { title: 'A Deployment', scene: { deployment: {} } },
  { title: 'Its ReplicaSet makes three Pods', scene: { ...base, ...v1Pods, service: undefined as never } },
  { title: 'A Service sends traffic to them', scene: { ...base, ...v1Pods } },
  {
    title: 'A rollout starts a v2 Pod',
    scene: {
      ...base,
      ...v1Pods,
      rs2: { accent: true },
      'd-rs2': {},
      pod3: { accent: true, status: 'pending' },
      'rs-pod3': {},
    },
    labels: { pod3: 'v2' },
  },
  {
    title: 'and retires a v1 Pod',
    scene: {
      ...base,
      ...v1Pods,
      rs1: { dimmed: true },
      rs2: { accent: true },
      'd-rs2': {},
      pod0: { status: 'removed' },
      'svc-pod0': undefined as never,
      pod3: { accent: true },
      'rs-pod3': {},
      'svc-pod3': {},
    },
    labels: { pod3: 'v2' },
  },
];

const clean = (scene: Scene) => Object.fromEntries(Object.entries(scene).filter(([, state]) => state));

function withLabels(labels: Record<string, string> = {}) {
  return parts.map(part => (labels[part.id] ? { ...part, label: labels[part.id] } : part));
}

export default function SchematicPermutations() {
  const [index, setIndex] = useState(3);
  const [variant, setVariant] = useState<SchematicProps.Variant>('schematic');
  const step = steps[index];
  return (
    <article className={styles.page}>
      <h1>Schematic</h1>
      <section className={styles.section}>
        <h2>Stepping through scenes</h2>
        <div className={styles.controls}>
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
          <Button onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
            Back
          </Button>
          <Button
            variant="primary"
            onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
            disabled={index === steps.length - 1}
          >
            Next
          </Button>
          <span id="schematic-step">{`${index + 1} of ${steps.length}: ${step.title}`}</span>
        </div>
        <div className={styles.wide}>
          <Schematic
            width={480}
            height={430}
            parts={withLabels(step.labels)}
            wires={wires}
            scene={clean(step.scene)}
            variant={variant}
            ariaLabel={step.title}
            ariaDescribedby="schematic-step"
          />
        </div>
      </section>
      <section className={styles.section}>
        <h2>Every variant, with accent, dimmed, pending and removed parts</h2>
        <div className={styles.row}>
          {(['schematic', 'sketch', 'chalkboard'] as const).map(v => (
            <Schematic
              key={v}
              width={480}
              height={430}
              parts={withLabels(steps[4].labels)}
              wires={wires}
              scene={{ ...clean(steps[4].scene), pod2: { status: 'pending' } }}
              variant={v}
              ariaLabel={`The rollout, ${v} variant`}
            />
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2>No scene: everything shown</h2>
        <div className={styles.narrow}>
          <Schematic width={480} height={430} parts={parts} wires={wires} ariaLabel="Every part of the drawing" />
        </div>
      </section>
    </article>
  );
}
