// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Container from '../../../lib/components/container';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/container/styles.css.js';

const container = () => createWrapper().findContainer()!;

describe('Container', () => {
  test('renders only the content when nothing else is given', () => {
    render(<Container>Content</Container>);
    expect(container().findContent().getText()).toBe('Content');
    expect(container().findHeading()).toBeNull();
    expect(container().findMeasure()).toBeNull();
    expect(container().findActions()).toBeNull();
    expect(container().findFooter()).toBeNull();
    expect(container().getElement().querySelector(`.${styles.layout}`)).toHaveClass(styles['no-margin']);
  });

  test('sets the reference, heading and description in the margin', () => {
    render(
      <Container reference="R1" heading="Services" description="Showing 4 of 7.">
        Content
      </Container>
    );
    expect(container().findReference()!.getText()).toBe('R1');
    expect(container().findHeading()!.getText()).toBe('Services');
    expect(container().findDescription()!.getText()).toBe('Showing 4 of 7.');
    expect(container().getElement().querySelector(`.${styles.layout}`)).not.toHaveClass(styles['no-margin']);
  });

  test('labels the section with its heading, at level 2 by default', () => {
    const { rerender } = render(<Container heading="Services">Content</Container>);
    expect(screen.getByRole('region', { name: 'Services' })).toBe(container().getElement());
    expect(screen.getByRole('heading', { level: 2, name: 'Services' })).toBeInTheDocument();
    rerender(
      <Container heading="Services" headingLevel={3}>
        Content
      </Container>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Services' })).toBeInTheDocument();
  });

  test('is not a region without a heading', () => {
    render(<Container reference="R1">Content</Container>);
    expect(screen.queryByRole('region')).toBeNull();
  });

  test('draws the measure as a dimension line and keeps its label readable', () => {
    render(<Container measure="7 services">Content</Container>);
    expect(container().findMeasure()!.getText()).toBe('7 services');
    expect(screen.getByText('7 services')).not.toHaveAttribute('aria-hidden');
  });

  test('renders actions and footer', () => {
    render(
      <Container actions={<button>Deploy</button>} footer={<a href="#all">Show all 7 services</a>}>
        Content
      </Container>
    );
    expect(container().findActions()!.getText()).toBe('Deploy');
    expect(container().findFooter()!.getText()).toBe('Show all 7 services');
  });

  test.each(['configuration', 'resource', 'policy', 'neutral'] as const)('applies the %s kind', kind => {
    render(<Container kind={kind}>Content</Container>);
    expect(container().getElement()).toHaveClass(styles[`kind-${kind}`]);
  });

  test('is neutral by default and applies fitHeight', () => {
    render(<Container fitHeight={true}>Content</Container>);
    expect(container().getElement()).toHaveClass(styles['kind-neutral'], styles['fit-height']);
  });

  test('keeps the drawing marks out of the accessibility tree', () => {
    render(
      <Container heading="Services" footer="Note">
        Content
      </Container>
    );
    const marks = container()
      .getElement()
      .querySelectorAll(`.${styles.mark}, .${styles['top-line']}, .${styles['side-line']}`);
    expect(marks.length).toBeGreaterThan(0);
    marks.forEach(mark => expect(mark).toHaveAttribute('aria-hidden', 'true'));
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
  test('the wrapper reads every part and stops at a nested container', () => {
    render(
      <Container heading="Usage" measure="3 zones" footer="Updated hourly.">
        <Container>Nested content</Container>
      </Container>
    );
    const [outer, inner] = createWrapper().findAllContainers();
    expect(outer.findHeading()!.getText()).toBe('Usage');
    expect(outer.findMeasure()!.getText()).toBe('3 zones');
    expect(outer.findFooter()!.getText()).toBe('Updated hourly.');
    expect(outer.findContent().getText()).toBe('Nested content');
    expect(inner.findHeading()).toBeNull();
    expect(inner.findFooter()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container: root } = render(
      <Container
        kind="resource"
        reference="R1"
        heading="Usage"
        description="Last 30 days."
        measure="12 nodes"
        actions={<button>Export</button>}
        footer={<a href="#all">View all</a>}
      >
        <p>12 nodes are running.</p>
      </Container>
    );
    await expectNoAxeViolations(root);
  });
});
