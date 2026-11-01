// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Header from '../../../lib/components/header';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Header', () => {
  test('renders an h2 by default', () => {
    render(<Header>Nodes</Header>);
    expect(screen.getByRole('heading', { level: 2, name: 'Nodes' })).toBeInTheDocument();
  });

  test.each([
    ['h1', 1],
    ['h2', 2],
    ['h3', 3],
  ] as const)('renders the %s variant as a level %i heading', (variant, level) => {
    render(<Header variant={variant}>Nodes</Header>);
    expect(screen.getByRole('heading', { level })).toBeInTheDocument();
  });

  test('headingTagOverride changes the element', () => {
    render(
      <Header variant="h2" headingTagOverride="h4">
        Nodes
      </Header>
    );
    expect(screen.getByRole('heading', { level: 4, name: 'Nodes' })).toBeInTheDocument();
  });

  test('headingTagOverride div removes the heading', () => {
    render(<Header headingTagOverride="div">Nodes</Header>);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  test('includes the counter in the heading name and keeps info outside', () => {
    render(
      <Header counter="(12)" info={<a href="#help">Info</a>}>
        Nodes
      </Header>
    );
    expect(screen.getByRole('heading', { name: 'Nodes (12)' })).toBeInTheDocument();
    expect(screen.getByRole('heading')).not.toContainElement(screen.getByRole('link', { name: 'Info' }));
  });

  test('shows the code above the heading, outside the heading name', () => {
    render(
      <Header variant="h1" code="Sheet A-02" counter="(4)">
        Service schedule
      </Header>
    );
    const header = createWrapper().findHeader()!;
    expect(header.findCode()!.getText()).toBe('Sheet A-02');
    expect(screen.getByRole('heading', { level: 1, name: 'Service schedule (4)' })).toBeInTheDocument();
    expect(screen.getByRole('heading')).not.toContainElement(header.findCode()!.getElement());
  });

  test('renders no code element without a code', () => {
    render(<Header>Nodes</Header>);
    expect(createWrapper().findHeader()!.findCode()).toBeNull();
  });

  test('passes id and data attributes', () => {
    render(
      <Header id="nodes-header" data-testid="nodes">
        Nodes
      </Header>
    );
    expect(createWrapper().findHeader()!.getElement()).toHaveAttribute('id', 'nodes-header');
    expect(screen.getByTestId('nodes')).toBeInTheDocument();
  });
});

describe('Header test utilities and accessibility', () => {
  test('the wrapper reads every part', () => {
    render(
      <Header
        variant="h1"
        code="Sheet A-02"
        counter="(12)"
        info={<a href="#help">Info</a>}
        description="Machines in this project."
        actions={<button>Add node</button>}
      >
        Nodes
      </Header>
    );
    const header = createWrapper().findHeader()!;
    expect(header.findHeadingText().getText()).toBe('Nodes');
    expect(header.findCounter()!.getText()).toBe('(12)');
    expect(header.findInfo()!.getText()).toBe('Info');
    expect(header.findDescription()!.getText()).toBe('Machines in this project.');
    expect(header.findActions()!.getText()).toBe('Add node');
  });

  test('optional parts are absent when not set', () => {
    render(<Header>Nodes</Header>);
    const header = createWrapper().findHeader()!;
    expect(header.findCounter()).toBeNull();
    expect(header.findInfo()).toBeNull();
    expect(header.findDescription()).toBeNull();
    expect(header.findActions()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Header
        variant="h1"
        code="Sheet A-02"
        counter="(12)"
        info={<a href="#help">Info</a>}
        description="Machines in this project."
        actions={<button>Add node</button>}
      >
        Nodes
      </Header>
    );
    await expectNoAxeViolations(container);
  });
});
