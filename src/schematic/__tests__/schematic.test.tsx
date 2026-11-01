// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Schematic, { SchematicProps } from '../../../lib/components/schematic';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const parts: SchematicProps.Part[] = [
  { id: 'deployment', x: 20, y: 20, width: 180, height: 52, label: 'Deployment web', detail: 'replicas: 2' },
  { id: 'pod-a', x: 20, y: 120, width: 52, height: 52, label: 'v1', detail: 'a', size: 'small' },
  { id: 'pod-b', x: 100, y: 120, width: 52, height: 52, label: 'v2', size: 'small' },
];
const wires: SchematicProps.Wire[] = [
  {
    id: 'to-a',
    points: [
      [46, 72],
      [46, 120],
    ],
  },
  {
    id: 'to-b',
    points: [
      [110, 72],
      [110, 96],
      [126, 96],
      [126, 120],
    ],
    junctions: [[110, 96]],
    flow: true,
  },
];

const schematic = () => createWrapper().findSchematic()!;

function renderSchematic(props: Partial<SchematicProps> = {}) {
  return render(<Schematic width={240} height={200} parts={parts} wires={wires} ariaLabel="A deployment" {...props} />);
}

describe('Schematic', () => {
  test('is one image named by its label', () => {
    renderSchematic({ ariaDescribedby: 'step' });
    const image = screen.getByRole('img', { name: 'A deployment' });
    expect(image.tagName.toLowerCase()).toBe('svg');
    expect(image).toHaveAttribute('viewBox', '0 0 240 200');
    expect(image).toHaveAttribute('aria-describedby', 'step');
  });

  test('shows everything when there is no scene', () => {
    renderSchematic();
    expect(schematic().findShownParts()).toHaveLength(3);
    expect(schematic().findWire('to-b')!.isShown()).toBe(true);
  });

  test('shows only what the scene lists, in the state it gives', () => {
    renderSchematic({
      scene: {
        deployment: {},
        'pod-a': { dimmed: true, status: 'removed' },
        'pod-b': { accent: true, status: 'pending' },
        'to-b': {},
      },
    });
    expect(schematic().findPart('deployment')!.isShown()).toBe(true);
    expect(schematic().findPart('pod-a')!.isDimmed()).toBe(true);
    expect(schematic().findPart('pod-a')!.isRemoved()).toBe(true);
    expect(schematic().findPart('pod-b')!.isAccent()).toBe(true);
    expect(schematic().findPart('pod-b')!.isPending()).toBe(true);
    expect(schematic().findWire('to-a')!.isShown()).toBe(false);
    expect(schematic().findWire('to-b')!.isShown()).toBe(true);
  });

  test('keeps hidden parts in the drawing, so they can draw on later', () => {
    const { rerender } = renderSchematic({ scene: { deployment: {} } });
    expect(schematic().findPart('pod-b')!.isShown()).toBe(false);
    const outline = schematic().findPart('pod-b')!.getElement().querySelector('path:nth-of-type(3)');
    rerender(
      <Schematic
        width={240}
        height={200}
        parts={parts}
        wires={wires}
        ariaLabel="A deployment"
        scene={{ 'pod-b': {} }}
      />
    );
    expect(schematic().findPart('pod-b')!.isShown()).toBe(true);
    expect(schematic().findPart('pod-b')!.getElement().querySelector('path:nth-of-type(3)')).toBe(outline);
  });

  test('sets the label and detail of each part', () => {
    renderSchematic();
    expect(schematic().findPart('deployment')!.findLabel()!.getText()).toBe('Deployment web');
    expect(schematic().findPart('deployment')!.findDetail()!.getText()).toBe('replicas: 2');
    expect(schematic().findPart('pod-b')!.findDetail()!.getText()).toBe('');
  });

  test('draws strokes that can draw themselves on', () => {
    renderSchematic();
    const outline = schematic().findPart('deployment')!.getElement().querySelectorAll('path')[2];
    expect(outline).toHaveAttribute('pathLength', '1');
    expect(outline.getAttribute('d')).toBe('M20 20H200V72H20Z');
  });

  test('draws the same parts by hand in the sketch variant, the same way every time', () => {
    const { rerender } = renderSchematic({ variant: 'sketch' });
    const first = schematic().findPart('deployment')!.getElement().querySelectorAll('path')[2].getAttribute('d');
    expect(first).not.toBe('M20 20H200V72H20Z');
    rerender(<Schematic width={240} height={200} parts={[...parts]} wires={wires} ariaLabel="x" variant="sketch" />);
    expect(schematic().findPart('deployment')!.getElement().querySelectorAll('path')[2].getAttribute('d')).toBe(first);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 's', 'data-testid': 'schematic', className: 'custom' } as Partial<SchematicProps>;
    renderSchematic(props);
    const root = screen.getByTestId('schematic');
    expect(root).toHaveAttribute('id', 's');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    for (const variant of ['schematic', 'sketch', 'chalkboard'] as const) {
      const { container, unmount } = renderSchematic({ variant });
      await expectNoAxeViolations(container);
      unmount();
    }
  });
});
