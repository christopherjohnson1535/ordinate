// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import StatusIndicator, { StatusIndicatorProps } from '../../../lib/components/status-indicator';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const types: StatusIndicatorProps.Type[] = [
  'error',
  'warning',
  'success',
  'info',
  'stopped',
  'pending',
  'in-progress',
  'loading',
];

describe('StatusIndicator', () => {
  test('renders its text next to a decorative icon', () => {
    render(<StatusIndicator type="error">3 failed checks</StatusIndicator>);
    const indicator = createWrapper().findStatusIndicator()!;
    expect(indicator.findText().getText()).toBe('3 failed checks');
    expect(indicator.findStatusIcon().getElement()).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('names the icon with iconAriaLabel', () => {
    render(
      <StatusIndicator type="warning" iconAriaLabel="Warning">
        2 minutes ago
      </StatusIndicator>
    );
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  test.each(types.filter(type => type !== 'loading'))('shows an icon for %s', type => {
    render(<StatusIndicator type={type}>Status</StatusIndicator>);
    const indicator = createWrapper().findStatusIndicator()!;
    expect(indicator.findStatusIcon().findIcon()).not.toBeNull();
    expect(indicator.findStatusIcon().findSpinner()).toBeNull();
  });

  test('shows a spinner for loading', () => {
    render(<StatusIndicator type="loading">Loading</StatusIndicator>);
    const indicator = createWrapper().findStatusIndicator()!;
    expect(indicator.findStatusIcon().findSpinner()).not.toBeNull();
  });

  test('colorOverride changes the color but not the icon', () => {
    render(
      <>
        <StatusIndicator type="success">Plain</StatusIndicator>
        <StatusIndicator type="success" colorOverride="grey">
          Overridden
        </StatusIndicator>
      </>
    );
    const [plain, overridden] = createWrapper().findAllStatusIndicators();
    expect(plain.getElement().className).not.toBe(overridden.getElement().className);
    expect(overridden.findStatusIcon().getElement().innerHTML).toBe(plain.findStatusIcon().getElement().innerHTML);
  });

  test('wrapText false adds a class that keeps the text on one line', () => {
    render(
      <>
        <StatusIndicator>Wraps</StatusIndicator>
        <StatusIndicator wrapText={false}>Truncates</StatusIndicator>
      </>
    );
    const [wrapping, truncating] = createWrapper().findAllStatusIndicators();
    expect(wrapping.getElement().className).not.toBe(truncating.getElement().className);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'state', 'data-testid': 'status', className: 'custom' } as StatusIndicatorProps;
    render(<StatusIndicator {...props}>Running</StatusIndicator>);
    const indicator = screen.getByTestId('status');
    expect(indicator).toHaveAttribute('id', 'state');
    expect(indicator).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        {types.map(type => (
          <StatusIndicator key={type} type={type}>
            {type}
          </StatusIndicator>
        ))}
        <StatusIndicator type="error" iconAriaLabel="Error">
          Yesterday
        </StatusIndicator>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
