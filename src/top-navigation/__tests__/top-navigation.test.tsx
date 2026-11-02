// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';
import TopNavigation, { TopNavigationProps } from '../../../lib/components/top-navigation';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const identity: TopNavigationProps.Identity = {
  href: '#/',
  title: 'Learning Lab',
  logo: { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E', alt: 'Learning Lab' },
};

const utilities: TopNavigationProps.Utility[] = [
  { type: 'button', text: 'Docs', iconName: 'file', href: 'https://example.com', external: true },
  { type: 'button', text: 'Alerts', iconName: 'notification', badge: true, ariaLabel: 'Alerts (unread)' },
  {
    type: 'menu-dropdown',
    text: 'Jane Doe',
    iconName: 'person',
    title: 'Jane Doe',
    description: 'jane@example.com',
    items: [
      { id: 'profile', text: 'Profile' },
      { id: 'sign-out', text: 'Sign out' },
    ],
  },
];

// jsdom has no layout, so the measured widths are mocked: 100 with text, 36 as an icon.
let barWidth = 2000;
const widths: Record<string, number> = { identity: 150, overflow: 36 };

function measuredWidth(element: HTMLElement) {
  const name = element.dataset.measure;
  if (!name) {
    return 0;
  }
  if (name in widths) {
    return widths[name];
  }
  return name.startsWith('full') ? 100 : 36;
}

beforeEach(() => {
  barWidth = 2000;
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return measuredWidth(this);
  });
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return this.tagName === 'HEADER' ? barWidth : 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderNavigation(props: Partial<TopNavigationProps> = {}) {
  return render(<TopNavigation identity={identity} utilities={utilities} {...props} />);
}

const getBar = () => screen.getByRole('banner');

describe('TopNavigation', () => {
  test('renders a header landmark with the identity link', () => {
    renderNavigation();
    const link = within(getBar()).getByRole('link', { name: 'Learning Lab' });
    expect(link).toHaveAttribute('href', '#/');
    expect(link.querySelector('img')).toHaveAttribute('alt', '');
  });

  test('names the identity link with the logo when there is no title', () => {
    renderNavigation({ identity: { href: '#/', logo: identity.logo } });
    expect(within(getBar()).getByRole('link', { name: 'Learning Lab' }).querySelector('img')).toHaveAttribute(
      'alt',
      'Learning Lab'
    );
  });

  test('fires a cancelable onFollow for a plain left click on the identity', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    renderNavigation({ identity: { ...identity, onFollow } });
    const link = within(getBar()).getByRole('link', { name: 'Learning Lab' });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    link.dispatchEvent(click);
    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(click.defaultPrevented).toBe(true);
    fireEvent.click(link, { metaKey: true });
    expect(onFollow).toHaveBeenCalledTimes(1);
  });

  test('renders button and menu utilities with their text when there is room', () => {
    renderNavigation();
    expect(screen.getByRole('link', { name: 'Docs Opens in a new tab' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('button', { name: 'Alerts (unread)' })).toBeInTheDocument();
    const menu = screen.getByRole('button', { name: 'Jane Doe' });
    expect(menu).toHaveAttribute('aria-haspopup', 'menu');
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull();
  });

  test('shows a badge dot on a utility', () => {
    const { container } = renderNavigation();
    const wrapper = createWrapper(container).findTopNavigation()!;
    expect(wrapper.findUtilityBadge(2)).not.toBeNull();
    expect(wrapper.findUtilityBadge(1)).toBeNull();
  });

  test('shows the menu title and description above its items', () => {
    renderNavigation();
    fireEvent.click(screen.getByRole('button', { name: 'Jane Doe' }));
    const popup = screen.getByRole('menu').parentElement!.parentElement!;
    expect(popup).toHaveTextContent('Jane Doejane@example.com');
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  test('fires onClick for button utilities and onItemClick for menu utilities', () => {
    const onClick = vi.fn();
    const onItemClick = vi.fn();
    renderNavigation({
      utilities: [
        { type: 'button', text: 'Alerts', onClick },
        { type: 'menu-dropdown', text: 'Account', items: [{ id: 'sign-out', text: 'Sign out' }], onItemClick },
      ],
    });
    fireEvent.click(screen.getByRole('button', { name: 'Alerts' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }));
    expect(onItemClick.mock.calls[0][0].detail).toEqual({ id: 'sign-out' });
  });

  test('renders the search slot', () => {
    const { container } = renderNavigation({ search: <input aria-label="Search" type="search" /> });
    expect(within(getBar()).getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
    expect(createWrapper(container).findTopNavigation()!.findSearch()).not.toBeNull();
  });

  test('draws an Ordinate input in the search slot as a command line', () => {
    const { container } = renderNavigation({
      search: <Input type="search" value="" ariaLabel="Command line" placeholder="Go to" />,
    });
    const input = screen.getByRole('searchbox', { name: 'Command line' });
    expect(input).toHaveAttribute('aria-keyshortcuts', '/');
    expect(container.querySelector('kbd')).toHaveTextContent('/');
    expect(container.querySelector('kbd')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('[class*="ord_input_search-icon"]')).toBeNull();
    expect(container.querySelector('[class*="ord_input_prompt"]')).toHaveTextContent('\u203a');
  });

  test('pressing / outside a field moves focus to the command line', () => {
    renderNavigation({ search: <Input type="search" value="" ariaLabel="Command line" /> });
    const input = screen.getByRole('searchbox', { name: 'Command line' });
    const notPrevented = fireEvent.keyDown(document.body, { key: '/' });
    expect(notPrevented).toBe(false);
    expect(input).toHaveFocus();
  });

  test('leaves / alone while the user types in another field or holds a modifier', () => {
    render(
      <>
        <TopNavigation identity={identity} search={<Input type="search" value="" ariaLabel="Command line" />} />
        <textarea aria-label="Notes" />
      </>
    );
    const notes = screen.getByRole('textbox', { name: 'Notes' });
    notes.focus();
    expect(fireEvent.keyDown(notes, { key: '/' })).toBe(true);
    expect(notes).toHaveFocus();
    expect(fireEvent.keyDown(document.body, { key: '/', ctrlKey: true })).toBe(true);
    expect(notes).toHaveFocus();
  });

  test('hides the key hint while the command line has a value, and drops the shortcut when disabled', () => {
    const { container, rerender } = renderNavigation({
      search: <Input type="search" value="web" ariaLabel="Command line" />,
    });
    expect(container.querySelector('kbd')).toBeNull();
    rerender(
      <TopNavigation
        identity={identity}
        search={<Input type="search" value="" disabled={true} ariaLabel="Command line" />}
      />
    );
    expect(container.querySelector('kbd')).toBeNull();
    expect(screen.getByRole('searchbox', { name: 'Command line' })).not.toHaveAttribute('aria-keyshortcuts');
  });

  test('an input outside the search slot is not a command line', () => {
    const { container } = render(<Input type="search" value="" ariaLabel="Search" />);
    expect(container.querySelector('kbd')).toBeNull();
    expect(screen.getByRole('searchbox')).not.toHaveAttribute('aria-keyshortcuts');
    fireEvent.keyDown(document.body, { key: '/' });
    expect(screen.getByRole('searchbox')).not.toHaveFocus();
  });

  test('collapses utility text to icons when the bar narrows', () => {
    // Identity 150, gap 0 and three icons of 36 fit; three utilities of 100 do not.
    barWidth = 300;
    renderNavigation();
    const docs = screen.getByRole('link', { name: 'Docs' });
    expect(docs).not.toHaveTextContent('Docs');
    expect(screen.getByRole('button', { name: 'Jane Doe' })).not.toHaveTextContent('Jane Doe');
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull();
  });

  test('keeps the text of utilities that disable text collapse', () => {
    barWidth = 300;
    renderNavigation({
      utilities: [{ type: 'button', text: 'Alerts', iconName: 'notification', disableTextCollapse: true }],
    });
    expect(screen.getByRole('button', { name: 'Alerts' })).toHaveTextContent('Alerts');
  });

  test('moves utilities into the overflow menu when even icons do not fit', () => {
    barWidth = 230;
    const { container } = renderNavigation();
    const wrapper = createWrapper(container).findTopNavigation()!;
    expect(wrapper.findUtilities()).toHaveLength(1);
    const overflow = wrapper.findOverflowMenu()!;
    expect(overflow.findTrigger().getElement()).toHaveAccessibleName('More');
    overflow.openDropdown();
    expect(overflow.findItems().map(item => item.getText().trim())).toEqual(['Docs', 'Alerts']);
  });

  test('sends clicks in the overflow menu to the utility', () => {
    barWidth = 150;
    const onClick = vi.fn((event: CustomEvent) => event.preventDefault());
    const onItemClick = vi.fn();
    const { container } = renderNavigation({
      utilities: [
        { type: 'button', text: 'Alerts', iconName: 'notification', href: '/alerts', onClick },
        { type: 'menu-dropdown', text: 'Account', items: [{ id: 'sign-out', text: 'Sign out' }], onItemClick },
      ],
    });
    const overflow = createWrapper(container).findTopNavigation()!.findOverflowMenu()!;
    overflow.openDropdown();
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    overflow.findItems()[0].fireEvent(click);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(click.defaultPrevented).toBe(true);

    overflow.openDropdown();
    overflow.findItems()[1].click();
    overflow.findItemById('1:sign-out')!.click();
    expect(onItemClick.mock.calls[0][0].detail).toEqual({ id: 'sign-out' });
  });

  test('keeps utilities that disable utility collapse out of the overflow menu', () => {
    barWidth = 150;
    renderNavigation({
      utilities: [
        { type: 'button', text: 'Alerts', iconName: 'notification' },
        { type: 'button', text: 'Help', iconName: 'support', disableUtilityCollapse: true },
      ],
    });
    expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Alerts' })).toBeNull();
  });

  test('translates the overflow trigger and accepts i18nStrings', () => {
    barWidth = 150;
    const { rerender } = render(
      <I18nProvider
        locale="de"
        messages={[{ '@ordinate/components': { de: { 'top-navigation': { overflowMenuTriggerText: 'Mehr' } } } }]}
      >
        <TopNavigation identity={identity} utilities={utilities} />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Mehr' })).toBeInTheDocument();
    rerender(
      <TopNavigation identity={identity} utilities={utilities} i18nStrings={{ overflowMenuTriggerText: 'All' }} />
    );
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });

  test('restores the text when the bar widens again', () => {
    barWidth = 150;
    const { rerender } = renderNavigation();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
    barWidth = 2000;
    rerender(<TopNavigation identity={identity} utilities={utilities} />);
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Jane Doe' })).toHaveTextContent('Jane Doe');
  });

  test('passes id and data attributes to the header', () => {
    renderNavigation({ id: 'top', 'data-testid': 'top' } as Partial<TopNavigationProps>);
    expect(getBar()).toHaveAttribute('id', 'top');
    expect(getBar()).toHaveAttribute('data-testid', 'top');
  });

  test('exposes its parts through the test-utils wrapper', () => {
    const { container } = renderNavigation();
    const wrapper = createWrapper(container).findTopNavigation()!;
    expect(wrapper.findIdentityLink().getElement()).toHaveAttribute('href', '#/');
    expect(wrapper.findTitle()!.getText()).toBe('Learning Lab');
    expect(wrapper.findLogo()).not.toBeNull();
    expect(wrapper.findUtilities()).toHaveLength(3);
    expect(wrapper.findUtility(3)!.findButtonDropdown()).not.toBeNull();
    expect(wrapper.findUtility(4)).toBeNull();
    expect(wrapper.findOverflowMenu()).toBeNull();
    expect(wrapper.findSearch()).toBeNull();
  });

  test('has no accessibility violations with a command line', async () => {
    const { container } = renderNavigation({ search: <Input type="search" value="" ariaLabel="Command line" /> });
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations, wide and narrow', async () => {
    const { container, rerender } = renderNavigation({ search: <input aria-label="Search" type="search" /> });
    await expectNoAxeViolations(container);
    barWidth = 150;
    rerender(
      <TopNavigation identity={identity} utilities={utilities} search={<input aria-label="Search" type="search" />} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    await expectNoAxeViolations(container);
  });
});
