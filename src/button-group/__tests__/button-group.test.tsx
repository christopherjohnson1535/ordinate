// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import Modal from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: ButtonGroupProps.ItemOrGroup[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      { type: 'icon-toggle-button', id: 'like', text: 'Helpful', iconName: 'thumbs-up', pressed: false },
      {
        type: 'icon-toggle-button',
        id: 'dislike',
        text: 'Not helpful',
        iconName: 'thumbs-down',
        pressedIconName: 'thumbs-down-filled',
        pressed: true,
      },
    ],
  },
  {
    type: 'group',
    text: 'Actions',
    items: [
      { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy', popoverFeedback: 'Copied' },
      { type: 'icon-button', id: 'share', text: 'Share', iconName: 'share', disabled: true },
      { type: 'icon-button', id: 'retry', text: 'Retry', iconName: 'refresh' },
    ],
  },
  {
    type: 'menu-dropdown',
    id: 'more',
    text: 'More actions',
    items: [
      { id: 'report', text: 'Report' },
      { id: 'wrap', text: 'Wrap lines', itemType: 'checkbox', checked: false },
    ],
  },
];

function renderGroup(props: Partial<ButtonGroupProps> = {}, ref?: React.Ref<ButtonGroupProps.Ref>) {
  return render(<ButtonGroup ref={ref} ariaLabel="Response actions" items={items} {...props} />);
}

const button = (name: string) => screen.getByRole('button', { name });
const wrapper = () => createWrapper().findButtonGroup()!;
const tabStops = () =>
  Array.from(screen.getByRole('toolbar').querySelectorAll<HTMLElement>('button')).filter(
    element => element.tabIndex === 0
  );

afterEach(() => {
  document.documentElement.removeAttribute('dir');
  vi.useRealTimers();
});

describe('ButtonGroup', () => {
  test('renders a labelled toolbar with labelled groups', () => {
    renderGroup();
    expect(screen.getByRole('toolbar', { name: 'Response actions' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Feedback' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Actions' })).toBeInTheDocument();
    expect(wrapper().findGroups()).toHaveLength(2);
  });

  test('names every action by its text', () => {
    renderGroup();
    for (const name of ['Helpful', 'Not helpful', 'Copy', 'Share', 'Retry', 'More actions']) {
      expect(button(name)).toBeInTheDocument();
    }
    expect(button('More actions')).toHaveAttribute('aria-haspopup', 'menu');
    expect(button('Share')).toBeDisabled();
  });

  test('toggle buttons show their pressed state', () => {
    renderGroup();
    expect(button('Helpful')).toHaveAttribute('aria-pressed', 'false');
    expect(button('Not helpful')).toHaveAttribute('aria-pressed', 'true');
  });

  test('fires onItemClick with the id, and the new state for toggles', () => {
    const onItemClick = vi.fn();
    renderGroup({ onItemClick });
    fireEvent.click(button('Retry'));
    expect(onItemClick).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { id: 'retry' } }));
    fireEvent.click(button('Helpful'));
    expect(onItemClick).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { id: 'like', pressed: true } }));
    fireEvent.click(button('Not helpful'));
    expect(onItemClick).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { id: 'dislike', pressed: false } })
    );
  });

  test('fires onItemClick for menu items, with checked for checkbox items', () => {
    const onItemClick = vi.fn();
    renderGroup({ onItemClick });
    const menu = wrapper().findMenuById('more')!;
    menu.clickItem('report');
    expect(onItemClick).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { id: 'report' } }));
    menu.clickItem('wrap');
    expect(onItemClick).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { id: 'wrap', checked: true } }));
  });

  test('disabled and loading actions do not fire onItemClick', () => {
    const onItemClick = vi.fn();
    renderGroup({
      onItemClick,
      items: [
        { type: 'icon-button', id: 'share', text: 'Share', iconName: 'share', disabled: true },
        { type: 'icon-button', id: 'save', text: 'Save', iconName: 'download', loading: true, loadingText: 'Saving' },
      ],
    });
    wrapper().findButtonById('share')!.click();
    wrapper().findButtonById('save')!.click();
    expect(onItemClick).not.toHaveBeenCalled();
    expect(wrapper().findButtonById('save')!.isLoading()).toBe(true);
  });

  test('shows popover feedback in a live region after a click and hides it after a moment', () => {
    vi.useFakeTimers();
    renderGroup();
    fireEvent.click(button('Copy'));
    expect(screen.getByRole('status')).toHaveTextContent('');
    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
    expect(wrapper().findPopoverFeedbackById('copy')!.getText()).toBe('Copied');
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('Escape hides popover feedback without closing a surrounding modal', () => {
    const onDismiss = vi.fn();
    render(
      <Modal visible={true} header="Answer" onDismiss={onDismiss}>
        <ButtonGroup ariaLabel="Response actions" items={items} />
      </Modal>
    );
    act(() => button('Copy').focus());
    fireEvent.click(button('Copy'));
    fireEvent.keyDown(button('Copy'), { key: 'Escape' });
    expect(screen.queryByRole('status')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('actions without feedback show none', () => {
    renderGroup();
    fireEvent.click(button('Retry'));
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('shows the text in a tooltip on focus, without repeating it as a description', () => {
    renderGroup();
    act(() => button('Retry').focus());
    expect(wrapper().findTooltipById('retry')!.isVisible()).toBe(true);
    expect(wrapper().findTooltipById('retry')!.findContent().getText()).toBe('Retry');
    expect(button('Retry')).not.toHaveAttribute('aria-describedby');
  });

  test('hides the tooltip while popover feedback shows', () => {
    renderGroup();
    act(() => button('Copy').focus());
    fireEvent.click(button('Copy'));
    expect(wrapper().findTooltipById('copy')!.isVisible()).toBe(false);
  });

  test('the menu button has a tooltip too', () => {
    renderGroup();
    act(() => button('More actions').focus());
    expect(wrapper().findTooltipById('more')!.isVisible()).toBe(true);
  });

  test('draws a divider between groups', () => {
    const { container } = renderGroup({
      items: [
        { type: 'icon-button', id: 'a', text: 'A', iconName: 'copy' },
        { type: 'icon-button', id: 'b', text: 'B', iconName: 'copy' },
        { type: 'group', text: 'G', items: [{ type: 'icon-button', id: 'c', text: 'C', iconName: 'copy' }] },
        { type: 'icon-button', id: 'd', text: 'D', iconName: 'copy' },
      ],
    });
    const toolbar = container.querySelector('[role="toolbar"]')!;
    const dividers = Array.from(toolbar.children).filter(child => child.getAttribute('aria-hidden') === 'true');
    expect(dividers).toHaveLength(2);
  });
});

describe('ButtonGroup keyboard', () => {
  test('has a single tab stop on the first enabled action', () => {
    renderGroup();
    expect(tabStops()).toEqual([button('Helpful')]);
  });

  test('skips a disabled first action for the tab stop', () => {
    renderGroup({
      items: [
        { type: 'icon-button', id: 'share', text: 'Share', iconName: 'share', disabled: true },
        { type: 'icon-button', id: 'retry', text: 'Retry', iconName: 'refresh' },
      ],
    });
    expect(tabStops()).toEqual([button('Retry')]);
  });

  test('arrow keys move across groups and skip disabled actions', () => {
    renderGroup();
    act(() => button('Helpful').focus());
    fireEvent.keyDown(button('Helpful'), { key: 'ArrowRight' });
    expect(button('Not helpful')).toHaveFocus();
    fireEvent.keyDown(button('Not helpful'), { key: 'ArrowRight' });
    expect(button('Copy')).toHaveFocus();
    fireEvent.keyDown(button('Copy'), { key: 'ArrowRight' });
    expect(button('Retry')).toHaveFocus();
    fireEvent.keyDown(button('Retry'), { key: 'ArrowRight' });
    expect(button('More actions')).toHaveFocus();
    fireEvent.keyDown(button('More actions'), { key: 'ArrowRight' });
    expect(button('Helpful')).toHaveFocus();
    fireEvent.keyDown(button('Helpful'), { key: 'ArrowLeft' });
    expect(button('More actions')).toHaveFocus();
  });

  test('Home and End move to the first and last actions', () => {
    renderGroup();
    act(() => button('Copy').focus());
    fireEvent.keyDown(button('Copy'), { key: 'End' });
    expect(button('More actions')).toHaveFocus();
    fireEvent.keyDown(button('More actions'), { key: 'Home' });
    expect(button('Helpful')).toHaveFocus();
  });

  test('the tab stop follows focus', () => {
    renderGroup();
    act(() => button('Helpful').focus());
    fireEvent.keyDown(button('Helpful'), { key: 'End' });
    expect(tabStops()).toEqual([button('More actions')]);
  });

  test('arrow keys follow the reading direction in right-to-left layout', () => {
    document.documentElement.setAttribute('dir', 'rtl');
    renderGroup();
    act(() => button('Helpful').focus());
    fireEvent.keyDown(button('Helpful'), { key: 'ArrowLeft' });
    expect(button('Not helpful')).toHaveFocus();
    fireEvent.keyDown(button('Not helpful'), { key: 'ArrowRight' });
    expect(button('Helpful')).toHaveFocus();
  });

  test('keys in an open menu stay in the menu', () => {
    renderGroup();
    act(() => button('More actions').focus());
    fireEvent.keyDown(button('More actions'), { key: 'ArrowDown' });
    const menuItem = screen.getByRole('menuitem', { name: 'Report' });
    expect(menuItem).toHaveFocus();
    fireEvent.keyDown(menuItem, { key: 'Home' });
    expect(screen.getByRole('menuitem', { name: 'Report' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Report' }), { key: 'ArrowRight' });
    expect(button('Helpful')).not.toHaveFocus();
  });

  test('the ref focuses an action by id', () => {
    const ref = React.createRef<ButtonGroupProps.Ref>();
    renderGroup({}, ref);
    act(() => ref.current!.focus('retry'));
    expect(button('Retry')).toHaveFocus();
    expect(tabStops()).toEqual([button('Retry')]);
  });

  test('passes id and data attributes to the root', () => {
    renderGroup({ id: 'actions', ...{ 'data-testid': 'group' } });
    expect(wrapper().getElement()).toHaveAttribute('id', 'actions');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'group');
  });
});

describe('ButtonGroup accessibility', () => {
  test('has no violations', async () => {
    renderGroup();
    await expectNoAxeViolations(document.body);
  });

  test('has no violations with feedback and a tooltip shown', async () => {
    renderGroup();
    act(() => button('Retry').focus());
    fireEvent.click(button('Copy'));
    await expectNoAxeViolations(document.body);
  });

  test('has no violations with the menu open', async () => {
    renderGroup();
    wrapper().findMenuById('more')!.openDropdown();
    await expectNoAxeViolations(document.body);
  });
});
