// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import I18nProvider from '../../../lib/components/i18n';
import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: ButtonDropdownProps.Items = [
  { id: 'start', text: 'Start', iconName: 'play' },
  { id: 'stop', text: 'Stop', disabled: true, disabledReason: 'The instance is already stopped.' },
  { id: 'reboot', text: 'Reboot', description: 'Restarts the operating system', secondaryText: 'Ctrl+R' },
  { id: 'docs', text: 'Documentation', href: 'https://example.com/docs', external: true },
];

const grouped: ButtonDropdownProps.Items = [
  {
    id: 'state',
    text: 'Instance state',
    items: [
      { id: 'start', text: 'Start' },
      { id: 'stop', text: 'Stop' },
    ],
  },
  {
    id: 'view',
    text: 'View',
    items: [
      { id: 'wrap', text: 'Wrap lines', itemType: 'checkbox', checked: true },
      { id: 'numbers', text: 'Line numbers', itemType: 'checkbox', checked: false },
    ],
  },
  { id: 'delete', text: 'Delete' },
];

const getTrigger = () => screen.getByRole('button', { name: 'Actions' });
const getMenu = () => screen.getByRole('menu');
const menuItems = () => Array.from(getMenu().querySelectorAll<HTMLElement>('[role^="menuitem"]'));

function renderDropdown(props: Partial<ButtonDropdownProps> = {}) {
  return render(
    <ButtonDropdown items={items} {...props}>
      Actions
    </ButtonDropdown>
  );
}

function openWithKeyboard() {
  act(() => getTrigger().focus());
  fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
}

afterEach(() => {
  document.documentElement.removeAttribute('dir');
});

describe('ButtonDropdown', () => {
  test('renders a menu button', () => {
    renderDropdown();
    const trigger = getTrigger();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('opens on click with the menu focused and labelled by the trigger', () => {
    renderDropdown();
    fireEvent.mouseDown(getTrigger());
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger()).toHaveAttribute('aria-controls', getMenu().id);
    expect(getMenu()).toHaveAccessibleName('Actions');
    expect(getMenu()).toHaveFocus();
    expect(menuItems()).toHaveLength(4);
  });

  test('focuses the first item when opened with Enter or Space', () => {
    renderDropdown();
    act(() => getTrigger().focus());
    fireEvent.click(getTrigger());
    expect(screen.getByRole('menuitem', { name: 'Start' })).toHaveFocus();
  });

  test('opens on ArrowDown at the first item and on ArrowUp at the last', () => {
    renderDropdown();
    openWithKeyboard();
    expect(screen.getByRole('menuitem', { name: 'Start' })).toHaveFocus();
    fireEvent.keyDown(getMenu(), { key: 'Escape' });
    fireEvent.keyDown(getTrigger(), { key: 'ArrowUp' });
    expect(screen.getByRole('menuitem', { name: /Documentation/ })).toHaveFocus();
  });

  test('moves focus with the arrow keys, Home and End, wrapping around', () => {
    renderDropdown();
    openWithKeyboard();
    const [start, stop, reboot, docs] = menuItems();
    fireEvent.keyDown(start, { key: 'ArrowDown' });
    expect(stop).toHaveFocus();
    fireEvent.keyDown(stop, { key: 'ArrowDown' });
    expect(reboot).toHaveFocus();
    fireEvent.keyDown(reboot, { key: 'End' });
    expect(docs).toHaveFocus();
    fireEvent.keyDown(docs, { key: 'ArrowDown' });
    expect(start).toHaveFocus();
    fireEvent.keyDown(start, { key: 'ArrowUp' });
    expect(docs).toHaveFocus();
    fireEvent.keyDown(docs, { key: 'Home' });
    expect(start).toHaveFocus();
  });

  test('moves focus to an item by typing its first letters', () => {
    renderDropdown();
    openWithKeyboard();
    fireEvent.keyDown(menuItems()[0], { key: 'r' });
    expect(screen.getByRole('menuitem', { name: /Reboot/ })).toHaveFocus();
  });

  test('fires onItemClick and closes when an item is clicked', () => {
    const onItemClick = vi.fn();
    renderDropdown({ onItemClick });
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('menuitem', { name: 'Start' }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick.mock.calls[0][0].detail).toEqual({ id: 'start' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  test('chooses the focused item with Enter and Space', () => {
    const onItemClick = vi.fn();
    renderDropdown({ onItemClick });
    openWithKeyboard();
    fireEvent.keyDown(menuItems()[0], { key: 'Enter' });
    expect(onItemClick.mock.calls[0][0].detail.id).toBe('start');
    openWithKeyboard();
    fireEvent.keyDown(menuItems()[0], { key: 'ArrowDown' });
    fireEvent.keyDown(menuItems()[1], { key: 'ArrowDown' });
    fireEvent.keyDown(menuItems()[2], { key: ' ' });
    expect(onItemClick.mock.calls[1][0].detail.id).toBe('reboot');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('ignores the keyup of the Space that chose an item, so the menu stays closed', () => {
    renderDropdown();
    openWithKeyboard();
    fireEvent.keyDown(menuItems()[0], { key: ' ' });
    const keyUp = new KeyboardEvent('keyup', { key: ' ', bubbles: true, cancelable: true });
    act(() => {
      getTrigger().dispatchEvent(keyUp);
    });
    expect(keyUp.defaultPrevented).toBe(true);
  });

  test('keeps disabled items focusable but does not choose them', () => {
    const onItemClick = vi.fn();
    renderDropdown({ onItemClick });
    openWithKeyboard();
    const stop = screen.getByRole('menuitem', { name: 'Stop' });
    expect(stop).toHaveAttribute('aria-disabled', 'true');
    expect(stop).toHaveAccessibleDescription('The instance is already stopped.');
    fireEvent.keyDown(menuItems()[0], { key: 'ArrowDown' });
    expect(stop).toHaveFocus();
    fireEvent.click(stop);
    expect(onItemClick).not.toHaveBeenCalled();
    expect(getMenu()).toBeInTheDocument();
  });

  test('closes on Escape and returns focus to the trigger', () => {
    const onClose = vi.fn();
    render(
      <Modal visible={true} onDismiss={onClose} header="Instance">
        <ButtonDropdown items={items}>Actions</ButtonDropdown>
      </Modal>
    );
    openWithKeyboard();
    fireEvent.keyDown(menuItems()[0], { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(getTrigger()).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('closes when focus leaves and on a click outside', () => {
    render(
      <>
        <ButtonDropdown items={items}>Actions</ButtonDropdown>
        <button>Elsewhere</button>
      </>
    );
    openWithKeyboard();
    act(() => screen.getByRole('button', { name: 'Elsewhere' }).focus());
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(getTrigger());
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('closes when the trigger is clicked again', () => {
    renderDropdown();
    fireEvent.click(getTrigger());
    fireEvent.click(getTrigger());
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('renders link items that fire cancelable onItemClick and onItemFollow', () => {
    const onItemClick = vi.fn();
    const onItemFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    renderDropdown({ onItemClick, onItemFollow });
    fireEvent.click(getTrigger());
    const link = screen.getByRole('menuitem', { name: 'Documentation Opens in a new tab' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => {
      link.dispatchEvent(click);
    });
    const details = { id: 'docs', href: 'https://example.com/docs', external: true };
    expect(onItemClick.mock.calls[0][0].detail).toEqual(details);
    expect(onItemFollow.mock.calls[0][0].detail).toEqual(details);
    expect(click.defaultPrevented).toBe(true);
  });

  test('does not fire onItemFollow for a modified click', () => {
    const onItemFollow = vi.fn();
    renderDropdown({ onItemFollow });
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('menuitem', { name: /Documentation/ }), { ctrlKey: true });
    expect(onItemFollow).not.toHaveBeenCalled();
  });

  test('removes the link from disabled link items', () => {
    renderDropdown({ items: [{ id: 'docs', text: 'Docs', href: '/docs', disabled: true }] });
    fireEvent.click(getTrigger());
    expect(screen.getByRole('menuitem', { name: 'Docs' })).not.toHaveAttribute('href');
  });

  test('shows descriptions and secondary text', () => {
    renderDropdown();
    fireEvent.click(getTrigger());
    expect(screen.getByRole('menuitem', { name: /Reboot/ })).toHaveTextContent(
      'RebootRestarts the operating systemCtrl+R'
    );
  });

  test('renders groups with their items and checkbox items', () => {
    const onItemClick = vi.fn();
    renderDropdown({ items: grouped, onItemClick });
    fireEvent.click(getTrigger());
    const groups = screen.getAllByRole('group');
    expect(groups.map(group => group.getAttribute('aria-label'))).toEqual(['Instance state', 'View']);
    const wrap = screen.getByRole('menuitemcheckbox', { name: 'Wrap lines' });
    expect(wrap).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Line numbers' })).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(wrap);
    expect(onItemClick.mock.calls[0][0].detail).toEqual({ id: 'wrap', checked: false });
  });

  test('disables every item of a disabled group', () => {
    renderDropdown({ items: [{ text: 'Danger', disabled: true, items: [{ id: 'drop', text: 'Drop table' }] }] });
    fireEvent.click(getTrigger());
    expect(screen.getByRole('menuitem', { name: 'Drop table' })).toHaveAttribute('aria-disabled', 'true');
  });

  describe('expandable groups', () => {
    test('opens and closes groups in place with a click', () => {
      renderDropdown({ items: grouped, expandableGroups: true });
      fireEvent.click(getTrigger());
      const state = screen.getByRole('menuitem', { name: 'Instance state' });
      expect(state).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menuitem', { name: 'Start' })).toBeNull();
      fireEvent.click(state);
      expect(state).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('group', { name: 'Instance state' })).toContainElement(
        screen.getByRole('menuitem', { name: 'Start' })
      );
      fireEvent.click(state);
      expect(screen.queryByRole('menuitem', { name: 'Start' })).toBeNull();
    });

    test('opens with the forward arrow and closes with the backward arrow', () => {
      renderDropdown({ items: grouped, expandableGroups: true });
      openWithKeyboard();
      const state = screen.getByRole('menuitem', { name: 'Instance state' });
      expect(state).toHaveFocus();
      fireEvent.keyDown(state, { key: 'ArrowRight' });
      const start = screen.getByRole('menuitem', { name: 'Start' });
      expect(start).toHaveFocus();
      fireEvent.keyDown(start, { key: 'ArrowLeft' });
      expect(state).toHaveFocus();
      expect(state).toHaveAttribute('aria-expanded', 'false');
    });

    test('reverses the arrows in right-to-left layout', () => {
      document.documentElement.dir = 'rtl';
      render(
        <div style={{ direction: 'rtl' }}>
          <ButtonDropdown items={grouped} expandableGroups={true}>
            Actions
          </ButtonDropdown>
        </div>
      );
      openWithKeyboard();
      const state = screen.getByRole('menuitem', { name: 'Instance state' });
      fireEvent.keyDown(state, { key: 'ArrowLeft' });
      expect(screen.getByRole('menuitem', { name: 'Start' })).toHaveFocus();
    });

    test('collapses again when the menu reopens', () => {
      renderDropdown({ items: grouped, expandableGroups: true });
      fireEvent.click(getTrigger());
      fireEvent.click(screen.getByRole('menuitem', { name: 'Instance state' }));
      fireEvent.click(getTrigger());
      fireEvent.click(getTrigger());
      expect(screen.getByRole('menuitem', { name: 'Instance state' })).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('variants', () => {
    test('names icon triggers with ariaLabel or the built-in label', () => {
      render(
        <>
          <ButtonDropdown items={items} variant="icon" ariaLabel="Instance actions" />
          <ButtonDropdown items={items} variant="inline-icon" />
        </>
      );
      expect(screen.getByRole('button', { name: 'Instance actions' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
    });

    test('translates the built-in label', () => {
      render(
        <I18nProvider
          locale="de"
          messages={[{ '@ordinate/components': { de: { 'button-dropdown': { ariaLabel: 'Weitere Aktionen' } } } }]}
        >
          <ButtonDropdown items={items} variant="icon" />
        </I18nProvider>
      );
      expect(screen.getByRole('button', { name: 'Weitere Aktionen' })).toBeInTheDocument();
    });

    test('renders a split button with a main action', () => {
      const onClick = vi.fn();
      render(
        <ButtonDropdown
          items={items}
          variant="primary"
          mainAction={{ text: 'Launch', onClick }}
          ariaLabel="Launch options"
        />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Launch' }));
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Launch options' }));
      expect(getMenu()).toHaveAccessibleName('Launch options');
    });

    test('cannot be opened while disabled or loading', () => {
      const { rerender } = renderDropdown({ disabled: true });
      fireEvent.click(getTrigger());
      fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
      expect(screen.queryByRole('menu')).toBeNull();
      rerender(
        <ButtonDropdown items={items} loading={true}>
          Actions
        </ButtonDropdown>
      );
      fireEvent.click(getTrigger());
      fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
      expect(screen.queryByRole('menu')).toBeNull();
    });
  });

  test('focuses the trigger through the ref', () => {
    const ref = React.createRef<ButtonDropdownProps.Ref>();
    render(
      <ButtonDropdown ref={ref} items={items}>
        Actions
      </ButtonDropdown>
    );
    act(() => ref.current!.focus());
    expect(getTrigger()).toHaveFocus();
  });

  test('positions the menu against the viewport with expandToViewport', () => {
    renderDropdown({ expandToViewport: true });
    fireEvent.click(getTrigger());
    const popup = getMenu().closest<HTMLElement>('[style]')!;
    expect(popup.style.left).not.toBe('');
  });

  test('exposes its parts through the test-utils wrapper', () => {
    const onItemClick = vi.fn();
    const { container } = render(
      <ButtonDropdown items={grouped} expandableGroups={true} onItemClick={onItemClick}>
        Actions
      </ButtonDropdown>
    );
    const wrapper = createWrapper(container).findButtonDropdown()!;
    expect(wrapper.isOpen()).toBe(false);
    expect(wrapper.findMenu()).toBeNull();
    expect(wrapper.findMainAction()).toBeNull();
    wrapper.openDropdown();
    expect(wrapper.findItems()).toHaveLength(3);
    wrapper.findExpandableGroupById('state')!.click();
    wrapper.clickItem('stop');
    expect(onItemClick.mock.calls[0][0].detail.id).toBe('stop');
    expect(() => wrapper.clickItem('missing')).toThrow();
  });

  test('finds the reason of a disabled item through the test-utils wrapper', () => {
    const { container } = renderDropdown();
    const wrapper = createWrapper(container).findButtonDropdown()!;
    wrapper.openDropdown();
    expect(wrapper.findDisabledReason('stop')!.getText()).toBe('The instance is already stopped.');
    expect(wrapper.findTrigger().getElement()).toBe(getTrigger());
  });

  test('has no accessibility violations, closed and open', async () => {
    const { container } = render(<ButtonDropdown items={[...grouped, ...items.slice(1)]}>Actions</ButtonDropdown>);
    await expectNoAxeViolations(container);
    fireEvent.click(getTrigger());
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations with expanded groups', async () => {
    const { container } = render(
      <ButtonDropdown items={grouped} expandableGroups={true}>
        Actions
      </ButtonDropdown>
    );
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('menuitem', { name: 'View' }));
    await expectNoAxeViolations(container);
  });
});
