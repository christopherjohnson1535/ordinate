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
  { id: 'deploy', type: 'fault', header: 'Deployment failed', content: 'Two nodes did not respond.' },
  { id: 'cert', type: 'caution', header: 'Certificate expires soon' },
  { id: 'backup', type: 'complete', header: 'Backup complete' },
  { id: 'patch', type: 'fault', header: 'Patch failed' },
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

  test('draws each item as a margin note, its type named in the margin', () => {
    render(<Flashbar items={items} />);
    const notes = createWrapper().findFlashbar()!.findItems();
    expect(notes.map(note => note.findCaption().getText())).toEqual(['Fault', 'Caution', 'Complete', 'Fault']);
    expect(createWrapper().findAllAlerts()).toHaveLength(4);
  });

  test('the status icon is decorative unless statusIconAriaLabel or an i18n label is set', () => {
    render(
      <Flashbar
        items={[
          { type: 'fault', header: 'A' },
          { type: 'note', header: 'B', statusIconAriaLabel: 'Note' },
          { header: 'C' },
        ]}
        i18nStrings={{ errorIconAriaLabel: 'Error' }}
      />
    );
    expect(screen.getAllByRole('img').map(icon => icon.getAttribute('aria-label'))).toEqual(['Error', 'Note']);
  });

  test('accepts the old type names with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Flashbar
        items={[
          { type: 'error', header: 'A' },
          { type: 'success', header: 'B' },
          { type: 'in-progress', header: 'C' },
        ]}
      />
    );
    const wrapper = createWrapper().findFlashbar()!;
    expect(wrapper.findItemsByType('fault')).toHaveLength(1);
    expect(wrapper.findItemsByType('success')).toHaveLength(1);
    expect(wrapper.findItems()[2].isUnderway()).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"error" is now called "fault"'));
    warn.mockRestore();
  });

  test('a loading item shows the underway spinner and an Underway caption', () => {
    render(<Flashbar items={[{ type: 'note', loading: true, header: 'Creating instance' }]} />);
    const item = createWrapper().findFlashbar()!.findItems()[0];
    expect(item.isUnderway()).toBe(true);
    expect(item.findCaption().getText()).toBe('Underway');
    expect(item.findStatusIcon().getElement().querySelector('svg')).not.toBeNull();
  });

  test('announces new items politely and alert items assertively', () => {
    vi.useFakeTimers();
    const { rerender } = render(<Flashbar items={[]} />);
    rerender(
      <Flashbar
        items={[
          { id: 'a', type: 'complete', header: 'Saved' },
          { id: 'b', type: 'fault', header: 'Quota reached', ariaRole: 'alert' },
        ]}
      />
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Complete Saved');
    expect(document.querySelector('[aria-live="assertive"]')).toHaveTextContent('Fault Quota reached');
  });

  test('announces an item again when its text changes', () => {
    vi.useFakeTimers();
    const { rerender } = render(<Flashbar items={[{ id: 'a', loading: true, header: 'Creating' }]} />);
    act(() => {
      vi.runAllTimers();
    });
    expect(liveText()).toEqual(['Underway Creating']);
    rerender(<Flashbar items={[{ id: 'a', type: 'complete', header: 'Created' }]} />);
    act(() => {
      vi.runAllTimers();
    });
    expect(liveText()).toEqual(['Complete Created']);
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

  test('a stack shows the first item and a summary that keys each type with a count', () => {
    render(<Flashbar items={[...items, { id: 'run', loading: true, header: 'Restarting' }]} stackItems={true} />);
    const wrapper = createWrapper().findFlashbar()!;
    expect(wrapper.findItems().map(item => item.findHeader()!.getText())).toEqual(['Deployment failed']);
    expect(wrapper.findSummaryCounts().map(count => count.getText())).toEqual([
      '2 faults',
      '1 caution',
      '1 complete',
      '1 underway',
    ]);
    expect(screen.getByRole('group', { name: 'Notifications' })).toBe(wrapper.findSummary()!.getElement());
    const button = screen.getByRole('button', { name: 'Show all 5' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(button.getAttribute('aria-controls')!)).toBe(
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
              de: { flashbar: { faultCount: '{count, plural, one {# Fehler} other {# Fehler}}' } },
            },
          },
        ]}
      >
        <Flashbar items={items.slice(0, 1).concat(items[3])} stackItems={true} />
      </I18nProvider>
    );
    expect(createWrapper().findFlashbar()!.findSummaryCounts()[0].getText()).toBe('2 Fehler');
    rerender(
      <Flashbar
        items={items}
        stackItems={true}
        i18nStrings={{
          showAllText: count => `All ${count}`,
          itemCountText: (type, count) => `${type}: ${count}`,
        }}
      />
    );
    const wrapper = createWrapper().findFlashbar()!;
    expect(wrapper.findSummaryCounts().map(count => count.getText())).toEqual([
      'fault: 2',
      'caution: 1',
      'complete: 1',
    ]);
    expect(wrapper.findNotificationBar()!.getElement()).toHaveAccessibleName('All 4');
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
            { type: 'complete', header: 'Saved', dismissible: true },
            { type: 'caution', header: 'Expiring', action: <button>Renew</button> },
            { type: 'note', loading: true, header: 'Creating' },
            { type: 'note', content: 'Maintenance on Sunday', statusIconAriaLabel: '' },
          ]}
        />
        <Flashbar items={items} stackItems={true} />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
