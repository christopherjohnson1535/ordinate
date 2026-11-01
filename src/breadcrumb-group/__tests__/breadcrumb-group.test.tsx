// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import { getHiddenCount } from '../../../lib/components/breadcrumb-group/utils';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: BreadcrumbGroupProps.Item[] = [
  { text: 'Projects', href: '/projects' },
  { text: 'north-annex', href: '/projects/north-annex' },
  { text: 'Nodes', href: '/projects/north-annex/nodes' },
  { text: 'na-01', href: '/projects/north-annex/nodes/na-01' },
  { text: 'Logs', href: '/projects/north-annex/nodes/na-01/logs' },
];

const wrapper = () => createWrapper().findBreadcrumbGroup()!;

// Lays every item out at 100px and the navigation at `available` px, since jsdom has no layout.
function mockLayout(available: number) {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(available);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 100 } as DOMRect);
}

afterEach(() => vi.restoreAllMocks());

describe('getHiddenCount', () => {
  test('hides nothing when everything fits', () => {
    expect(getHiddenCount([100, 100, 100], 40, 300)).toBe(0);
  });

  test('hides middle items until the rest and the ellipsis fit', () => {
    expect(getHiddenCount([100, 100, 100, 100, 100], 40, 360)).toBe(2);
    expect(getHiddenCount([100, 100, 100, 100, 100], 40, 100)).toBe(3);
  });

  test('never hides the first or the current item', () => {
    expect(getHiddenCount([300, 300], 40, 100)).toBe(0);
  });
});

describe('BreadcrumbGroup', () => {
  test('renders a labelled navigation with an ordered list of links', () => {
    render(<BreadcrumbGroup items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(nav.querySelector('ol')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getAllByRole('link', { hidden: false })).toHaveLength(4);
  });

  test('the last item is the current page and not a link', () => {
    render(<BreadcrumbGroup items={items} />);
    expect(screen.queryByRole('link', { name: 'Logs' })).toBeNull();
    const current = wrapper().findCurrentPage()!;
    expect(current.getText()).toBe('Logs');
    expect(current.getElement()).toHaveAttribute('aria-current', 'page');
  });

  test('ariaLabel names the navigation', () => {
    render(<BreadcrumbGroup items={items} ariaLabel="You are here" />);
    expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument();
  });

  test('a plain click fires onClick and onFollow, and preventDefault stops navigation', () => {
    const onFollow = vi.fn((event: CustomEvent<BreadcrumbGroupProps.ClickDetail>) => event.preventDefault());
    const onClick = vi.fn();
    render(<BreadcrumbGroup items={items} onFollow={onFollow} onClick={event => onClick(event.detail)} />);
    const notCancelled = fireEvent.click(screen.getByRole('link', { name: 'Nodes' }));
    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ item: items[2], text: 'Nodes', href: items[2].href });
    expect(onClick).toHaveBeenCalledWith({ item: items[2], text: 'Nodes', href: items[2].href });
    expect(notCancelled).toBe(false);
  });

  test('a modified click fires onClick only', () => {
    const onFollow = vi.fn();
    const onClick = vi.fn();
    render(<BreadcrumbGroup items={items} onFollow={onFollow} onClick={onClick} />);
    const notCancelled = fireEvent.click(screen.getByRole('link', { name: 'Projects' }), { metaKey: true });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onFollow).not.toHaveBeenCalled();
    expect(notCancelled).toBe(true);
  });

  test('onClick can cancel the click too', () => {
    render(<BreadcrumbGroup items={items} onClick={event => event.preventDefault()} />);
    expect(fireEvent.click(screen.getByRole('link', { name: 'Projects' }), { ctrlKey: true })).toBe(false);
  });

  test('passes extra item fields back in the event detail', () => {
    const onFollow = vi.fn();
    render(
      <BreadcrumbGroup
        items={[
          { text: 'Home', href: '/', route: 'home' },
          { text: 'Settings', href: '/settings', route: 'settings' },
        ]}
        onFollow={event => onFollow(event.detail.item.route)}
      />
    );
    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(onFollow).toHaveBeenCalledWith('home');
  });

  test('a single item is just the current page', () => {
    render(<BreadcrumbGroup items={[{ text: 'Projects', href: '/projects' }]} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(wrapper().findCurrentPage()!.getText()).toBe('Projects');
  });

  test('collapses middle items behind an ellipsis button when space is short', () => {
    mockLayout(400);
    render(<BreadcrumbGroup items={items} />);
    expect(
      wrapper()
        .findBreadcrumbLinks()
        .map(link => link.getText())
    ).toEqual(['Projects', 'na-01']);
    const ellipsis = screen.getByRole('button', { name: 'Show path' });
    expect(ellipsis).toHaveAttribute('aria-expanded', 'false');
  });

  test('the ellipsis opens a menu of the hidden items', () => {
    mockLayout(400);
    const onFollow = vi.fn((event: CustomEvent<BreadcrumbGroupProps.ClickDetail>) => event.preventDefault());
    render(<BreadcrumbGroup items={items} onFollow={onFollow} />);
    const ellipsis = screen.getByRole('button', { name: 'Show path' });
    fireEvent.click(ellipsis);
    expect(ellipsis).toHaveAttribute('aria-expanded', 'true');
    const menu = document.getElementById(ellipsis.getAttribute('aria-controls')!)!;
    expect(menu).not.toBeNull();
    const links = wrapper().findDropdownLinks();
    expect(links.map(link => link.getText())).toEqual(['north-annex', 'Nodes']);
    expect(links[0].getElement()).toHaveFocus();
    fireEvent.keyDown(links[0].getElement(), { key: 'ArrowDown' });
    expect(links[1].getElement()).toHaveFocus();
    fireEvent.click(links[1].getElement());
    expect(onFollow.mock.calls[0][0].detail.text).toBe('Nodes');
    expect(wrapper().findDropdown()).toBeNull();
  });

  test('Escape closes the menu and returns focus to the ellipsis', () => {
    mockLayout(400);
    render(<BreadcrumbGroup items={items} />);
    const ellipsis = screen.getByRole('button', { name: 'Show path' });
    act(() => ellipsis.focus());
    fireEvent.keyDown(ellipsis, { key: 'ArrowDown' });
    const [first] = wrapper().findDropdownLinks();
    expect(first.getElement()).toHaveFocus();
    fireEvent.keyDown(first.getElement(), { key: 'Escape' });
    expect(wrapper().findDropdown()).toBeNull();
    expect(ellipsis).toHaveFocus();
  });

  test('expandAriaLabel names the ellipsis button', () => {
    mockLayout(400);
    render(<BreadcrumbGroup items={items} expandAriaLabel="More pages" />);
    expect(wrapper().findEllipsis()!.getElement()).toHaveAccessibleName('More pages');
  });

  test('passes id and data attributes to the root', () => {
    render(<BreadcrumbGroup items={items} id="crumbs" data-testid="crumbs" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'crumbs');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'crumbs');
  });
});

describe('BreadcrumbGroup test utilities and accessibility', () => {
  test('the wrapper finds links by position', () => {
    render(<BreadcrumbGroup items={items} />);
    expect(wrapper().findBreadcrumbLink(2)!.getText()).toBe('north-annex');
    expect(wrapper().findEllipsis()).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<BreadcrumbGroup items={items} />);
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations while collapsed and open', async () => {
    mockLayout(400);
    const { container } = render(<BreadcrumbGroup items={items} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show path' }));
    await expectNoAxeViolations(container);
  });
});
