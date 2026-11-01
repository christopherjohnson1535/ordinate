// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import PullQuote, { PullQuoteProps } from '../../../lib/components/pull-quote';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const quote = () => createWrapper().findPullQuote()!;

describe('PullQuote', () => {
  test('renders a figure with a blockquote and the attribution as its caption', () => {
    render(<PullQuote attribution="Tomás Reyes, sail maker">The marsh is the wall now.</PullQuote>);
    expect(screen.getByRole('figure').tagName).toBe('FIGURE');
    expect(quote().findQuote().getElement().tagName).toBe('BLOCKQUOTE');
    expect(quote().findQuote().getText()).toBe('The marsh is the wall now.');
    expect(quote().findAttribution()!.getElement().tagName).toBe('FIGCAPTION');
  });

  test('has no figcaption without an attribution', () => {
    render(<PullQuote>Bread takes the time it takes.</PullQuote>);
    expect(quote().findAttribution()).toBeNull();
  });

  test('only the hanging variant draws the quotation mark, hidden from screen readers', () => {
    render(
      <>
        <PullQuote variant="hanging">Hanging</PullQuote>
        <PullQuote>Default</PullQuote>
      </>
    );
    const [hanging, plain] = createWrapper().findAllPullQuotes();
    expect(hanging.findMark()!.getElement()).toHaveAttribute('aria-hidden', 'true');
    expect(hanging.findQuote().getText()).toBe('Hanging');
    expect(plain.findMark()).toBeNull();
  });

  test('applies a different class for each variant', () => {
    const variants: PullQuoteProps.Variant[] = ['default', 'hanging', 'ruled'];
    render(
      <>
        {variants.map(variant => (
          <PullQuote key={variant} variant={variant}>
            {variant}
          </PullQuote>
        ))}
      </>
    );
    const classNames = createWrapper()
      .findAllPullQuotes()
      .map(wrapper => wrapper.getElement().className);
    expect(new Set(classNames).size).toBe(variants.length);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'quote', 'data-testid': 'quote', className: 'custom' } as PullQuoteProps;
    render(<PullQuote {...props}>Quote</PullQuote>);
    const root = screen.getByTestId('quote');
    expect(root).toHaveAttribute('id', 'quote');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <PullQuote variant="hanging" attribution="Mara Lindqvist">
          We stopped fighting the water.
        </PullQuote>
        <PullQuote variant="ruled">
          <p>Bread takes the time it takes.</p>
          <p>We stopped pretending otherwise.</p>
        </PullQuote>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
