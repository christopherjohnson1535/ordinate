// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Container from '../../../lib/components/container';
import Header from '../../../lib/components/header';
import createWrapper, { HeaderWrapper } from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/container/styles.css.js';

describe('Container', () => {
  test('renders only the content when there is no header or footer', () => {
    render(<Container>Content</Container>);
    const container = createWrapper().findContainer()!;
    expect(container.findContent().getText()).toBe('Content');
    expect(container.findHeader()).toBeNull();
    expect(container.findFooter()).toBeNull();
  });

  test.each([
    ['disableHeaderPaddings', 'findHeader'],
    ['disableContentPaddings', 'findContent'],
    ['disableFooterPaddings', 'findFooter'],
  ] as const)('%s removes the padding of that part', (prop, finder) => {
    render(
      <Container header="Header" footer="Footer" {...{ [prop]: true }}>
        Content
      </Container>
    );
    const container = createWrapper().findContainer()!;
    expect(container[finder]()!.getElement()).toHaveClass(styles['no-paddings']);
    const others = (['findHeader', 'findContent', 'findFooter'] as const).filter(name => name !== finder);
    others.forEach(name => expect(container[name]()!.getElement()).not.toHaveClass(styles['no-paddings']));
  });

  test('draws a plain text header as a sheet label', () => {
    render(<Container header="Environment">Content</Container>);
    const container = createWrapper().findContainer()!;
    expect(container.findHeaderLabel()!.getText()).toBe('Environment');
    expect(container.findHeader()!.getText()).toBe('Environment');
  });

  test('keeps a Header component as it is', () => {
    render(<Container header={<Header>Usage</Header>}>Content</Container>);
    const container = createWrapper().findContainer()!;
    expect(container.findHeaderLabel()).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Usage' })).toBeInTheDocument();
  });

  test('applies fitHeight and the variant', () => {
    render(
      <Container fitHeight={true} variant="stacked">
        Content
      </Container>
    );
    expect(createWrapper().findContainer()!.getElement()).toHaveClass(styles['fit-height'], styles['variant-stacked']);
  });

  test('passes id and data attributes', () => {
    render(
      <Container id="usage" data-testid="usage">
        Content
      </Container>
    );
    expect(screen.getByTestId('usage')).toHaveAttribute('id', 'usage');
  });
});

describe('Container test utilities and accessibility', () => {
  test('the wrapper reads every part and reaches a nested header', () => {
    render(
      <Container header={<Header description="Last 30 days.">Usage</Header>} footer="Updated hourly.">
        <Container>Nested content</Container>
      </Container>
    );
    const [outer, inner] = createWrapper().findAllContainers();
    expect(outer.findHeader()!.findComponent(HeaderWrapper)!.findHeadingText().getText()).toBe('Usage');
    expect(outer.findFooter()!.getText()).toBe('Updated hourly.');
    expect(outer.findContent().getText()).toBe('Nested content');
    expect(inner.findHeader()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Container header={<Header actions={<button>Export</button>}>Usage</Header>} footer={<a href="#all">View all</a>}>
        <p>12 nodes are running.</p>
      </Container>
    );
    await expectNoAxeViolations(container);
  });
});
