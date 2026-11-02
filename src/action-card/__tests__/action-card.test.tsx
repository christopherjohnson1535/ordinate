// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import ActionCard, { ActionCardProps } from '../../../lib/components/action-card';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const card = () => createWrapper().findActionCard()!;

describe('ActionCard as a button', () => {
  test('is one button named by the header and described by the description', () => {
    render(<ActionCard header="Create a cluster" description="Start with three nodes." iconName="add" />);
    const button = screen.getByRole('button', { name: 'Create a cluster' });
    expect(button).toHaveAccessibleDescription('Start with three nodes.');
    expect(button).toHaveAttribute('type', 'button');
    expect(card().findIconSlot()).not.toBeNull();
  });

  test('fires onClick', () => {
    const onClick = vi.fn();
    render(<ActionCard header="Create a cluster" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('a disabled card does not fire', () => {
    const onClick = vi.fn();
    render(<ActionCard header="Create a cluster" disabled={true} onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(card().isDisabled()).toBe(true);
  });

  test('ariaLabel replaces the header as the name', () => {
    render(<ActionCard header="Create" ariaLabel="Create a cluster" />);
    expect(screen.getByRole('button', { name: 'Create a cluster' })).toBeInTheDocument();
  });

  test('focus() moves focus to the card', () => {
    const ref = React.createRef<ActionCardProps.Ref>();
    render(<ActionCard ref={ref} header="Create a cluster" />);
    act(() => ref.current!.focus());
    expect(screen.getByRole('button')).toHaveFocus();
  });
});

describe('ActionCard as a link', () => {
  test('is one link with the URL', () => {
    render(<ActionCard header="Read the guide" href="/guide" />);
    expect(screen.getByRole('link', { name: 'Read the guide' })).toHaveAttribute('href', '/guide');
  });

  test('fires onFollow on a plain click, and preventDefault stops navigation', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    render(<ActionCard header="Read the guide" href="/guide" onFollow={onFollow} />);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => {
      screen.getByRole('link').dispatchEvent(event);
    });
    expect(onFollow).toHaveBeenCalledWith(expect.objectContaining({ detail: { href: '/guide', target: undefined } }));
    expect(event.defaultPrevented).toBe(true);
  });

  test('leaves clicks with a modifier key to the browser', () => {
    const onFollow = vi.fn();
    render(<ActionCard header="Read the guide" href="/guide" onFollow={onFollow} />);
    fireEvent.click(screen.getByRole('link'), { ctrlKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('opens a new tab safely', () => {
    render(<ActionCard header="Read the guide" href="/guide" target="_blank" />);
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('a disabled link keeps its role, loses its URL and is marked disabled', () => {
    render(<ActionCard header="Read the guide" href="/guide" disabled={true} />);
    const link = screen.getByRole('link', { name: 'Read the guide' });
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('ActionCard test utilities and accessibility', () => {
  test('the wrapper finds the parts', () => {
    render(
      <ActionCard header="Create a cluster" description="Three nodes.">
        Takes about five minutes.
      </ActionCard>
    );
    expect(card().findHeader()!.getText()).toBe('Create a cluster');
    expect(card().findDescription()!.getText()).toBe('Three nodes.');
    expect(card().findContent()!.getText()).toBe('Takes about five minutes.');
  });

  test('passes id and data attributes to the root', () => {
    render(<ActionCard id="create" data-testid="create" header="Create a cluster" />);
    expect(card().getElement()).toHaveAttribute('id', 'create');
    expect(card().getElement()).toHaveAttribute('data-testid', 'create');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <ActionCard header="Create a cluster" description="Three nodes." iconName="add" />
        <ActionCard header="Read the guide" href="/guide" description="Ten minutes." />
        <ActionCard header="Import" href="/import" disabled={true} />
      </div>
    );
    await expectNoAxeViolations(container);
  });
});
