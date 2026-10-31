// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Icon, { IconProps } from '../../../lib/components/icon';
import IconProvider from '../../../lib/components/icon-provider';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Icon', () => {
  test('renders a built-in icon as decorative by default', () => {
    render(<Icon name="search" />);
    const icon = createWrapper().findIcon()!.getElement();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.querySelector('svg')).toHaveAttribute('focusable', 'false');
  });

  test('is announced when it has an ariaLabel', () => {
    render(<Icon name="status-warning" ariaLabel="Warning" />);
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  test('marks icons that point along the reading direction for mirroring', () => {
    const { container } = render(
      <>
        <Icon name="angle-right" />
        <Icon name="search" />
      </>
    );
    const [directional, neutral] = Array.from(container.children);
    expect(directional.className).toMatch(/flip-in-rtl/);
    expect(neutral.className).not.toMatch(/flip-in-rtl/);
  });

  test('renders a custom svg', () => {
    render(<Icon svg={<svg data-testid="custom" />} />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  test('warns about an unknown icon and renders nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Icon name={'unknown' as IconProps.Name} />);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Icon name="check" />
        <Icon name="close" ariaLabel="Close" />
      </>
    );
    await expectNoAxeViolations(container);
  });
});

describe('IconProvider', () => {
  test('replaces an icon for its subtree', () => {
    render(
      <IconProvider icons={{ search: <svg data-testid="replacement" /> }}>
        <Icon name="search" />
      </IconProvider>
    );
    expect(screen.getByTestId('replacement')).toBeInTheDocument();
  });

  test('null hides an icon', () => {
    const { container } = render(
      <IconProvider icons={{ search: null }}>
        <Icon name="search" />
      </IconProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('null for all icons restores the built-in set', () => {
    render(
      <IconProvider icons={{ search: null }}>
        <IconProvider icons={null}>
          <Icon name="search" />
        </IconProvider>
      </IconProvider>
    );
    expect(createWrapper().findIcon()).not.toBeNull();
  });
});
