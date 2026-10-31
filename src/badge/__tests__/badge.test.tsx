// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Badge, { BadgeProps } from '../../../lib/components/badge';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const colors: BadgeProps.Color[] = [
  'grey',
  'blue',
  'green',
  'red',
  'severity-critical',
  'severity-high',
  'severity-medium',
  'severity-low',
  'severity-neutral',
];

describe('Badge', () => {
  test('renders its text', () => {
    render(<Badge>Beta</Badge>);
    expect(createWrapper().findBadge()!.getText()).toBe('Beta');
  });

  test('uses grey by default', () => {
    render(
      <>
        <Badge>Default</Badge>
        <Badge color="grey">Grey</Badge>
      </>
    );
    const [defaultBadge, greyBadge] = createWrapper().findAllBadges();
    expect(defaultBadge.getElement().className).toBe(greyBadge.getElement().className);
  });

  test('applies a different class for each color', () => {
    render(
      <>
        {colors.map(color => (
          <Badge key={color} color={color}>
            {color}
          </Badge>
        ))}
      </>
    );
    const classNames = createWrapper()
      .findAllBadges()
      .map(badge => badge.getElement().className);
    expect(new Set(classNames).size).toBe(colors.length);
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
        {colors.map(color => (
          <Badge key={color} color={color}>
            {color}
          </Badge>
        ))}
      </>
    );
    await expectNoAxeViolations(container);
  });
});
