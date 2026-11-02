// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Alert, { AlertProps } from '../../../lib/components/alert';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

describe('Alert', () => {
  test('renders the header and content in a group named by the header', () => {
    render(<Alert header="Deployment paused">Two nodes did not respond.</Alert>);
    const group = screen.getByRole('group', { name: 'Deployment paused' });
    expect(group).toHaveTextContent('Two nodes did not respond.');
  });

  test('the status icon is decorative unless it has a label', () => {
    const { rerender } = render(<Alert type="fault">Save failed.</Alert>);
    expect(screen.queryByRole('img')).toBeNull();
    rerender(
      <Alert type="fault" statusIconAriaLabel="Error">
        Save failed.
      </Alert>
    );
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
  });

  test('shows a close button only when dismissible', () => {
    const { rerender } = render(<Alert>Message</Alert>);
    expect(screen.queryByRole('button')).toBeNull();
    rerender(<Alert dismissible={true}>Message</Alert>);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveAttribute('type', 'button');
  });

  test('fires onDismiss when the close button is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Alert dismissible={true} dismissAriaLabel="Close message" onDismiss={event => onDismiss(event.detail)}>
        Message
      </Alert>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close message' }));
    expect(onDismiss).toHaveBeenCalledWith(null);
  });

  test('renders the action', () => {
    render(<Alert action={<button>Retry</button>}>Save failed.</Alert>);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  test('applies a different class for each type', () => {
    const types: AlertProps.Type[] = ['note', 'complete', 'caution', 'fault'];
    render(
      <>
        {types.map(type => (
          <Alert key={type} type={type}>
            {type}
          </Alert>
        ))}
      </>
    );
    const classNames = createWrapper()
      .findAllAlerts()
      .map(alert => alert.getElement().className);
    expect(new Set(classNames).size).toBe(types.length);
  });

  test('names the kind of note in the margin', () => {
    const { rerender } = render(<Alert>Message</Alert>);
    const label = () => createWrapper().findAlert()!.findLabel().getText();
    expect(label()).toBe('Note');
    rerender(<Alert type="complete">Message</Alert>);
    expect(label()).toBe('Complete');
    rerender(<Alert type="caution">Message</Alert>);
    expect(label()).toBe('Caution');
    rerender(<Alert type="fault">Message</Alert>);
    expect(label()).toBe('Fault');
  });

  test('i18nStrings replaces the margin label', () => {
    render(
      <Alert type="caution" i18nStrings={{ cautionLabel: 'Warning' }}>
        Message
      </Alert>
    );
    expect(createWrapper().findAlert()!.findLabel().getText()).toBe('Warning');
  });

  test('still accepts the old type names, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const legacy: [AlertProps.LegacyType, AlertProps.Type][] = [
      ['info', 'note'],
      ['success', 'complete'],
      ['warning', 'caution'],
      ['error', 'fault'],
    ];
    for (const [old, current] of legacy) {
      const { container: before, unmount: unmountBefore } = render(<Alert type={old}>Message</Alert>);
      const legacyHtml = before.innerHTML;
      unmountBefore();
      const { container: after, unmount } = render(<Alert type={current}>Message</Alert>);
      expect(legacyHtml).toBe(after.innerHTML);
      unmount();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining(`"${old}" is now called "${current}"`));
    }
    warn.mockRestore();
  });

  test('focus() moves focus to the message without adding it to the tab order', () => {
    const ref = React.createRef<AlertProps.Ref>();
    render(
      <Alert ref={ref} header="Saved">
        Changes are live.
      </Alert>
    );
    const group = screen.getByRole('group');
    expect(group).not.toHaveAttribute('tabindex');
    ref.current?.focus();
    expect(group).toHaveFocus();
    expect(group).toHaveAttribute('tabindex', '-1');
    fireEvent.blur(group);
    expect(group).not.toHaveAttribute('tabindex');
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'notice', 'data-testid': 'alert', className: 'custom' } as AlertProps;
    render(<Alert {...props}>Message</Alert>);
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('id', 'notice');
    expect(alert).not.toHaveClass('custom');
  });
});

describe('Alert test utilities and accessibility', () => {
  test('the wrapper reads the parts and dismisses', () => {
    const onDismiss = vi.fn();
    render(
      <Alert header="Quota reached" action={<button>Request more</button>} dismissible={true} onDismiss={onDismiss}>
        New instances cannot start.
      </Alert>
    );
    const alert = createWrapper().findAlert()!;
    expect(alert.findHeader()!.getText()).toBe('Quota reached');
    expect(alert.findContent()!.getText()).toBe('New instances cannot start.');
    expect(alert.findActionSlot()!.getText()).toBe('Request more');
    alert.findDismissButton()!.click();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  test('the wrapper returns null for parts that are not rendered', () => {
    render(<Alert>Message</Alert>);
    const alert = createWrapper().findAlert()!;
    expect(alert.findHeader()).toBeNull();
    expect(alert.findActionSlot()).toBeNull();
    expect(alert.findDismissButton()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Alert header="Maintenance window">Updates run on Sunday at 02:00.</Alert>
        <Alert type="complete" statusIconAriaLabel="Complete" dismissible={true}>
          Backup complete.
        </Alert>
        <Alert type="caution" header="Certificate expires soon" action={<button>Renew</button>}>
          It expires in 6 days.
        </Alert>
        <Alert type="fault" header="Save failed" />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
