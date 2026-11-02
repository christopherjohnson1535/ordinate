// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import StatusIndicator, { StatusIndicatorProps } from '../../../lib/components/status-indicator';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const states: StatusIndicatorProps.State[] = [
  'complete',
  'caution',
  'fault',
  'note',
  'underway',
  'waiting',
  'halted',
  'queued',
  'loading',
];

describe('StatusIndicator', () => {
  test('renders its text next to a decorative icon', () => {
    render(<StatusIndicator state="fault">3 failed checks</StatusIndicator>);
    const indicator = createWrapper().findStatusIndicator()!;
    expect(indicator.findText().getText()).toBe('3 failed checks');
    expect(indicator.findStatusIcon().getElement()).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('names the icon with iconAriaLabel', () => {
    render(
      <StatusIndicator state="caution" iconAriaLabel="Warning">
        2 minutes ago
      </StatusIndicator>
    );
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  test.each(states.filter(state => state !== 'loading'))('shows an icon for %s', state => {
    render(<StatusIndicator state={state}>Status</StatusIndicator>);
    const indicator = createWrapper().findStatusIndicator()!;
    expect(indicator.findStatusIcon().findIcon()).not.toBeNull();
    expect(indicator.findStatusIcon().findSpinner()).toBeNull();
  });

  test('shows a spinner for loading', () => {
    render(<StatusIndicator state="loading">Loading</StatusIndicator>);
    const indicator = createWrapper().findStatusIndicator()!;
    expect(indicator.findStatusIcon().findSpinner()).not.toBeNull();
  });

  test('keeps the text in ink and colors only the mark', () => {
    render(
      <>
        <StatusIndicator state="complete">Running</StatusIndicator>
        <StatusIndicator state="fault">Failed</StatusIndicator>
      </>
    );
    const [complete, fault] = createWrapper().findAllStatusIndicators();
    expect(complete.getElement().className).toBe(fault.getElement().className);
    expect(complete.findStatusIcon().getElement().className).not.toBe(fault.findStatusIcon().getElement().className);
  });

  test('tone changes the color of the mark but not its shape', () => {
    render(
      <>
        <StatusIndicator state="complete">Plain</StatusIndicator>
        <StatusIndicator state="complete" tone="neutral">
          Overridden
        </StatusIndicator>
      </>
    );
    const [plain, overridden] = createWrapper().findAllStatusIndicators();
    expect(plain.findStatusIcon().getElement().className).not.toBe(overridden.findStatusIcon().getElement().className);
    expect(overridden.findStatusIcon().getElement().innerHTML).toBe(plain.findStatusIcon().getElement().innerHTML);
  });

  test('still accepts the old type and colorOverride, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <>
        <StatusIndicator type="success" colorOverride="grey">
          Old
        </StatusIndicator>
        <StatusIndicator state="complete" tone="neutral">
          New
        </StatusIndicator>
      </>
    );
    const [legacy, current] = createWrapper().findAllStatusIndicators();
    expect(legacy.findStatusIcon().getElement().outerHTML).toBe(current.findStatusIcon().getElement().outerHTML);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"success" is now called "complete"'));
    warn.mockRestore();
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
        {states.map(state => (
          <StatusIndicator key={state} state={state}>
            {state}
          </StatusIndicator>
        ))}
        <StatusIndicator state="fault" iconAriaLabel="Error">
          Yesterday
        </StatusIndicator>
      </>
    );
    await expectNoAxeViolations(container);
  });
});
