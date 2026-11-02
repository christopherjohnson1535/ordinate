// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Badge, { BadgeProps } from '../../../lib/components/badge';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const tones: BadgeProps.Tone[] = ['neutral', 'note', 'complete', 'fault', 'critical', 'high', 'medium', 'low'];

describe('Badge', () => {
  test('renders its text', () => {
    render(<Badge>Beta</Badge>);
    expect(createWrapper().findBadge()!.getText()).toBe('Beta');
  });

  test('is neutral by default', () => {
    render(
      <>
        <Badge>Default</Badge>
        <Badge tone="neutral">Neutral</Badge>
      </>
    );
    const [defaultBadge, neutralBadge] = createWrapper().findAllBadges();
    expect(defaultBadge.getElement().className).toBe(neutralBadge.getElement().className);
  });

  test('draws its key square as decoration only', () => {
    render(<Badge tone="complete">Ready</Badge>);
    const key = createWrapper().findBadge()!.getElement().firstElementChild!;
    expect(key).toHaveAttribute('aria-hidden', 'true');
    expect(key.textContent).toBe('');
  });

  test('still accepts the old color, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <>
        <Badge color="severity-high">Old</Badge>
        <Badge tone="high">New</Badge>
      </>
    );
    const [legacy, current] = createWrapper().findAllBadges();
    expect(legacy.getElement().className).toBe(current.getElement().className);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"severity-high" is "high"'));
    warn.mockRestore();
  });

  test('applies a different class for each tone', () => {
    render(
      <>
        {tones.map(tone => (
          <Badge key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
      </>
    );
    const classNames = createWrapper()
      .findAllBadges()
      .map(badge => badge.getElement().className);
    expect(new Set(classNames).size).toBe(tones.length);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'count', 'data-testid': 'badge', className: 'custom' } as BadgeProps;
    render(<Badge {...props}>12</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('id', 'count');
    expect(badge).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        {tones.map(tone => (
          <Badge key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
      </>
    );
    await expectNoAxeViolations(container);
  });
});
