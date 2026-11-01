// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import CallToAction from '../../../lib/components/call-to-action';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('CallToAction', () => {
  test('renders a level 2 heading, the description and the actions', () => {
    render(
      <CallToAction
        heading="Book a table for Friday"
        description="We keep a few tables for walk-ins."
        actions={<button>Book a table</button>}
      />
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Book a table for Friday' })).toBeInTheDocument();
    expect(screen.getByText('We keep a few tables for walk-ins.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Book a table' })).toBeInTheDocument();
  });

  test('headingLevel sets the heading element', () => {
    render(<CallToAction heading="Subscribe" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Subscribe' })).toBeInTheDocument();
  });

  test('is not a landmark', () => {
    render(<CallToAction heading="Subscribe" />);
    expect(screen.queryByRole('region')).toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  test('renders children where the actions go, such as a sign-up form', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <CallToAction heading="The Thursday letter">
        <form aria-label="Subscribe" onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" />
          </label>
          <button type="submit">Subscribe</button>
        </form>
      </CallToAction>
    );
    const callToAction = createWrapper().findCallToAction()!;
    expect(callToAction.findContent()!.getElement()).toContainElement(screen.getByRole('form'));
    expect(callToAction.findActions()).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('renders both children and actions when given both', () => {
    render(
      <CallToAction heading="Visit" actions={<a href="#map">Directions</a>}>
        <p>12 Shore Road</p>
      </CallToAction>
    );
    const callToAction = createWrapper().findCallToAction()!;
    expect(callToAction.findContent()!.getText()).toBe('12 Shore Road');
    expect(callToAction.findActions()!.getText()).toBe('Directions');
  });

  test.each(['inverted', 'accent', 'default'] as const)('renders the %s tone', tone => {
    render(<CallToAction tone={tone} heading="Subscribe" actions={<button>Subscribe</button>} />);
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  test('passes id and data attributes and ignores styling props', () => {
    const styling = { className: 'custom' } as Record<string, unknown>;
    render(<CallToAction id="subscribe" data-testid="cta" heading="Subscribe" {...styling} />);
    const root = createWrapper().findCallToAction()!.getElement();
    expect(root).toHaveAttribute('id', 'subscribe');
    expect(root).toHaveAttribute('data-testid', 'cta');
    expect(root).not.toHaveClass('custom');
  });

  test('optional parts are absent when not set', () => {
    render(<CallToAction heading="Subscribe" />);
    const callToAction = createWrapper().findCallToAction()!;
    expect(callToAction.findHeading()!.getText()).toBe('Subscribe');
    expect(callToAction.findDescription()).toBeNull();
    expect(callToAction.findActions()).toBeNull();
    expect(callToAction.findContent()).toBeNull();
  });
});

describe('CallToAction accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <CallToAction heading="The Thursday letter" description="One garden, one recipe, every week.">
        <form aria-label="Subscribe">
          <label>
            Email
            <input type="email" />
          </label>
          <button type="submit">Subscribe</button>
        </form>
      </CallToAction>
    );
    await expectNoAxeViolations(container);
  });
});
