// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import HowItWorks, { HowItWorksProps } from '../../../lib/components/how-it-works';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/how-it-works/styles.css.js';

const steps: HowItWorksProps.Step[] = [
  { title: 'Book a slot', description: 'Pick a time online.' },
  { title: 'Get a quote', description: 'We price the work first.', media: <img src="quote.png" alt="A quote" /> },
  { title: 'Ride home' },
];

const wrapper = () => createWrapper().findHowItWorks()!;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('HowItWorks', () => {
  test('renders an ordered list with a level 3 heading per step', () => {
    render(<HowItWorks steps={steps} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent)).toEqual([
      'Book a slot',
      'Get a quote',
      'Ride home',
    ]);
  });

  test('draws each number for sighted readers only, since the list gives the position', () => {
    render(<HowItWorks steps={steps} />);
    const numbers = wrapper()
      .findSteps()
      .map(step => wrapper().findStepNumber(step));
    expect(numbers.map(number => number.getText())).toEqual(['1', '2', '3']);
    numbers.forEach(number => expect(number.getElement()).toHaveAttribute('aria-hidden', 'true'));
  });

  test('shows descriptions and media only where given', () => {
    render(<HowItWorks steps={steps} />);
    const [first, second, third] = wrapper().findSteps();
    expect(wrapper().findStepDescription(first)!.getText()).toBe('Pick a time online.');
    expect(wrapper().findStepMedia(first)).toBeNull();
    expect(wrapper().findStepMedia(second)!.find('img')!.getElement()).toHaveAccessibleName('A quote');
    expect(wrapper().findStepDescription(third)).toBeNull();
    expect(wrapper().findStepTitle(wrapper().findStep(3)!).getText()).toBe('Ride home');
  });

  test('headingLevel sets the title element, and an invalid level falls back to 3', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(<HowItWorks steps={steps} headingLevel={2} />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    rerender(<HowItWorks steps={steps} headingLevel={0 as HowItWorksProps.HeadingLevel} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('headingLevel'));
  });

  test('orientation sets the layout', () => {
    const { rerender } = render(<HowItWorks steps={steps} />);
    expect(wrapper().getElement()).toHaveClass(styles['orientation-horizontal']);
    rerender(<HowItWorks steps={steps} orientation="vertical" />);
    expect(wrapper().getElement()).toHaveClass(styles['orientation-vertical']);
  });

  test('ariaLabel names the list', () => {
    render(<HowItWorks steps={steps} ariaLabel="How a repair works" />);
    expect(screen.getByRole('list', { name: 'How a repair works' })).toBeInTheDocument();
  });

  test('keyboard focus reaches links inside steps in order', () => {
    render(
      <HowItWorks
        steps={[
          { title: 'Book a slot', description: <a href="#book">Book online</a> },
          { title: 'Ride home', description: <a href="#track">Track your repair</a> },
        ]}
      />
    );
    const links = Array.from(wrapper().getElement().querySelectorAll('a'));
    expect(links.map(link => link.textContent)).toEqual(['Book online', 'Track your repair']);
    links.forEach(link => expect(link).not.toHaveAttribute('tabindex'));
  });

  test('passes id and data attributes to the root', () => {
    render(<HowItWorks steps={steps} id="process" data-testid="process" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'process');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'process');
  });

  test('has no axe violations', async () => {
    const { container } = render(
      <>
        <h2>How a repair works</h2>
        <HowItWorks steps={steps} />
        <HowItWorks steps={steps} orientation="vertical" ariaLabel="Again, stacked" headingLevel={4} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
