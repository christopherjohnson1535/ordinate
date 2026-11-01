// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import Icon from '../../../lib/components/icon';
import createWrapper from '../../../lib/components/test-utils/dom';
import Token from '../../../lib/components/token';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const token = () => createWrapper().findToken()!;

describe('Token', () => {
  test('shows the label, label tag, description, tags and icon', () => {
    render(
      <Token
        label="US East"
        labelTag="us-east-1"
        description="Virginia"
        tags={['3 zones', 'Default']}
        icon={<Icon name="globe" />}
      />
    );
    expect(token().findLabel().getText()).toBe('US East');
    expect(token().findLabelTag()!.getText()).toBe('us-east-1');
    expect(token().findDescription()!.getText()).toBe('Virginia');
    expect(
      token()
        .findTags()
        .map(tag => tag.getText())
    ).toEqual(['3 zones', 'Default']);
    expect(token().findIconSlot()).not.toBeNull();
  });

  test('has a dismiss button only with onDismiss, and fires it on click', () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Token label="US East" />);
    expect(token().findDismissButton()).toBeNull();
    rerender(<Token label="US East" onDismiss={onDismiss} dismissLabel="Remove US East" />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove US East' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('the dismiss button works from the keyboard', () => {
    const onDismiss = vi.fn();
    render(<Token label="US East" onDismiss={onDismiss} />);
    const button = screen.getByRole('button', { name: 'Remove' });
    act(() => button.focus());
    expect(button).toHaveFocus();
    // Native buttons turn Enter and Space into clicks.
    fireEvent.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('disabled and read-only tokens cannot be dismissed', () => {
    const { rerender } = render(<Token label="US East" disabled={true} onDismiss={() => {}} />);
    expect(token().findDismissButton()).toBeNull();
    expect(token().isDisabled()).toBe(true);
    rerender(<Token label="US East" readOnly={true} onDismiss={() => {}} />);
    expect(token().findDismissButton()).toBeNull();
    expect(token().isDisabled()).toBe(false);
  });

  test('the inline variant shows only the label and icon', () => {
    render(<Token variant="inline" label="report.pdf" description="Not shown" tags={['Not shown']} />);
    expect(token().findLabel().getText()).toBe('report.pdf');
    expect(token().findDescription()).toBeNull();
    expect(token().findTags()).toHaveLength(0);
  });

  test('the inline variant can sit inside a paragraph', () => {
    const { container } = render(
      <p>
        Attached <Token variant="inline" label="report.pdf" icon={<Icon name="file" />} onDismiss={() => {}} />
      </p>
    );
    expect(container.querySelector('p div')).toBeNull();
  });

  test('passes id and data attributes to the root', () => {
    render(<Token id="region" data-testid="region" label="US East" />);
    expect(token().getElement()).toHaveAttribute('id', 'region');
    expect(token().getElement()).toHaveAttribute('data-testid', 'region');
  });
});

describe('Inline token tooltip', () => {
  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollWidth');
  });

  test('shows tooltipContent when the label is cut', () => {
    vi.useFakeTimers();
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, get: () => 400 });
    render(<Token variant="inline" label="report.pdf" tooltipContent="/home/reports/2026/report.pdf" />);
    const label = screen.getByText('report.pdf');
    expect(label).toHaveAccessibleDescription('/home/reports/2026/report.pdf');
    act(() => label.focus());
    expect(screen.getByRole('tooltip')).toHaveTextContent('/home/reports/2026/report.pdf');
  });
});

describe('Token accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Token label="US East" description="Virginia" tags={['3 zones']} onDismiss={() => {}} />
        <Token label="EU Central" disabled={true} />
        <Token variant="inline" label="report.pdf" icon={<Icon name="file" />} onDismiss={() => {}} />
      </div>
    );
    await expectNoAxeViolations(container);
  });
});
