// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import CollectionPreferences, { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import I18nProvider from '../../../lib/components/i18n';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

type Preferences = CollectionPreferencesProps.Preferences<string>;

const columns: CollectionPreferencesProps.ContentDisplayOption[] = [
  { id: 'name', label: 'Name', alwaysVisible: true },
  { id: 'zone', label: 'Zone' },
  { id: 'status', label: 'Status' },
  { id: 'cpu', label: 'CPU' },
];

const allPreferences: Partial<CollectionPreferencesProps<string>> = {
  pageSizePreference: {
    title: 'Instances per page',
    options: [{ value: 10, label: '10 instances' }, { value: 25, label: '25 instances' }, { value: 50 }],
  },
  wrapLinesPreference: {},
  stripedRowsPreference: {},
  contentDensityPreference: {},
  stickyColumnsPreference: {
    firstColumns: {
      options: [
        { value: 0, label: 'None' },
        { value: 1, label: 'First column' },
      ],
    },
    lastColumns: {
      options: [
        { value: 0, label: 'None' },
        { value: 1, label: 'Last column' },
      ],
    },
  },
  contentDisplayPreference: { options: columns },
};

const initial: Preferences = {
  pageSize: 10,
  wrapLines: false,
  stripedRows: false,
  contentDensity: 'comfortable',
  stickyColumns: { first: 0, last: 0 },
  contentDisplay: [
    { id: 'name', visible: true },
    { id: 'status', visible: true },
    { id: 'zone', visible: false },
    { id: 'cpu', visible: true },
  ],
  visibleContent: ['name'],
  custom: 'blue',
};

function renderPreferences(props: Partial<CollectionPreferencesProps<string>> = {}) {
  const result = render(<CollectionPreferences<string> {...allPreferences} preferences={initial} {...props} />);
  return { ...result, wrapper: createWrapper().findCollectionPreferences()! };
}

function openModal() {
  const wrapper = createWrapper().findCollectionPreferences()!;
  wrapper.findTriggerButton().click();
  return wrapper;
}

function labels() {
  const display = createWrapper().findCollectionPreferences()!.findContentDisplayPreference()!;
  return display.findOptions().map(option => option.findLabel().getText());
}

afterEach(() => {
  vi.useRealTimers();
});

describe('CollectionPreferences', () => {
  test('renders a settings button named by the title, with the modal closed', () => {
    const { wrapper } = renderPreferences();
    const trigger = screen.getByRole('button', { name: 'Preferences' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(wrapper.findTriggerButton().findIcon()).not.toBeNull();
    expect(wrapper.findModal()).toBeNull();
  });

  test('opens a modal with the title and the actions', () => {
    renderPreferences();
    openModal();
    expect(screen.getByRole('dialog', { name: 'Preferences' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('confirm applies every change and closes the modal', () => {
    const onConfirm = vi.fn();
    const { wrapper } = renderPreferences({
      onConfirm: event => onConfirm(event.detail),
      customPreference: (value, setValue) => <button onClick={() => setValue('green')}>Custom value: {value}</button>,
    });
    openModal();
    fireEvent.click(screen.getByRole('radio', { name: '25 instances' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Wrap lines/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Striped rows/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Compact mode/ }));
    fireEvent.click(screen.getByRole('radio', { name: 'First column' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Last column' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Zone' }));
    fireEvent.click(screen.getByRole('button', { name: 'Custom value: blue' }));
    wrapper.findConfirmButton()!.click();

    expect(onConfirm).toHaveBeenCalledWith({
      pageSize: 25,
      wrapLines: true,
      stripedRows: true,
      contentDensity: 'compact',
      stickyColumns: { first: 1, last: 1 },
      contentDisplay: [
        { id: 'name', visible: true },
        { id: 'status', visible: true },
        { id: 'zone', visible: true },
        { id: 'cpu', visible: true },
      ],
      visibleContent: ['name'],
      custom: 'green',
    });
    expect(wrapper.findModal()).toBeNull();
  });

  test('confirm without changes passes the preferences through', () => {
    const onConfirm = vi.fn();
    renderPreferences({ onConfirm: event => onConfirm(event.detail) });
    openModal().findConfirmButton()!.click();
    expect(onConfirm).toHaveBeenCalledWith(initial);
  });

  test('cancel discards the changes', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { wrapper } = renderPreferences({ onConfirm, onCancel });
    openModal();
    fireEvent.click(screen.getByRole('radio', { name: '25 instances' }));
    wrapper.findCancelButton()!.click();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(wrapper.findModal()).toBeNull();

    openModal();
    expect(wrapper.findPageSizePreference()!.getSelectedValue()).toBe('10');
  });

  test.each([
    ['the close button', () => createWrapper().findModal()!.findDismissButton()!.click()],
    ['Escape', () => createWrapper().findModal()!.pressEscape()],
  ])('%s cancels', (_, dismiss) => {
    const onCancel = vi.fn();
    const { wrapper } = renderPreferences({ onCancel });
    openModal();
    dismiss();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(wrapper.findModal()).toBeNull();
  });

  test('starts from the latest preferences each time it opens', () => {
    const { rerender, wrapper } = renderPreferences();
    rerender(<CollectionPreferences<string> {...allPreferences} preferences={{ ...initial, pageSize: 50 }} />);
    openModal();
    expect(wrapper.findPageSizePreference()!.getSelectedValue()).toBe('50');
  });

  test('returns focus to the settings button after closing', () => {
    renderPreferences();
    const trigger = screen.getByRole('button', { name: 'Preferences' });
    trigger.focus();
    openModal().findCancelButton()!.click();
    expect(trigger).toHaveFocus();
  });

  test('disabled disables the settings button', () => {
    const { wrapper } = renderPreferences({ disabled: true });
    expect(wrapper.findTriggerButton().isDisabled()).toBe(true);
  });

  test('works as a controlled pair with the application state', () => {
    function Example() {
      const [preferences, setPreferences] = useState<Preferences>({ pageSize: 10 });
      return (
        <>
          <CollectionPreferences<string>
            pageSizePreference={allPreferences.pageSizePreference}
            preferences={preferences}
            onConfirm={event => setPreferences(event.detail)}
          />
          <output>Page size {preferences.pageSize}</output>
        </>
      );
    }
    render(<Example />);
    const wrapper = openModal();
    fireEvent.click(screen.getByRole('radio', { name: '50' }));
    expect(screen.getByText('Page size 10')).toBeInTheDocument();
    wrapper.findConfirmButton()!.click();
    expect(screen.getByText('Page size 50')).toBeInTheDocument();
  });
});

describe('CollectionPreferences controls', () => {
  test('shows only the preferences that are set', () => {
    render(<CollectionPreferences wrapLinesPreference={{}} />);
    const wrapper = openModal();
    expect(wrapper.findWrapLinesPreference()).not.toBeNull();
    expect(wrapper.findPageSizePreference()).toBeNull();
    expect(wrapper.findStripedRowsPreference()).toBeNull();
    expect(wrapper.findContentDensityPreference()).toBeNull();
    expect(wrapper.findStickyFirstColumnsPreference()).toBeNull();
    expect(wrapper.findContentDisplayPreference()).toBeNull();
    expect(wrapper.findCustomPreference()).toBeNull();
  });

  test('uses built-in labels and descriptions', () => {
    const { wrapper } = renderPreferences({ pageSizePreference: { options: [{ value: 10 }] } });
    openModal();
    expect(screen.getByText('Page size')).toBeInTheDocument();
    expect(wrapper.findWrapLinesPreference()!.findLabel()!.getText()).toBe('Wrap lines');
    expect(wrapper.findWrapLinesPreference()!.findDescription()!.getText()).toBe(
      'Show all of the text by wrapping long lines.'
    );
    expect(wrapper.findStripedRowsPreference()!.findLabel()!.getText()).toBe('Striped rows');
    expect(wrapper.findContentDensityPreference()!.findLabel()!.getText()).toBe('Compact mode');
    expect(screen.getByRole('radiogroup', { name: 'Stick first columns' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Stick last columns' })).toBeInTheDocument();
    expect(wrapper.findContentDisplayPreference()!.findTitle().getText()).toBe('Column preferences');
  });

  test('props replace the built-in text', () => {
    renderPreferences({
      title: 'Table settings',
      confirmLabel: 'Apply',
      cancelLabel: 'Keep',
      wrapLinesPreference: { label: 'Wrap text', description: 'Long names wrap.' },
      contentDisplayPreference: { title: 'Columns', description: 'Pick columns.', options: columns },
    });
    const wrapper = openModal();
    expect(screen.getByRole('dialog', { name: 'Table settings' })).toBeInTheDocument();
    expect(wrapper.findConfirmButton()!.getText()).toBe('Apply');
    expect(wrapper.findCancelButton()!.getText()).toBe('Keep');
    expect(screen.getByRole('checkbox', { name: /Wrap text/ })).toBeInTheDocument();
    expect(wrapper.findContentDisplayPreference()!.findDescription()!.getText()).toBe('Pick columns.');
  });

  test('the I18nProvider replaces the built-in text', () => {
    const messages = {
      '@ordinate-ui/components': { en: { 'collection-preferences': { title: 'Settings', confirmLabel: 'Save' } } },
    };
    render(
      <I18nProvider messages={[messages]} locale="en">
        <CollectionPreferences wrapLinesPreference={{}} />
      </I18nProvider>
    );
    openModal();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('renders the page size options with their values as fallback labels', () => {
    const { wrapper } = renderPreferences();
    openModal();
    const group = screen.getByRole('radiogroup', { name: 'Instances per page' });
    expect(group).toBeInTheDocument();
    expect(wrapper.findPageSizePreference()!.findButtons()).toHaveLength(3);
    expect(screen.getByRole('radio', { name: '50' })).toBeInTheDocument();
  });

  test('a preference without a value starts unselected', () => {
    const { wrapper } = renderPreferences({ preferences: {} });
    openModal();
    expect(wrapper.findPageSizePreference()!.getSelectedValue()).toBeNull();
    expect(wrapper.findWrapLinesPreference()!.isChecked()).toBe(false);
  });

  test('custom preference receives the value and a setter', () => {
    const customPreference = vi.fn((value: string | undefined) => <span>Theme {value}</span>);
    const { wrapper } = renderPreferences({ customPreference });
    openModal();
    expect(wrapper.findCustomPreference()!.getText()).toBe('Theme blue');
    expect(customPreference).toHaveBeenLastCalledWith('blue', expect.any(Function));
  });
});

describe('CollectionPreferences content display', () => {
  test('lists the columns in the stored order with their visibility', () => {
    const { wrapper } = renderPreferences();
    openModal();
    expect(labels()).toEqual(['Name', 'Status', 'Zone', 'CPU']);
    const display = wrapper.findContentDisplayPreference()!;
    expect(display.findOptionByLabel('Zone')!.findVisibilityToggle().isChecked()).toBe(false);
    expect(display.findOptionByLabel('Status')!.findVisibilityToggle().isChecked()).toBe(true);
    expect(screen.getByRole('list', { name: 'Column preferences' })).toBeInTheDocument();
  });

  test('always-visible columns cannot be hidden', () => {
    const { wrapper } = renderPreferences();
    openModal();
    const toggle = wrapper.findContentDisplayPreference()!.findOptionByLabel('Name')!.findVisibilityToggle();
    expect(toggle.isChecked()).toBe(true);
    expect(toggle.isDisabled()).toBe(true);
  });

  test('adds columns missing from the stored order at the end, hidden', () => {
    const onConfirm = vi.fn();
    renderPreferences({
      preferences: {
        contentDisplay: [
          { id: 'cpu', visible: true },
          { id: 'gone', visible: true },
        ],
      },
      onConfirm: event => onConfirm(event.detail),
    });
    openModal().findConfirmButton()!.click();
    expect(onConfirm.mock.calls[0][0].contentDisplay).toEqual([
      { id: 'cpu', visible: true },
      { id: 'name', visible: true },
      { id: 'zone', visible: false },
      { id: 'status', visible: false },
    ]);
  });

  test('shows every column in option order without a stored order', () => {
    renderPreferences({ preferences: {} });
    openModal();
    expect(labels()).toEqual(['Name', 'Zone', 'Status', 'CPU']);
    expect(screen.getAllByRole('switch').every(toggle => (toggle as HTMLInputElement).checked)).toBe(true);
  });

  test('move buttons reorder the columns and are disabled at the ends', () => {
    const onConfirm = vi.fn();
    const { wrapper } = renderPreferences({ onConfirm: event => onConfirm(event.detail) });
    openModal();
    const display = wrapper.findContentDisplayPreference()!;
    expect(display.findOptions()[0].findMoveUpButton().isDisabled()).toBe(true);
    expect(display.findOptions()[3].findMoveDownButton().isDisabled()).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Move Zone up' }));
    expect(labels()).toEqual(['Name', 'Zone', 'Status', 'CPU']);
    fireEvent.click(screen.getByRole('button', { name: 'Move Name down' }));
    expect(labels()).toEqual(['Zone', 'Name', 'Status', 'CPU']);

    wrapper.findConfirmButton()!.click();
    expect(onConfirm.mock.calls[0][0].contentDisplay.map((item: { id: string }) => item.id)).toEqual([
      'zone',
      'name',
      'status',
      'cpu',
    ]);
  });

  test('keyboard focus follows the moved column', () => {
    renderPreferences();
    openModal();
    const moveDown = screen.getByRole('button', { name: 'Move Status down' });
    moveDown.focus();
    fireEvent.click(moveDown);
    expect(screen.getByRole('button', { name: 'Move Status down' })).toHaveFocus();
    expect(labels()).toEqual(['Name', 'Zone', 'Status', 'CPU']);

    // At the last place the down button is disabled, so focus moves to the up button.
    fireEvent.click(screen.getByRole('button', { name: 'Move Status down' }));
    expect(labels()).toEqual(['Name', 'Zone', 'CPU', 'Status']);
    expect(screen.getByRole('button', { name: 'Move Status up' })).toHaveFocus();
  });

  test('announces each move', () => {
    vi.useFakeTimers();
    renderPreferences();
    openModal();
    fireEvent.click(screen.getByRole('button', { name: 'Move CPU up' }));
    act(() => {
      vi.runAllTimers();
    });
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('CPU moved to position 3 of 4');
  });

  test('i18nStrings replace the built-in names and announcements', () => {
    vi.useFakeTimers();
    renderPreferences({
      contentDisplayPreference: {
        options: columns,
        i18nStrings: {
          moveUpAriaLabel: label => `Raise ${label}`,
          moveDownAriaLabel: label => `Lower ${label}`,
          itemMovedAnnouncement: (label, position, total) => `${label} is now ${position}/${total}`,
        },
      },
    });
    openModal();
    expect(screen.getByRole('button', { name: 'Lower Zone' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Raise Zone' }));
    act(() => {
      vi.runAllTimers();
    });
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Zone is now 2/4');
  });

  test('columns can be dragged by their handle', () => {
    vi.useFakeTimers();
    const { wrapper } = renderPreferences();
    openModal();
    const display = wrapper.findContentDisplayPreference()!;
    const rows = display.findOptions().map(option => option.getElement());
    rows.forEach((row, index) => {
      row.getBoundingClientRect = () => ({ top: index * 40, height: 40 }) as DOMRect;
    });

    display
      .findOptionByLabel('Name')!
      .findDragHandle()
      .fireEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
    expect(display.findOptionByLabel('Name')!.getElement().className).not.toBe(rows[1].className);
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 100 }));
    });
    expect(labels()).toEqual(['Status', 'Zone', 'Name', 'CPU']);
    act(() => {
      window.dispatchEvent(new MouseEvent('pointerup'));
    });
    act(() => {
      vi.runAllTimers();
    });
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Name moved to position 3 of 4');
  });

  test('ignores drags with other mouse buttons', () => {
    const { wrapper } = renderPreferences();
    openModal();
    const display = wrapper.findContentDisplayPreference()!;
    display
      .findOptionByLabel('Name')!
      .findDragHandle()
      .fireEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 2 }));
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 500 }));
    });
    expect(labels()).toEqual(['Name', 'Status', 'Zone', 'CPU']);
  });

  test('uses two columns only when there are settings beside the column list', () => {
    const { unmount } = renderPreferences();
    openModal();
    const twoColumnLayout = createWrapper().findCollectionPreferences()!.findContentDisplayPreference()!.getElement()
      .parentElement!.parentElement!.className;
    unmount();
    render(<CollectionPreferences contentDisplayPreference={{ options: columns }} />);
    openModal();
    const singleLayout = createWrapper().findCollectionPreferences()!.findContentDisplayPreference()!.getElement()
      .parentElement!.parentElement!.className;
    expect(singleLayout).not.toBe(twoColumnLayout);
  });
});

describe('CollectionPreferences accessibility', () => {
  test('has no accessibility violations when closed', async () => {
    const { container } = renderPreferences();
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations when open', async () => {
    renderPreferences({ customPreference: () => <p>Custom settings</p> });
    openModal();
    await expectNoAxeViolations(document.body);
  });
});
