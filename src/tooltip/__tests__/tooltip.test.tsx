// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import Button from '../../../lib/components/button';
import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import Tooltip from '../../../lib/components/tooltip';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function renderTooltip(content = 'Copy the node ID') {
  return render(
    <Tooltip content={content}>
      <Button variant="icon" iconName="copy" ariaLabel="Copy" />
    </Tooltip>
  );
}

const getTrigger = () => screen.getByRole('button', { name: 'Copy' });
const getRoot = () => createWrapper().findTooltip()!.getElement();
const isVisible = () => createWrapper().findTooltip()!.isVisible();

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('describes its trigger', () => {
    renderTooltip();
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(getTrigger()).toHaveAttribute('aria-describedby', tooltip.id);
    expect(getTrigger()).toHaveAccessibleDescription('Copy the node ID');
  });

  test('shows after a short delay on hover and hides when the pointer leaves', () => {
    renderTooltip();
    fireEvent.mouseEnter(getRoot());
    expect(isVisible()).toBe(false);
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy the node ID');
    fireEvent.mouseLeave(getRoot());
    expect(isVisible()).toBe(true);
    act(() => vi.advanceTimersByTime(100));
    expect(isVisible()).toBe(false);
  });

  test('a quick pass over the trigger does not show it', () => {
    renderTooltip();
    fireEvent.mouseEnter(getRoot());
    act(() => vi.advanceTimersByTime(150));
    fireEvent.mouseLeave(getRoot());
    act(() => vi.advanceTimersByTime(500));
    expect(isVisible()).toBe(false);
  });

  test('shows right away on keyboard focus and hides on blur', () => {
    renderTooltip();
    act(() => getTrigger().focus());
    expect(isVisible()).toBe(true);
    act(() => getTrigger().blur());
    expect(isVisible()).toBe(false);
  });

  test('Escape hides it without moving focus', () => {
    renderTooltip();
    act(() => getTrigger().focus());
    fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(isVisible()).toBe(false);
    expect(getTrigger()).toHaveFocus();
  });

  test('Escape hides a tooltip shown by hover while focus is elsewhere', () => {
    renderTooltip();
    fireEvent.mouseEnter(getRoot());
    act(() => vi.advanceTimersByTime(300));
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(isVisible()).toBe(false);
  });

  test('Escape closes only the tooltip inside a modal', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Node" onDismiss={onDismiss}>
        <Tooltip content="Copy the node ID">
          <button>Copy</button>
        </Tooltip>
      </Modal>
    );
    act(() => getTrigger().focus());
    const escape = fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(escape).toBe(false);
    expect(isVisible()).toBe(false);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('makes a trigger without a focusable element focusable', () => {
    render(<Tooltip content="Three of four zones">75%</Tooltip>);
    const trigger = createWrapper().findTooltip()!.findTrigger().getElement();
    expect(trigger).toHaveAttribute('tabindex', '0');
    expect(trigger).toHaveAccessibleDescription('Three of four zones');
  });

  test('keeps descriptions the trigger already has', () => {
    render(
      <>
        <span id="hint">Shortcut C</span>
        <Tooltip content="Copy the node ID">
          <button aria-describedby="hint">Copy</button>
        </Tooltip>
      </>
    );
    expect(getTrigger()).toHaveAccessibleDescription('Shortcut C Copy the node ID');
  });

  test('passes id and data attributes to the root', () => {
    render(
      <Tooltip content="Copy" id="copy-tip" {...{ 'data-testid': 'tip' }}>
        <button>Copy</button>
      </Tooltip>
    );
    expect(getRoot()).toHaveAttribute('id', 'copy-tip');
    expect(getRoot()).toHaveAttribute('data-testid', 'tip');
  });
});

describe('Tooltip test utilities and accessibility', () => {
  test('the wrapper finds the trigger and the content', () => {
    renderTooltip();
    const tooltip = createWrapper().findTooltip()!;
    expect(tooltip.findTrigger().find('button')).not.toBeNull();
    expect(tooltip.findContent().getText()).toBe('Copy the node ID');
    expect(tooltip.isVisible()).toBe(false);
    tooltip.findTrigger().find('button')!.focus();
    expect(tooltip.isVisible()).toBe(true);
  });

  test('has no accessibility violations while shown', async () => {
    renderTooltip();
    act(() => getTrigger().focus());
    await expectNoAxeViolations(document.body);
  });

  test('has no accessibility violations around plain text', async () => {
    render(<Tooltip content="Three of four zones">75%</Tooltip>);
    await expectNoAxeViolations(document.body);
  });
});
