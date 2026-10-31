// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Link, { LinkProps } from '../../../lib/components/link';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Link', () => {
  test('renders an anchor with the href', () => {
    render(<Link href="/projects">Projects</Link>);
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
  });

  test('does not set target or rel by default', () => {
    render(<Link href="/projects">Projects</Link>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  test('an external link opens in a new tab with a safe rel and an icon', () => {
    render(
      <Link href="https://example.com" external={true} externalIconAriaLabel="Opens in a new tab">
        Status page
      </Link>
    );
    const link = screen.getByRole('link', { name: /^Status page\s+Opens in a new tab$/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('img', { name: 'Opens in a new tab' })).toBeInTheDocument();
  });

  test('target _blank adds the safe rel', () => {
    render(
      <Link href="/report" target="_blank">
        Report
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('rel and target override the defaults', () => {
    render(
      <Link href="https://example.com" external={true} target="_self" rel="nofollow">
        Status page
      </Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveAttribute('rel', 'nofollow');
  });

  test('uses ariaLabel as the accessible name', () => {
    render(
      <Link href="/projects/42" ariaLabel="Open project north-annex">
        Open
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Open project north-annex' })).toBeInTheDocument();
  });

  test('fires onFollow on a plain click, and preventDefault stops navigation', () => {
    const onFollow = vi.fn((event: CustomEvent<LinkProps.FollowDetail>) => event.preventDefault());
    render(
      <Link href="/projects" onFollow={onFollow}>
        Projects
      </Link>
    );
    const click = fireEvent.click(screen.getByRole('link'));
    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ href: '/projects', external: false, target: undefined });
    expect(click).toBe(false);
  });

  test('includes the external target in the follow detail', () => {
    const onFollow = vi.fn();
    render(
      <Link href="https://example.com" external={true} onFollow={event => onFollow(event.detail)}>
        Status page
      </Link>
    );
    fireEvent.click(screen.getByRole('link'));
    expect(onFollow).toHaveBeenCalledWith({ href: 'https://example.com', external: true, target: '_blank' });
  });

  test('a modified click fires onClick but not onFollow', () => {
    const onFollow = vi.fn();
    const onClick = vi.fn();
    render(
      <Link href="/projects" onFollow={onFollow} onClick={event => onClick(event.detail)}>
        Projects
      </Link>
    );
    const click = fireEvent.click(screen.getByRole('link'), { ctrlKey: true });
    expect(onFollow).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledWith({ button: 0, ctrlKey: true, shiftKey: false, altKey: false, metaKey: false });
    expect(click).toBe(true);
  });

  test('without href it is a focusable button that follows on Enter and Space', () => {
    const onFollow = vi.fn();
    render(<Link onFollow={onFollow}>Show details</Link>);
    const button = screen.getByRole('button', { name: 'Show details' });
    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).not.toHaveAttribute('href');
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.keyDown(button, { key: 'a' });
    expect(onFollow).toHaveBeenCalledTimes(3);
  });

  test('exposes focus() through its ref', () => {
    const ref = React.createRef<LinkProps.Ref>();
    render(
      <Link ref={ref} href="/projects">
        Projects
      </Link>
    );
    act(() => ref.current?.focus());
    expect(screen.getByRole('link')).toHaveFocus();
  });
});

describe('Link test utilities and accessibility', () => {
  test('the wrapper finds the link and its parts', () => {
    render(
      <Link href="https://example.com" external={true} externalIconAriaLabel="Opens in a new tab">
        Status page
      </Link>
    );
    const link = createWrapper().findLink()!;
    expect(link.getHref()).toBe('https://example.com');
    expect(link.findExternalIcon()).not.toBeNull();
    expect(link.getText()).toContain('Status page');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <p>
        Read the <Link href="/guide">deployment guide</Link>, check the{' '}
        <Link href="https://example.com" external={true} externalIconAriaLabel="Opens in a new tab">
          status page
        </Link>{' '}
        or <Link variant="info">get help</Link>. Projects: <Link variant="value-large">12</Link>
      </p>
    );
    await expectNoAxeViolations(container);
  });
});
