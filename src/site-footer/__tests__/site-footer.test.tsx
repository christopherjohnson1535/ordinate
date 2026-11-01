// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import SiteFooter, { SiteFooterProps } from '../../../lib/components/site-footer';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const columns: SiteFooterProps.Column[] = [
  {
    title: 'Visit',
    links: [
      { text: 'Opening hours', href: '/hours' },
      { text: 'Find us', href: '/map' },
    ],
  },
  { title: 'Shop', links: [{ text: 'Gift cards', href: '/gift-cards' }] },
];

describe('SiteFooter', () => {
  test('renders a contentinfo landmark with the brand, the columns and the small print', () => {
    render(
      <SiteFooter brand={{ name: 'Rosie’s Bakes', href: '/' }} columns={columns} legal="© 2026 Rosie’s Bakes">
        <address>12 Shore Road</address>
      </SiteFooter>
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer.tagName).toBe('FOOTER');
    expect(screen.getByRole('link', { name: 'Rosie’s Bakes' })).toHaveAttribute('href', '/');
    expect(screen.getByText('12 Shore Road')).toBeInTheDocument();
    expect(screen.getByText('© 2026 Rosie’s Bakes')).toBeInTheDocument();
  });

  test('renders the column titles as level 2 headings by default', () => {
    render(<SiteFooter columns={columns} />);
    expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)).toEqual(['Visit', 'Shop']);
  });

  test('headingLevel sets the column title level', () => {
    render(<SiteFooter columns={columns} headingLevel={3} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  test('puts the columns in a navigation landmark named Footer by default', () => {
    const { rerender } = render(<SiteFooter columns={columns} />);
    const navigation = screen.getByRole('navigation', { name: 'Footer' });
    expect(navigation).toContainElement(screen.getByRole('link', { name: 'Gift cards' }));
    rerender(<SiteFooter columns={columns} navigationAriaLabel="More from the bakery" />);
    expect(screen.getByRole('navigation', { name: 'More from the bakery' })).toBeInTheDocument();
  });

  test('renders no navigation without columns', () => {
    render(<SiteFooter brand={{ name: 'Rosie’s Bakes' }} legal="© 2026" />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  test.each(['default', 'accent', 'inverted'] as const)('renders the %s tone', tone => {
    render(<SiteFooter tone={tone} columns={columns} />);
    expect(screen.getByRole('link', { name: 'Find us' })).toBeInTheDocument();
  });

  test('fires onFollow for column links and the brand', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    render(<SiteFooter brand={{ name: 'Rosie’s Bakes', href: '/' }} columns={columns} onFollow={onFollow} />);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    screen.getByRole('link', { name: 'Find us' }).dispatchEvent(click);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ href: '/map', text: 'Find us' });
    expect(click.defaultPrevented).toBe(true);
    fireEvent.click(screen.getByRole('link', { name: 'Rosie’s Bakes' }));
    expect(onFollow.mock.calls[1][0].detail).toEqual({ href: '/', text: 'Rosie’s Bakes' });
    fireEvent.click(screen.getByRole('link', { name: 'Gift cards' }), { altKey: true });
    expect(onFollow).toHaveBeenCalledTimes(2);
  });

  test('passes id and data attributes', () => {
    render(<SiteFooter id="footer" data-testid="site-footer" legal="© 2026" />);
    const root = createWrapper().findSiteFooter()!.getElement();
    expect(root).toHaveAttribute('id', 'footer');
    expect(root).toHaveAttribute('data-testid', 'site-footer');
  });
});

describe('SiteFooter test utilities and accessibility', () => {
  const full = (
    <SiteFooter
      brand={{ name: 'Rosie’s Bakes', href: '/' }}
      columns={columns}
      legal={
        <>
          <span>© 2026 Rosie’s Bakes</span>
          <a href="/privacy">Privacy</a>
        </>
      }
      tone="inverted"
    >
      <address>12 Shore Road</address>
    </SiteFooter>
  );

  test('the wrapper reads every part', () => {
    render(full);
    const footer = createWrapper().findSiteFooter()!;
    expect(footer.findBrand()!.getText()).toBe('Rosie’s Bakes');
    expect(footer.findContent()!.getText()).toBe('12 Shore Road');
    expect(footer.findNavigation()!.getElement().tagName).toBe('NAV');
    const [visit, shop] = footer.findColumns();
    expect(visit.findTitle().getText()).toBe('Visit');
    expect(visit.findLinks().map(link => link.getText())).toEqual(['Opening hours', 'Find us']);
    expect(shop.findLinks()).toHaveLength(1);
    expect(footer.findLegal()!.getText()).toBe('© 2026 Rosie’s BakesPrivacy');
  });

  test('optional parts are absent when not set', () => {
    render(<SiteFooter legal="© 2026" />);
    const footer = createWrapper().findSiteFooter()!;
    expect(footer.findBrand()).toBeNull();
    expect(footer.findContent()).toBeNull();
    expect(footer.findNavigation()).toBeNull();
    expect(footer.findColumns()).toEqual([]);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(full);
    await expectNoAxeViolations(container);
  });
});
