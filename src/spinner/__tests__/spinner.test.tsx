// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Spinner, { SpinnerProps } from '../../../lib/components/spinner';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Spinner', () => {
  test('is hidden from assistive technology', () => {
    render(<Spinner />);
    const spinner = createWrapper().findSpinner()!.getElement();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner.querySelector('svg')).toHaveAttribute('focusable', 'false');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'loading', 'data-testid': 'spinner', className: 'custom' } as SpinnerProps;
    render(<Spinner {...props} />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveAttribute('id', 'loading');
    expect(spinner).not.toHaveClass('custom');
  });

  test('applies a different class for each size and variant', () => {
    render(
      <>
        <Spinner size="normal" />
        <Spinner size="big" />
        <Spinner size="large" variant="inverted" />
        <Spinner variant="disabled" />
      </>
    );
    const classNames = createWrapper()
      .findAllSpinners()
      .map(spinner => spinner.getElement().className);
    expect(new Set(classNames).size).toBe(4);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <p>
        <Spinner /> Loading instances
      </p>
    );
    await expectNoAxeViolations(container);
  });
});
