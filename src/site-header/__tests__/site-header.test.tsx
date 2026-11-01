// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import SiteHeader, { SiteHeaderProps } from '../../../lib/components/site-header';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const brand: SiteHeaderProps.Brand = { name: 'Fixit Bikes', href: '/' };

const links: SiteHeaderProps.Link[] = [
  { text: 'Repairs', href: '/repairs', current: true },
  { text: 'Bikes for sale', href: '/bikes' },
  { text: 'Visit', href: '/visit' },
];

function renderHeader(props: Partial<SiteHeaderProps> = {}) {
  const result = render(
    <>
      <SiteHeader brand={brand} links={links} actions={<a href="/book">Book a repair</a>} {...props} />
      <button>Outside</button>
    </>
  );
  return { ...result, header: createWrapper().findSiteHeader()! };
}

describe('SiteHeader', () => {
  test('renders a banner landmark with the brand, a named navigation and the actions', () => {
    renderHeader();
    const banner = screen.getByRole('banner');
    expect(banner.tagName).toBe('HEADER');
    expect(screen.getByRole('link', { name: 'Fixit Bikes' })).toHaveAttribute('href', '/');
    const navigation = screen.getByRole('navigation', { name: 'Main' });
    expect(banner).toContainElement(navigation);
    expect(screen.getByRole('link', { name: 'Book a repair' })).toBeInTheDocument();
  });

  test('marks the current page', () => {
    const { header } = renderHeader();
    expect(screen.getByRole('link', { name: 'Repairs' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Visit' })).not.toHaveAttribute('aria-current');
    expect(header.findCurrentLink()!.getText()).toBe('Repairs');
  });

  test('hides the logo from screen readers because the name is read instead', () => {
    render(
      <SiteHeader
        brand={{
          ...brand,
          logo: (
            <svg viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="4" />
            </svg>
          ),
        }}
      />
    );
    const link = screen.getByRole('link', { name: 'Fixit Bikes' });
    expect(link.querySelector('svg')!.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  test('renders the brand without a link when it has no href', () => {
    render(<SiteHeader brand={{ name: 'Fixit Bikes' }} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(createWrapper().findSiteHeader()!.findBrand().getText()).toBe('Fixit Bikes');
  });

  test('renders no navigation or menu button without links', () => {
    render(<SiteHeader brand={brand} />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('renders the notice above the header bar', () => {
    const { header } = renderHeader({ notice: 'Open today 8–6' });
    expect(header.findNotice()!.getText()).toBe('Open today 8–6');
    const notice = header.findNotice()!.getElement();
    expect(notice.compareDocumentPosition(screen.getByRole('navigation')) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  test('passes id and data attributes and ignores styling props', () => {
    const styling = { className: 'custom', style: { color: 'red' } } as Record<string, unknown>;
    render(<SiteHeader id="top" data-testid="site-header" brand={brand} {...styling} />);
    const root = createWrapper().findSiteHeader()!.getElement();
    expect(root).toHaveAttribute('id', 'top');
    expect(root).toHaveAttribute('data-testid', 'site-header');
    expect(root).not.toHaveClass('custom');
    expect(root).not.toHaveAttribute('style');
  });

  test('accepts sticky', () => {
    renderHeader({ sticky: true });
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});

describe('SiteHeader menu', () => {
  test('the menu button is a real disclosure button that controls the list of links', () => {
    const { header } = renderHeader();
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    const list = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(list.tagName).toBe('UL');
    expect(list).toContainElement(screen.getByRole('link', { name: 'Visit' }));
    expect(header.isMenuOpen()).toBe(false);
  });

  test('opens and closes with clicks', () => {
    const { header } = renderHeader();
    header.findMenuButton()!.click();
    expect(header.isMenuOpen()).toBe(true);
    header.findMenuButton()!.click();
    expect(header.isMenuOpen()).toBe(false);
  });

  test('Escape closes the menu and returns focus to the button', () => {
    const { header } = renderHeader();
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);
    const link = screen.getByRole('link', { name: 'Visit' });
    link.focus();
    fireEvent.keyDown(link, { key: 'Escape' });
    expect(header.isMenuOpen()).toBe(false);
    expect(button).toHaveFocus();
  });

  test('Escape does nothing while the menu is closed', () => {
    const onKeyDown = vi.fn();
    render(
      <div onKeyDown={onKeyDown}>
        <SiteHeader brand={brand} links={links} />
      </div>
    );
    fireEvent.keyDown(screen.getByRole('button', { name: 'Menu' }), { key: 'Escape' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  test('following a link closes the menu and keeps focus on the button', () => {
    const { header } = renderHeader();
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);
    const link = screen.getByRole('link', { name: 'Bikes for sale' });
    link.focus();
    fireEvent.click(link);
    expect(header.isMenuOpen()).toBe(false);
    expect(button).toHaveFocus();
  });

  test('clicking outside closes the menu', () => {
    const { header } = renderHeader();
    header.findMenuButton()!.click();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(header.isMenuOpen()).toBe(false);
  });

  test('clicking inside keeps the menu open', () => {
    const { header } = renderHeader();
    header.findMenuButton()!.click();
    fireEvent.pointerDown(screen.getByRole('link', { name: 'Visit' }));
    expect(header.isMenuOpen()).toBe(true);
  });

  test('tabbing out of the navigation closes the menu', () => {
    const { header } = renderHeader();
    header.findMenuButton()!.click();
    const last = screen.getByRole('link', { name: 'Visit' });
    fireEvent.blur(last, { relatedTarget: screen.getByRole('link', { name: 'Book a repair' }) });
    expect(header.isMenuOpen()).toBe(false);
  });

  test('moving focus within the navigation keeps the menu open', () => {
    const { header } = renderHeader();
    header.findMenuButton()!.click();
    fireEvent.blur(screen.getByRole('button', { name: 'Menu' }), {
      relatedTarget: screen.getByRole('link', { name: 'Repairs' }),
    });
    expect(header.isMenuOpen()).toBe(true);
  });

  test('menuButtonText, navigationAriaLabel and I18nProvider set the built-in strings', () => {
    const { unmount } = render(
      <SiteHeader brand={brand} links={links} menuButtonText="Pages" navigationAriaLabel="Site" />
    );
    expect(screen.getByRole('button', { name: 'Pages' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Site' })).toBeInTheDocument();
    unmount();
    render(
      <I18nProvider
        locale="en"
        messages={[
          {
            '@ordinate-ui/components': {
              en: { 'site-header': { menuButtonText: 'Browse', navigationAriaLabel: 'Shop' } },
            },
          },
        ]}
      >
        <SiteHeader brand={brand} links={links} />
      </I18nProvider>
    );
    expect(screen.getByRole('button', { name: 'Browse' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Shop' })).toBeInTheDocument();
  });
});

describe('SiteHeader onFollow', () => {
  test('fires for links and the brand with a plain click', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    renderHeader({ onFollow });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    screen.getByRole('link', { name: 'Visit' }).dispatchEvent(click);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ href: '/visit', text: 'Visit' });
    expect(click.defaultPrevented).toBe(true);
    fireEvent.click(screen.getByRole('link', { name: 'Fixit Bikes' }));
    expect(onFollow.mock.calls[1][0].detail).toEqual({ href: '/', text: 'Fixit Bikes' });
  });

  test('does not fire for clicks that open the link elsewhere', () => {
    const onFollow = vi.fn();
    renderHeader({ onFollow });
    fireEvent.click(screen.getByRole('link', { name: 'Visit' }), { metaKey: true });
    fireEvent.click(screen.getByRole('link', { name: 'Fixit Bikes' }), { shiftKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });
});

describe('SiteHeader test utilities and accessibility', () => {
  test('the wrapper reads every part', () => {
    const { header } = renderHeader({ notice: 'Open today 8–6' });
    expect(header.findBrand().getText()).toBe('Fixit Bikes');
    expect(header.findNavigation()!.getElement().tagName).toBe('NAV');
    expect(header.findLinks().map(link => link.getText())).toEqual(['Repairs', 'Bikes for sale', 'Visit']);
    expect(header.findActions()!.getText()).toBe('Book a repair');
  });

  test('has no accessibility violations, closed and open', async () => {
    const { container, header } = renderHeader({ notice: 'Open today 8–6' });
    await expectNoAxeViolations(container);
    header.findMenuButton()!.click();
    await expectNoAxeViolations(container);
  });
});
