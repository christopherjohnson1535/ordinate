// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Section from '../../../lib/components/section';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Section', () => {
  test('renders a section element with a level 2 heading by default', () => {
    const { container } = render(<Section heading="Opening hours">Monday to Saturday, 8 to 6.</Section>);
    expect(container.querySelector('section')).toBe(createWrapper().findSection()!.getElement());
    expect(screen.getByRole('heading', { level: 2, name: 'Opening hours' })).toBeInTheDocument();
    expect(screen.getByText('Monday to Saturday, 8 to 6.')).toBeInTheDocument();
  });

  test('does not turn every section into a landmark', () => {
    render(<Section heading="Opening hours">Text</Section>);
    expect(screen.queryByRole('region')).toBeNull();
  });

  test.each([1, 3, 4, 5, 6] as const)('headingLevel %i sets the heading element', level => {
    render(<Section heading="Menu" headingLevel={level} />);
    expect(screen.getByRole('heading', { level, name: 'Menu' })).toBeInTheDocument();
  });

  test('falls back to a level 2 heading for a level outside 1 to 6', () => {
    render(<Section heading="Menu" headingLevel={9 as 2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Menu' })).toBeInTheDocument();
  });

  test('passes id for in-page links and data attributes', () => {
    render(
      <Section id="menu" data-testid="menu-section" heading="Menu">
        Bread
      </Section>
    );
    const root = createWrapper().findSection()!.getElement();
    expect(root).toHaveAttribute('id', 'menu');
    expect(root).toHaveAttribute('data-testid', 'menu-section');
  });

  test('ignores styling props', () => {
    const props = { className: 'custom', style: { color: 'red' } } as Record<string, unknown>;
    render(<Section heading="Menu" {...props} />);
    const root = createWrapper().findSection()!.getElement();
    expect(root).not.toHaveClass('custom');
    expect(root).not.toHaveAttribute('style');
  });

  test('renders the content without a header when there is no heading, description or actions', () => {
    render(<Section>Only content</Section>);
    const section = createWrapper().findSection()!;
    expect(section.findHeading()).toBeNull();
    expect(section.findDescription()).toBeNull();
    expect(section.findActions()).toBeNull();
    expect(section.findContent()!.getText()).toBe('Only content');
  });

  test.each(['default', 'accent', 'inverted'] as const)('renders the %s tone', tone => {
    render(
      <Section tone={tone} heading="Studio" description="Two architects and a model maker.">
        <a href="#work">See the work</a>
      </Section>
    );
    expect(screen.getByRole('heading', { name: 'Studio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the work' })).toBeInTheDocument();
  });

  test('draws the double rule as decoration only', () => {
    const { container } = render(<Section rule="double" heading="Essays" />);
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toBeEmptyDOMElement();
  });

  test.each(['none', 'top', 'bottom'] as const)('rule %s adds no extra elements', rule => {
    const { container } = render(<Section rule={rule} heading="Essays" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});

describe('Section test utilities and accessibility', () => {
  const full = (
    <Section
      heading="Recent work"
      description="Houses, sheds and one boathouse."
      actions={<a href="#all">See all projects</a>}
      tone="inverted"
      width="wide"
      spacing="large"
      rule="double"
    >
      <p>Three projects finished this year.</p>
    </Section>
  );

  test('the wrapper reads every part', () => {
    render(full);
    const section = createWrapper().findSection()!;
    expect(section.findHeading()!.getText()).toBe('Recent work');
    expect(section.findDescription()!.getText()).toBe('Houses, sheds and one boathouse.');
    expect(section.findActions()!.getText()).toBe('See all projects');
    expect(section.findContent()!.getText()).toBe('Three projects finished this year.');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(full);
    await expectNoAxeViolations(container);
  });
});
