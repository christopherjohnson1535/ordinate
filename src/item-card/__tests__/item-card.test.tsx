// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Button from '../../../lib/components/button';
import Checkbox from '../../../lib/components/checkbox';
import ItemCard from '../../../lib/components/item-card';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import marksStyles from '../../../lib/components/internal/components/crop-marks/styles.css.js';

const card = () => createWrapper().findItemCard()!;

describe('ItemCard', () => {
  test('renders each slot in its place', () => {
    render(
      <ItemCard
        header="node-01"
        description="Compute node"
        footer="Updated 2 minutes ago"
        actions={<Button variant="icon" iconName="more" ariaLabel="Actions for node-01" />}
        media={<img src="rack.svg" alt="Rack elevation" />}
        selectionControl={<Checkbox checked={false} ariaLabel="Select node-01" />}
      >
        Running for 720 hours.
      </ItemCard>
    );
    expect(card().findHeader()!.getText()).toBe('node-01');
    expect(card().findDescription()!.getText()).toBe('Compute node');
    expect(card().findContent()!.getText()).toBe('Running for 720 hours.');
    expect(card().findFooter()!.getText()).toBe('Updated 2 minutes ago');
    expect(card().findActions()!.find('button')).not.toBeNull();
    expect(card().findMedia()!.find('img')).not.toBeNull();
    expect(card().findSelectionControl()!.find('input[type="checkbox"]')).not.toBeNull();
  });

  test('leaves out empty slots', () => {
    render(<ItemCard>Only content.</ItemCard>);
    expect(card().findHeader()).toBeNull();
    expect(card().findDescription()).toBeNull();
    expect(card().findFooter()).toBeNull();
    expect(card().findActions()).toBeNull();
    expect(card().findMedia()).toBeNull();
    expect(card().findSelectionControl()).toBeNull();
  });

  test('marks selected and disabled cards', () => {
    const { rerender } = render(<ItemCard header="node-01" />);
    expect(card().isSelected()).toBe(false);
    expect(card().isDisabled()).toBe(false);
    rerender(<ItemCard header="node-01" selected={true} disabled={true} />);
    expect(card().isSelected()).toBe(true);
    expect(card().isDisabled()).toBe(true);
  });

  test('the embedded variant gets its own class', () => {
    render(<ItemCard header="node-01" variant="embedded" />);
    expect(card().getElement().className).toMatch(/variant-embedded/);
  });

  test('controls inside the card stay in the tab order', () => {
    render(
      <ItemCard header="node-01" actions={<Button ariaLabel="Restart">Restart</Button>}>
        <a href="#node-01">Open</a>
      </ItemCard>
    );
    const focusables = [screen.getByRole('button', { name: 'Restart' }), screen.getByRole('link', { name: 'Open' })];
    for (const element of focusables) {
      element.focus();
      expect(element).toHaveFocus();
    }
  });

  test('passes id and data attributes to the root', () => {
    render(<ItemCard id="node" data-testid="node" header="node-01" />);
    expect(card().getElement()).toHaveAttribute('id', 'node');
    expect(card().getElement()).toHaveAttribute('data-testid', 'node');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <ItemCard
        header="node-01"
        description="Compute node"
        footer="Updated 2 minutes ago"
        selected={true}
        selectionControl={<Checkbox checked={true} ariaLabel="Select node-01" />}
        media={<img src="rack.svg" alt="" />}
      >
        Running.
      </ItemCard>
    );
    await expectNoAxeViolations(container);
  });

  test('draws corner marks in place of a border, hidden from assistive technology', () => {
    const { rerender } = render(<ItemCard header="node-01" kind="resource" />);
    const marks = card().findByClassName(marksStyles.root)!.getElement();
    expect(marks).toHaveAttribute('aria-hidden', 'true');
    expect(marks).toHaveClass(marksStyles['kind-resource']);
    expect(marks).not.toHaveClass(marksStyles.selected);
    rerender(<ItemCard header="node-01" kind="resource" selected={true} />);
    expect(card().findByClassName(marksStyles.root)!.getElement()).toHaveClass(marksStyles.selected);
  });

  test('the embedded variant has no marks', () => {
    render(<ItemCard header="node-01" variant="embedded" />);
    expect(card().findByClassName(marksStyles.root)).toBeNull();
  });

  test('shows the reference at the end of the header row', () => {
    const { rerender } = render(<ItemCard header="node-01" />);
    expect(card().findReference()).toBeNull();
    rerender(<ItemCard header="node-01" reference="R1" kind="resource" />);
    expect(card().findReference()!.getText()).toBe('R1');
  });
});
