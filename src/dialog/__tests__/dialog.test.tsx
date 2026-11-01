// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Dialog from '../../../lib/components/dialog';
import I18nProvider from '../../../lib/components/i18n';
import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function Toggle() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Rename</button>
      {open && (
        <Dialog header="Rename node" onDismiss={() => setOpen(false)}>
          <input aria-label="Name" />
        </Dialog>
      )}
    </>
  );
}

describe('Dialog', () => {
  test('is a dialog named by its header', () => {
    render(<Dialog header="Rename node">Content</Dialog>);
    expect(screen.getByRole('dialog', { name: 'Rename node' })).toHaveTextContent('Content');
    expect(screen.getByRole('heading', { name: 'Rename node' })).toBeInTheDocument();
  });

  test('without a header it is named by ariaLabel', () => {
    render(<Dialog ariaLabel="Rename node">Content</Dialog>);
    expect(screen.getByRole('dialog', { name: 'Rename node' })).toBeInTheDocument();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  test.each([
    ['closeButton', () => fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))],
    ['keyboard', () => fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })],
  ])('dismisses with reason %s', (reason, act) => {
    const onDismiss = vi.fn();
    render(
      <Dialog header="Rename node" onDismiss={event => onDismiss(event.detail)}>
        <input aria-label="Name" />
      </Dialog>
    );
    act();
    expect(onDismiss).toHaveBeenCalledWith({ reason });
  });

  test('moves focus to itself when it mounts and back when it unmounts', () => {
    render(<Toggle />);
    const opener = screen.getByRole('button', { name: 'Rename' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('dialog')).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });

  test('leaves focus alone on unmount when the user has moved it elsewhere', () => {
    const { rerender } = render(
      <>
        <button>Opener</button>
        <button>Elsewhere</button>
        <Dialog header="Rename node">Content</Dialog>
      </>
    );
    screen.getByRole('button', { name: 'Elsewhere' }).focus();
    rerender(
      <>
        <button>Opener</button>
        <button>Elsewhere</button>
      </>
    );
    expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
  });

  test('Escape closes only the dialog inside a modal', () => {
    const onModalDismiss = vi.fn();
    const onDialogDismiss = vi.fn();
    render(
      <Modal visible={true} header="Settings" onDismiss={onModalDismiss}>
        <Dialog header="Rename node" onDismiss={onDialogDismiss}>
          Content
        </Dialog>
      </Modal>
    );
    // Preventing the default stops the browser from turning Escape into the modal's cancel event.
    const escape = fireEvent.keyDown(screen.getByRole('dialog', { name: 'Rename node' }), { key: 'Escape' });
    expect(escape).toBe(false);
    expect(onDialogDismiss).toHaveBeenCalledTimes(1);
    expect(onModalDismiss).not.toHaveBeenCalled();
  });

  test('renders the footer only when given', () => {
    const { rerender } = render(<Dialog header="Rename node">Content</Dialog>);
    expect(createWrapper().findDialog()!.findFooter()).toBeNull();
    rerender(
      <Dialog header="Rename node" footer={<button>Save</button>}>
        Content
      </Dialog>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('the close button label comes from the prop, then the locale', () => {
    const { unmount } = render(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate-ui/components': { de: { dialog: { dismissAriaLabel: 'Dialog schließen' } } } }]}
      >
        <Dialog header="Rename node">Content</Dialog>
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Dialog schließen' })).toBeInTheDocument();
    unmount();
    render(
      <Dialog header="Rename node" dismissAriaLabel="Cancel renaming">
        Content
      </Dialog>
    );
    expect(screen.getByRole('button', { name: 'Cancel renaming' })).toBeInTheDocument();
  });

  test('passes id and data attributes to the root', () => {
    render(
      <Dialog header="Rename node" id="rename" {...{ 'data-testid': 'rename-dialog' }}>
        Content
      </Dialog>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'rename');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-testid', 'rename-dialog');
  });
});

describe('Dialog test utilities and accessibility', () => {
  test('the wrapper reads the parts and dismisses', () => {
    const onDismiss = vi.fn();
    render(
      <Dialog header="Rename node" footer="Actions" onDismiss={event => onDismiss(event.detail)}>
        Content
      </Dialog>
    );
    const dialog = createWrapper().findDialog()!;
    expect(dialog.findHeader()!.getText()).toBe('Rename node');
    expect(dialog.findContent()!.getText()).toBe('Content');
    expect(dialog.findFooter()!.getText()).toBe('Actions');
    dialog.findDismissButton().click();
    dialog.pressEscape();
    expect(onDismiss.mock.calls).toEqual([[{ reason: 'closeButton' }], [{ reason: 'keyboard' }]]);
  });

  test('has no accessibility violations', async () => {
    render(
      <Dialog header="Rename node" footer={<button>Save</button>}>
        <input aria-label="Name" />
      </Dialog>
    );
    await expectNoAxeViolations(document.body);
  });

  test('has no accessibility violations without a header', async () => {
    render(<Dialog ariaLabel="Rename node">Content</Dialog>);
    await expectNoAxeViolations(document.body);
  });
});
