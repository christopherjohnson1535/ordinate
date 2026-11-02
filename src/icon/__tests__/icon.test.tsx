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
    render(<Icon name="find" />);
    const icon = createWrapper().findIcon()!.getElement();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon.querySelector('svg')).toHaveAttribute('focusable', 'false');
  });

  test('is announced when it has an ariaLabel', () => {
    render(<Icon name="caution" ariaLabel="Warning" />);
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
  });

  test('marks icons that point along the reading direction for mirroring', () => {
    const { container } = render(
      <>
        <Icon name="chevron-right" />
        <Icon name="find" />
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

  test('still renders an icon by its old name, warns once, and draws the same artwork', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <>
        <Icon name="search" />
        <Icon name="find" />
      </>
    );
    const [legacy, current] = Array.from(container.children);
    expect(legacy.innerHTML).toBe(current.innerHTML);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"search" is now called "find"'));
    warn.mockRestore();
  });

  test('keeps mirroring a directional icon given its old name', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Icon name="angle-right" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/flip-in-rtl/);
    vi.restoreAllMocks();
  });

  test('applies an IconProvider written with old names to the renamed icon', () => {
    render(
      <IconProvider icons={{ settings: <svg data-testid="wheel" /> }}>
        <Icon name="adjust" />
      </IconProvider>
    );
    expect(screen.getByTestId('wheel')).toBeInTheDocument();
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
      <IconProvider icons={{ find: <svg data-testid="replacement" /> }}>
        <Icon name="find" />
      </IconProvider>
    );
    expect(screen.getByTestId('replacement')).toBeInTheDocument();
  });

  test('null hides an icon', () => {
    const { container } = render(
      <IconProvider icons={{ find: null }}>
        <Icon name="find" />
      </IconProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('null for all icons restores the built-in set', () => {
    render(
      <IconProvider icons={{ find: null }}>
        <IconProvider icons={null}>
          <Icon name="find" />
        </IconProvider>
      </IconProvider>
    );
    expect(createWrapper().findIcon()).not.toBeNull();
  });
});
