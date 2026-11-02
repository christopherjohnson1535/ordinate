// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Button from '../../../lib/components/button';
import I18nProvider from '../../../lib/components/i18n';
import Modal from '../../../lib/components/modal';
import Popover, { PopoverProps } from '../../../lib/components/popover';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function renderPopover(props: Partial<PopoverProps> = {}) {
  return render(
    <Popover header="Memory" content="512 MiB of 2 GiB in use." {...props}>
      {props.children ?? 'Usage'}
    </Popover>
  );
}

const getTrigger = () => screen.getByRole('button', { name: 'Usage' });
const queryPanel = () => screen.queryByRole('dialog');

describe('Popover', () => {
  test('opens on click and closes on a second click', () => {
    renderPopover();
    expect(queryPanel()).toBeNull();
    fireEvent.click(getTrigger());
    expect(screen.getByRole('dialog', { name: 'Memory' })).toHaveTextContent('512 MiB of 2 GiB in use.');
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger()).toHaveAttribute('aria-controls', queryPanel()!.id);
    fireEvent.click(getTrigger());
    expect(queryPanel()).toBeNull();
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  test('moves focus into the popover and back to the trigger on Escape', () => {
    renderPopover();
    getTrigger().focus();
    fireEvent.click(getTrigger());
    expect(queryPanel()).toHaveFocus();
    fireEvent.keyDown(queryPanel()!, { key: 'Escape' });
    expect(queryPanel()).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  test('the close button closes it and returns focus to the trigger', () => {
    renderPopover();
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('button', { name: 'Close popover' }));
    expect(queryPanel()).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  test('a click outside closes it without moving focus to the trigger', () => {
    render(
      <>
        <Popover header="Memory" content="Details">
          Usage
        </Popover>
        <button>Elsewhere</button>
      </>
    );
    fireEvent.click(getTrigger());
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(queryPanel()).not.toBeNull();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(queryPanel()).toBeNull();
    expect(getTrigger()).not.toHaveFocus();
  });

  test('Tab and Shift+Tab stay inside the popover', () => {
    renderPopover({ content: <a href="#docs">Read more</a> });
    fireEvent.click(getTrigger());
    const close = screen.getByRole('button', { name: 'Close popover' });
    const link = screen.getByRole('link', { name: 'Read more' });
    link.focus();
    fireEvent.keyDown(link, { key: 'Tab' });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(link).toHaveFocus();
  });

  test('Escape closes only the popover inside a modal', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Settings" onDismiss={onDismiss}>
        <Popover content="Details">Usage</Popover>
      </Modal>
    );
    fireEvent.click(getTrigger());
    const escape = fireEvent.keyDown(screen.getByRole('dialog', { name: 'Usage' }), { key: 'Escape' });
    expect(escape).toBe(false);
    expect(screen.queryByRole('dialog', { name: 'Usage' })).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});

describe('Popover options', () => {
  test('without a header it is named after its trigger', () => {
    renderPopover({ header: undefined });
    fireEvent.click(getTrigger());
    expect(screen.getByRole('dialog', { name: 'Usage' })).toBeInTheDocument();
  });

  test('without the dismiss button focus stays on the trigger', () => {
    renderPopover({ dismissButton: false });
    getTrigger().focus();
    fireEvent.click(getTrigger());
    expect(queryPanel()).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Close popover' })).toBeNull();
    expect(getTrigger()).toHaveFocus();
    fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(queryPanel()).toBeNull();
  });

  test('a custom trigger opens it and gets focus back', () => {
    render(
      <Popover triggerType="custom" header="Status" content="All nodes healthy.">
        <Button variant="icon" iconName="note" ariaLabel="Status details" />
      </Popover>
    );
    const button = screen.getByRole('button', { name: 'Status details' });
    fireEvent.click(button);
    expect(screen.getByRole('dialog', { name: 'Status' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close popover' }));
    expect(button).toHaveFocus();
  });

  test('size, fixed width and trigger wrapping change the layout classes', () => {
    const { rerender } = renderPopover();
    const popover = createWrapper().findPopover()!;
    const triggerClass = popover.findTrigger().getElement().className;
    fireEvent.click(getTrigger());
    const panelClass = popover.findBody()!.getElement().className;
    rerender(
      <Popover header="Memory" content="Details" size="large" fixedWidth={true} wrapTriggerText={false}>
        Usage
      </Popover>
    );
    expect(popover.findBody()!.getElement().className).not.toBe(panelClass);
    expect(popover.findTrigger().getElement().className).not.toBe(triggerClass);
  });

  test('renders into the page body with renderWithPortal', () => {
    const { container } = renderPopover({ renderWithPortal: true });
    fireEvent.click(getTrigger());
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Memory' })).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(queryPanel()).not.toBeNull();
    expect(createWrapper().findPopover()!.findContent()!.getText()).toBe('512 MiB of 2 GiB in use.');
  });

  test('the close button label comes from the prop, then the locale', () => {
    const { unmount } = render(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate/components': { de: { popover: { dismissAriaLabel: 'Schließen' } } } }]}
      >
        <Popover content="Details">Usage</Popover>
      </I18nProvider>
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
    unmount();
    renderPopover({ dismissAriaLabel: 'Hide' });
    fireEvent.click(getTrigger());
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();
  });

  test('the ref focuses the trigger and dismisses the popover', () => {
    const ref = React.createRef<PopoverProps.Ref>();
    render(
      <Popover ref={ref} content="Details">
        Usage
      </Popover>
    );
    act(() => ref.current!.focus());
    expect(getTrigger()).toHaveFocus();
    fireEvent.click(getTrigger());
    act(() => ref.current!.dismiss());
    expect(queryPanel()).toBeNull();
  });

  test('ties the plate to its trigger with a leader from a dot, hidden from screen readers', () => {
    renderPopover();
    fireEvent.click(getTrigger());
    const leader = createWrapper().findPopover()!.findLeader()!.getElement();
    expect(leader).toHaveAttribute('aria-hidden', 'true');
    expect(leader).toHaveTextContent('');
    // The dot at the trigger end.
    expect(leader.children).toHaveLength(1);
  });

  test('passes id and data attributes to the root', () => {
    renderPopover({ id: 'usage', ...{ 'data-testid': 'usage-popover' } });
    const root = createWrapper().findPopover()!.getElement();
    expect(root).toHaveAttribute('id', 'usage');
    expect(root).toHaveAttribute('data-testid', 'usage-popover');
  });
});

describe('Popover test utilities and accessibility', () => {
  test('the wrapper reads the parts and dismisses', () => {
    renderPopover();
    const popover = createWrapper().findPopover()!;
    expect(popover.isOpen()).toBe(false);
    expect(popover.findContent()).toBeNull();
    popover.findTrigger().click();
    expect(popover.isOpen()).toBe(true);
    expect(popover.findHeader()!.getText()).toBe('Memory');
    expect(popover.findContent()!.getText()).toBe('512 MiB of 2 GiB in use.');
    popover.findDismissButton()!.click();
    expect(popover.isOpen()).toBe(false);
  });

  test('has no accessibility violations when open', async () => {
    renderPopover({ content: <a href="#docs">Read more</a> });
    fireEvent.click(getTrigger());
    await expectNoAxeViolations(document.body);
  });

  test('has no accessibility violations without a header or close button', async () => {
    renderPopover({ header: undefined, dismissButton: false });
    fireEvent.click(getTrigger());
    await expectNoAxeViolations(document.body);
  });
});
