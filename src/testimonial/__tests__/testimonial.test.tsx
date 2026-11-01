// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Media from '../../../lib/components/media';
import createWrapper from '../../../lib/components/test-utils/dom';
import Testimonial, { TestimonialProps } from '../../../lib/components/testimonial';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const testimonial = () => createWrapper().findTestimonial()!;

describe('Testimonial', () => {
  test('renders the quote in a blockquote and the person in the caption', () => {
    render(
      <Testimonial
        quote="Back the same afternoon."
        name="Priya S."
        detail="Riverside"
        media={<Media src="/priya.jpg" alt="" aspectRatio="1:1" />}
      />
    );
    expect(screen.getByRole('figure')).toBeInTheDocument();
    expect(testimonial().findQuote().getElement().tagName).toBe('BLOCKQUOTE');
    expect(testimonial().findQuote().getText()).toBe('Back the same afternoon.');
    expect(testimonial().findName()!.getText()).toBe('Priya S.');
    expect(testimonial().findDetail()!.getText()).toBe('Riverside');
    expect(testimonial().findMedia()!.findAllMedias()).toHaveLength(1);
  });

  test('the quotation mark is hidden from screen readers', () => {
    const { container } = render(<Testimonial quote="Honest advice." />);
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0].textContent).toBe('“');
  });

  test('has no caption without a name, detail or picture', () => {
    const { container } = render(<Testimonial quote="Honest advice." />);
    expect(container.querySelector('figcaption')).toBeNull();
    expect(testimonial().findName()).toBeNull();
  });

  test('applies a different class for each tone', () => {
    render(
      <>
        <Testimonial quote="One" />
        <Testimonial quote="Two" tone="accent" />
      </>
    );
    const [plain, accent] = createWrapper().findAllTestimonials();
    expect(plain.getElement().className).not.toBe(accent.getElement().className);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'review', 'data-testid': 'review', className: 'custom' } as unknown as TestimonialProps;
    render(<Testimonial {...props} quote="Quote" />);
    const root = screen.getByTestId('review');
    expect(root).toHaveAttribute('id', 'review');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Testimonial
          quote="Back the same afternoon."
          name="Priya S."
          detail="Riverside"
          media={<Media src="/priya.jpg" alt="" aspectRatio="1:1" />}
        />
        <Testimonial tone="accent" quote={<p>The best sourdough around.</p>} name="Sam O." />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
