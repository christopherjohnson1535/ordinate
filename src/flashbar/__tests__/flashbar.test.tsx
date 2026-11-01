// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: FlashbarProps.MessageDefinition[] = [
  { id: 'deploy', type: 'error', header: 'Deployment failed', content: 'Two nodes did not respond.' },
  { id: 'cert', type: 'warning', header: 'Certificate expires soon' },
  { id: 'backup', type: 'success', header: 'Backup complete' },
  { id: 'patch', type: 'error', header: 'Patch failed' },
];

function liveText() {
  return Array.from(document.querySelectorAll('[aria-live]'), node => node.textContent);
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Flashbar', () => {
  test('renders a labelled list with one item per message', () => {
    render(<Flashbar items={items} />);
    const list = screen.getByRole('list', { name: 'Notifications' });
    expect(list.querySelectorAll('li')).toHaveLength(4);
    expect(screen.getByText('Deployment failed')).toBeInTheDocument();
    expect(screen.getByText('Two nodes did not respond.')).toBeInTheDocument();
  });

  test('numbers each note in its margin, out of the accessibility tree', () => {
    render(<Flashbar items={items} />);
    const notes = createWrapper().findFlashbar()!.findItems();
    expect(notes.map(note => note.findMarker().getText())).toEqual(['1', '2', '3', '4']);
    expect(notes[0].findMarker().getElement().closest('[aria-hidden="true"]')).not.toBeNull();
  });

  test('labels the status icon with the type by default, or with statusIconAriaLabel', () => {
    render(
      <Flashbar
        items={[
          { type: 'error', header: 'A' },
          { type: 'in-progress', header: 'B' },
          { header: 'C', statusIconAriaLabel: 'Note' },
        ]}
      />
    );
    expect(screen.getAllByRole('img').map(icon => icon.getAttribute('aria-label'))).toEqual([
      'Error',
      'In progress',
      'Note',
    ]);
  });

  test('a loading item shows a spinner that keeps the status label', () => {
    render(<Flashbar items={[{ type: 'in-progress', loading: true, header: 'Creating instance' }]} />);
    const icon = createWrapper().findFlashbar()!.findItems()[0].findStatusIcon();
    expect(icon.getElement().querySelector('svg path')).not.toBeNull();
    expect(screen.getByRole('img', { name: 'In progress' })).toBeInTheDocument();
  });

  test('announces new items politely and alert items assertively', () => {
    vi.useFakeTimers();
    const { rerender } = render(<Flashbar items={[]} />);
    rerender(
      <Flashbar
        items={[
          { id: 'a', type: 'success', header: 'Saved' },
          { id: 'b', type: 'error', header: 'Quota reached', ariaRole: 'alert' },
        ]}
      />
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Success Saved');
    expect(document.querySelector('[aria-live="assertive"]')).toHaveTextContent('Error Quota reached');
  });

  test('announces an item again when its text changes', () => {
    vi.useFakeTimers();
    const { rerender } = render(<Flashbar items={[{ id: 'a', type: 'in-progress', header: 'Creating' }]} />);
    act(() => {
      vi.runAllTimers();
    });
    expect(liveText()).toEqual(['In progress Creating']);
    rerender(<Flashbar items={[{ id: 'a', type: 'success', header: 'Created' }]} />);
    act(() => {
      vi.runAllTimers();
    });
    expect(liveText()).toEqual(['Success Created']);
  });

  test('fires onDismiss from the close button', () => {
    const onDismiss = vi.fn();
    render(<Flashbar items={[{ header: 'Saved', dismissible: true, dismissLabel: 'Close message', onDismiss }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close message' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  test('the close button has a default name', () => {
    render(<Flashbar items={[{ header: 'Saved', dismissible: true }]} />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  test('renders the action', () => {
    render(<Flashbar items={[{ header: 'Failed', action: <button>Retry</button> }]} />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  test('without stackItems every item is shown and there is no notification bar', () => {
    render(<Flashbar items={items} />);
    const wrapper = createWrapper().findFlashbar()!;
    expect(wrapper.findItems()).toHaveLength(4);
    expect(wrapper.findNotificationBar()).toBeNull();
  });

  test('a stack shows the first item and a bar that counts the items by type', () => {
    render(<Flashbar items={items} stackItems={true} />);
    const wrapper = createWrapper().findFlashbar()!;
    expect(wrapper.findItems().map(item => item.findHeader()!.getText())).toEqual(['Deployment failed']);
    const bar = screen.getByRole('button', { name: 'Notifications 2 errors 1 warning 1 success' });
    expect(bar).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(bar.getAttribute('aria-controls')!)).toBe(
      screen.getByRole('list', { name: 'Notifications' })
    );
  });

  test('the bar expands and collapses the stack', () => {
    render(<Flashbar items={items} stackItems={true} />);
    const wrapper = createWrapper().findFlashbar()!;
    wrapper.findNotificationBar()!.click();
    expect(wrapper.isStackExpanded()).toBe(true);
    expect(wrapper.findItems()).toHaveLength(4);
    expect(wrapper.findItemsByType('error')).toHaveLength(2);
    wrapper.findNotificationBar()!.click();
    expect(wrapper.isStackExpanded()).toBe(false);
    expect(wrapper.findItems()).toHaveLength(1);
  });

  test('the bar is a native button, so Enter and Space work', () => {
    render(<Flashbar items={items} stackItems={true} />);
    const bar = createWrapper().findFlashbar()!.findNotificationBar()!.getElement();
    expect(bar.tagName).toBe('BUTTON');
    expect(bar).toHaveAttribute('type', 'button');
    bar.focus();
    expect(bar).toHaveFocus();
  });

  test('a stack of one item is not collapsed', () => {
    render(<Flashbar items={[items[0]]} stackItems={true} />);
    expect(createWrapper().findFlashbar()!.findNotificationBar()).toBeNull();
  });

  test('stack counts use the provider locale with plural rules, or itemCountText', () => {
    const { rerender } = render(
      <I18nProvider
        locale="de"
        messages={[
          {
            '@ordinate/components': {
              de: { flashbar: { errorCount: '{count, plural, one {# Fehler} other {# Fehler}}' } },
            },
          },
        ]}
      >
        <Flashbar items={items.slice(0, 1).concat(items[3])} stackItems={true} />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { expanded: false })).toHaveTextContent('2 Fehler');
    rerender(
      <Flashbar
        items={items}
        stackItems={true}
        i18nStrings={{ notificationBarText: 'Messages', itemCountText: (type, count) => `${type}: ${count}` }}
      />
    );
    expect(screen.getByRole('button', { expanded: false })).toHaveAccessibleName(
      'Messages error: 2 warning: 1 success: 1'
    );
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'flash', 'data-testid': 'flashbar', className: 'custom', items } as FlashbarProps;
    render(<Flashbar {...props} />);
    const root = screen.getByTestId('flashbar');
    expect(root).toHaveAttribute('id', 'flash');
    expect(root).not.toHaveClass('custom');
  });
});

describe('Flashbar test utilities and accessibility', () => {
  test('the wrapper reads an item', () => {
    const onDismiss = vi.fn();
    render(
      <Flashbar
        items={[
          {
            header: 'Quota reached',
            content: 'New instances cannot start.',
            action: <button>Request more</button>,
            dismissible: true,
            onDismiss,
          },
        ]}
      />
    );
    const [item] = createWrapper().findFlashbar()!.findItems();
    expect(item.findHeader()!.getText()).toBe('Quota reached');
    expect(item.findContent()!.getText()).toBe('New instances cannot start.');
    expect(item.findActionSlot()!.getText()).toBe('Request more');
    item.findDismissButton()!.click();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Flashbar
          items={[
            { type: 'success', header: 'Saved', dismissible: true },
            { type: 'warning', header: 'Expiring', action: <button>Renew</button> },
            { type: 'in-progress', loading: true, header: 'Creating' },
            { type: 'info', content: 'Maintenance on Sunday', statusIconAriaLabel: '' },
          ]}
        />
        <Flashbar items={items} stackItems={true} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
