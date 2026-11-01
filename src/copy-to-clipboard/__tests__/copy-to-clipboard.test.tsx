// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import CopyToClipboard, { CopyToClipboardProps } from '../../../lib/components/copy-to-clipboard';
import I18nProvider from '../../../lib/components/i18n';
import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const writeText = vi.fn<(text: string) => Promise<void>>();

function mockClipboard(clipboard: Partial<Clipboard> | undefined) {
  Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });
}

function renderCopy(props: Partial<CopyToClipboardProps> = {}) {
  return render(<CopyToClipboard textToCopy="node-7f3a" {...props} />);
}

const wrapper = () => createWrapper().findCopyToClipboard()!;
const getStatus = () => screen.queryByRole('status');

// Lets the clipboard promise settle and React apply the result.
async function settle() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function clickCopy(name = 'Copy') {
  fireEvent.click(screen.getByRole('button', { name }));
  await settle();
}

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  mockClipboard({ writeText });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CopyToClipboard', () => {
  test('the button variant shows "Copy" with the copy icon', () => {
    renderCopy();
    const button = wrapper().findCopyButton();
    expect(button.getElement()).toHaveAccessibleName('Copy');
    expect(button.findTextRegion()!.getText()).toBe('Copy');
    expect(button.findIcon()).not.toBeNull();
  });

  test('writes the text to the clipboard and announces success', async () => {
    renderCopy();
    await clickCopy();
    expect(writeText).toHaveBeenCalledWith('node-7f3a');
    expect(getStatus()).toHaveTextContent('Copied');
    expect(wrapper().findStatusText()!.getText()).toBe('Copied');
  });

  test('announces an error when the browser refuses', async () => {
    writeText.mockRejectedValue(new Error('Not allowed'));
    renderCopy();
    await clickCopy();
    expect(getStatus()).toHaveTextContent('Failed to copy');
  });

  test('announces an error when there is no clipboard API', async () => {
    mockClipboard(undefined);
    renderCopy();
    await clickCopy();
    expect(getStatus()).toHaveTextContent('Failed to copy');
  });

  test('the status region is in the page before its message arrives', async () => {
    let finish: () => void = () => undefined;
    writeText.mockReturnValue(new Promise<void>(resolve => (finish = resolve)));
    renderCopy();
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(getStatus()).toBeInTheDocument();
    expect(getStatus()).toHaveTextContent('');
    await act(async () => finish());
    expect(getStatus()).toHaveTextContent('Copied');
  });

  test('uses custom texts', async () => {
    writeText.mockRejectedValueOnce(new Error('Not allowed'));
    renderCopy({ copyButtonText: 'Copy ID', copySuccessText: 'ID copied', copyErrorText: 'ID not copied' });
    await clickCopy('Copy ID');
    expect(getStatus()).toHaveTextContent('ID not copied');
    await clickCopy('Copy ID');
    expect(getStatus()).toHaveTextContent('ID copied');
  });

  test('the icon variant is named by copyButtonAriaLabel, then copyButtonText, then "Copy"', () => {
    const { rerender } = renderCopy({ variant: 'icon' });
    expect(wrapper().findCopyButton().getElement()).toHaveAccessibleName('Copy');
    expect(wrapper().findCopyButton().findTextRegion()).toBeNull();
    rerender(<CopyToClipboard textToCopy="node-7f3a" variant="icon" copyButtonText="Copy ID" />);
    expect(wrapper().findCopyButton().getElement()).toHaveAccessibleName('Copy ID');
    rerender(
      <CopyToClipboard textToCopy="node-7f3a" variant="icon" copyButtonText="Copy ID" copyButtonAriaLabel="Copy key" />
    );
    expect(wrapper().findCopyButton().getElement()).toHaveAccessibleName('Copy key');
  });

  test('the inline variant shows the text with a small copy button', async () => {
    const { rerender } = renderCopy({ variant: 'inline', copyButtonAriaLabel: 'Copy node ID' });
    expect(wrapper().findDisplayedText()!.getText()).toBe('node-7f3a');
    rerender(
      <CopyToClipboard
        textToCopy="node-7f3a-91c2"
        textToDisplay="node-7f3a…"
        variant="inline"
        copyButtonAriaLabel="Copy node ID"
      />
    );
    expect(wrapper().findDisplayedText()!.getText()).toBe('node-7f3a…');
    await clickCopy('Copy node ID');
    expect(writeText).toHaveBeenCalledWith('node-7f3a-91c2');
  });

  test('hides the message after a moment', async () => {
    vi.useFakeTimers();
    renderCopy();
    await clickCopy();
    expect(getStatus()).toHaveTextContent('Copied');
    act(() => vi.advanceTimersByTime(1900));
    expect(getStatus()).not.toBeNull();
    act(() => vi.advanceTimersByTime(100));
    expect(getStatus()).toBeNull();
  });

  test('hides the message when focus leaves the button', async () => {
    renderCopy();
    const button = screen.getByRole('button', { name: 'Copy' });
    act(() => button.focus());
    await clickCopy();
    act(() => button.blur());
    expect(getStatus()).toBeNull();
  });

  test('Escape hides only the message inside a modal', async () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Node" onDismiss={onDismiss}>
        <CopyToClipboard textToCopy="node-7f3a" />
      </Modal>
    );
    await clickCopy();
    const escape = fireEvent.keyDown(screen.getByRole('button', { name: 'Copy' }), { key: 'Escape' });
    expect(escape).toBe(false);
    expect(getStatus()).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('renders the message in a portal', async () => {
    renderCopy({ popoverRenderWithPortal: true });
    await clickCopy();
    expect(wrapper().findStatusText()).toBeNull();
    expect(wrapper().findStatusText(true)!.getText()).toBe('Copied');
    expect(getStatus()!.parentElement).toBe(document.body);
  });

  test('a disabled button copies nothing', async () => {
    renderCopy({ disabled: true });
    const button = wrapper().findCopyButton();
    expect(button.isDisabled()).toBe(true);
    expect(button.getElement()).toBeDisabled();
    button.click();
    await settle();
    expect(writeText).not.toHaveBeenCalled();
    expect(getStatus()).toBeNull();
  });

  test('a disabled reason keeps the button focusable and shows in a tooltip', async () => {
    renderCopy({ disabled: true, disabledReason: 'You need read access to copy this key.' });
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAccessibleDescription('You need read access to copy this key.');
    act(() => button.focus());
    expect(screen.getByRole('tooltip')).toHaveTextContent('You need read access to copy this key.');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.click(button);
    await settle();
    expect(writeText).not.toHaveBeenCalled();
  });

  test('takes its texts from the I18nProvider', async () => {
    render(
      <I18nProvider
        locale="de"
        messages={[
          {
            '@ordinate-ui/components': {
              de: { 'copy-to-clipboard': { copyButtonText: 'Kopieren', copySuccessText: 'Kopiert' } },
            },
          },
        ]}
      >
        <CopyToClipboard textToCopy="node-7f3a" />
      </I18nProvider>
    );
    await clickCopy('Kopieren');
    expect(getStatus()).toHaveTextContent('Kopiert');
  });

  test('passes id and data attributes to the root', () => {
    renderCopy({ id: 'copy-id', ...{ 'data-testid': 'copy' } });
    expect(wrapper().getElement()).toHaveAttribute('id', 'copy-id');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'copy');
  });
});

describe('CopyToClipboard accessibility', () => {
  test.each<CopyToClipboardProps.Variant>(['button', 'icon', 'inline'])(
    'has no violations in the %s variant with its message shown',
    async variant => {
      renderCopy({ variant });
      await clickCopy();
      await expectNoAxeViolations(document.body);
    }
  );

  test('has no violations with a disabled reason', async () => {
    renderCopy({ disabled: true, disabledReason: 'No access' });
    await expectNoAxeViolations(document.body);
  });
});
