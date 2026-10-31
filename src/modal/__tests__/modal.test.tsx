// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function getDialog() {
  return document.querySelector('dialog') as HTMLDialogElement;
}

describe('Modal', () => {
  test('opens and closes with visible', () => {
    const { rerender } = render(
      <Modal visible={true} header="Delete project">
        Content
      </Modal>
    );
    expect(getDialog().open).toBe(true);
    rerender(
      <Modal visible={false} header="Delete project">
        Content
      </Modal>
    );
    expect(getDialog().open).toBe(false);
  });

  test('uses the header as its accessible name', () => {
    render(
      <Modal visible={true} header="Delete project">
        Content
      </Modal>
    );
    expect(screen.getByRole('dialog', { name: 'Delete project' })).toBeInTheDocument();
  });

  test.each([
    ['closeButton', () => fireEvent.click(screen.getByRole('button', { name: 'Close' }))],
    ['overlay', () => fireEvent.click(getDialog())],
    ['keyboard', () => fireEvent(getDialog(), new Event('cancel', { cancelable: true }))],
  ])('dismisses with reason %s', (reason, act) => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Delete project" onDismiss={event => onDismiss(event.detail)}>
        Content
      </Modal>
    );
    act();
    expect(onDismiss).toHaveBeenCalledWith({ reason });
  });

  test('clicks inside the content do not dismiss', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} onDismiss={onDismiss}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByText('Content'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('stays open on Escape until the parent sets visible to false', () => {
    render(<Modal visible={true}>Content</Modal>);
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(getDialog(), cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(getDialog().open).toBe(true);
  });

  test('locks page scroll while open', () => {
    const { rerender, unmount } = render(<Modal visible={true}>Content</Modal>);
    expect(document.body).toHaveClass('ord-modal-open');
    rerender(<Modal visible={false}>Content</Modal>);
    expect(document.body).not.toHaveClass('ord-modal-open');
    unmount();
  });

  test('renders the footer', () => {
    render(
      <Modal visible={true} footer={<button>Delete</button>}>
        Content
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});

describe('Modal test utilities and accessibility', () => {
  test('the wrapper reads the parts and dismisses', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Delete project" footer="Actions" onDismiss={event => onDismiss(event.detail)}>
        Content
      </Modal>
    );
    const modal = createWrapper().findModal()!;
    expect(modal.isVisible()).toBe(true);
    expect(modal.findHeader()!.getText()).toBe('Delete project');
    expect(modal.findContent()!.getText()).toBe('Content');
    expect(modal.findFooter()!.getText()).toBe('Actions');
    modal.findDismissButton().click();
    modal.pressEscape();
    expect(onDismiss.mock.calls).toEqual([[{ reason: 'closeButton' }], [{ reason: 'keyboard' }]]);
  });

  test('has no accessibility violations', async () => {
    render(
      <Modal visible={true} header="Delete project" footer={<button>Delete</button>}>
        This cannot be undone.
      </Modal>
    );
    await expectNoAxeViolations(document.body);
  });
});
