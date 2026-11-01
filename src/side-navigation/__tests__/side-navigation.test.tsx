// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Dashboard', href: '#/dashboard' },
  { type: 'link', text: 'Projects', href: '#/projects', info: <span>New</span> },
  { type: 'divider' },
  {
    type: 'section',
    text: 'Compute',
    items: [
      { type: 'link', text: 'Nodes', href: '#/nodes' },
      { type: 'link', text: 'Images', href: '#/images' },
    ],
  },
  {
    type: 'section',
    text: 'Storage',
    defaultExpanded: false,
    items: [{ type: 'link', text: 'Volumes', href: '#/volumes' }],
  },
  {
    type: 'section-group',
    title: 'Administration',
    items: [
      {
        type: 'link-group',
        text: 'Access',
        href: '#/access',
        items: [{ type: 'link', text: 'Roles', href: '#/roles' }],
      },
      {
        type: 'expandable-link-group',
        text: 'Billing',
        href: '#/billing',
        items: [{ type: 'link', text: 'Invoices', href: '#/invoices' }],
      },
    ],
  },
  { type: 'divider' },
  { type: 'link', text: 'Documentation', href: 'https://example.com/docs', external: true },
];

const header: SideNavigationProps.Header = { text: 'Ordinate Cloud', href: '#/' };

const wrapper = () => createWrapper().findSideNavigation()!;

describe('SideNavigation', () => {
  test('renders a labelled navigation landmark', () => {
    render(<SideNavigation items={items} />);
    expect(screen.getByRole('navigation', { name: 'Side navigation' })).toBeInTheDocument();
  });

  test('ariaLabel names the landmark', () => {
    render(<SideNavigation items={items} ariaLabel="Console" />);
    expect(screen.getByRole('navigation', { name: 'Console' })).toBeInTheDocument();
  });

  test('renders the header as a link with an optional logo', () => {
    render(<SideNavigation header={{ ...header, logo: { src: 'logo.svg', alt: 'Logo' } }} items={items} />);
    const link = wrapper().findHeaderLink()!;
    expect(link.getElement()).toHaveAttribute('href', '#/');
    expect(within(link.getElement()).getByRole('img', { name: 'Logo' })).toBeInTheDocument();
    expect(link.getText()).toBe('Ordinate Cloud');
  });

  test('marks the active link as the current page', () => {
    render(<SideNavigation items={items} activeHref="#/nodes" />);
    const nodes = screen.getByRole('link', { name: 'Nodes' });
    expect(nodes).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
    expect(wrapper().findActiveLink()!.getText()).toBe('Nodes');
  });

  test('a plain click fires onFollow, and preventDefault stops navigation', () => {
    const onFollow = vi.fn((event: CustomEvent<SideNavigationProps.FollowDetail>) => event.preventDefault());
    render(<SideNavigation header={header} items={items} onFollow={onFollow} />);
    const notCancelled = fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
    expect(notCancelled).toBe(false);
    expect(onFollow.mock.calls[0][0].detail).toEqual({
      href: '#/projects',
      text: 'Projects',
      external: false,
      type: 'link',
    });
    fireEvent.click(wrapper().findHeaderLink()!.getElement());
    expect(onFollow.mock.calls[1][0].detail).toEqual({
      href: '#/',
      text: 'Ordinate Cloud',
      external: false,
      type: 'header',
    });
  });

  test('a modified click does not fire onFollow', () => {
    const onFollow = vi.fn();
    render(<SideNavigation items={items} onFollow={onFollow} />);
    fireEvent.click(screen.getByRole('link', { name: 'Projects' }), { shiftKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('external links open in a new tab with an icon and report external', () => {
    const onFollow = vi.fn((event: CustomEvent<SideNavigationProps.FollowDetail>) => event.preventDefault());
    render(<SideNavigation items={items} onFollow={onFollow} />);
    const docs = screen.getByRole('link', { name: /^Documentation\s+Opens in a new tab$/ });
    expect(docs).toHaveAttribute('target', '_blank');
    expect(docs).toHaveAttribute('rel', 'noopener noreferrer');
    fireEvent.click(docs);
    expect(onFollow.mock.calls[0][0].detail).toMatchObject({ external: true, type: 'link' });
  });

  test('renders info content next to a link', () => {
    render(<SideNavigation items={items} />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('dividers split the items into separate lists', () => {
    render(<SideNavigation items={items} />);
    expect(wrapper().findDividers()).toHaveLength(2);
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });

  test('sections collapse and expand, and report the change', () => {
    const onChange = vi.fn();
    render(<SideNavigation items={items} onChange={event => onChange(event.detail)} />);
    const compute = screen.getByRole('button', { name: 'Compute' });
    expect(compute).toHaveAttribute('aria-expanded', 'true');
    const content = document.getElementById(compute.getAttribute('aria-controls')!)!;
    expect(content).toBeVisible();
    fireEvent.click(compute);
    expect(compute).toHaveAttribute('aria-expanded', 'false');
    expect(content).not.toBeVisible();
    expect(onChange).toHaveBeenCalledWith({ item: items[3], expanded: false });
  });

  test('a section with defaultExpanded false starts collapsed', () => {
    render(<SideNavigation items={items} />);
    expect(screen.getByRole('button', { name: 'Storage' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Volumes' })).toBeNull();
  });

  test('section groups label their items', () => {
    render(<SideNavigation items={items} />);
    expect(screen.getByRole('group', { name: 'Administration' })).toBeInTheDocument();
    expect(wrapper().findSectionGroupTitles()[0].getText()).toBe('Administration');
  });

  test('link groups always show their children', () => {
    render(<SideNavigation items={items} />);
    expect(screen.getByRole('link', { name: 'Access' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Roles' })).toBeVisible();
  });

  test('expandable link groups toggle, and following their link expands them', () => {
    const onChange = vi.fn();
    const onFollow = vi.fn((event: CustomEvent<SideNavigationProps.FollowDetail>) => event.preventDefault());
    render(<SideNavigation items={items} onFollow={onFollow} onChange={event => onChange(event.detail.expanded)} />);
    const toggle = screen.getByRole('button', { name: 'Billing' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(onChange.mock.calls).toEqual([[true], [false]]);
    fireEvent.click(screen.getByRole('link', { name: 'Billing' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(onFollow.mock.calls[0][0].detail.type).toBe('expandable-link-group');
  });

  test('an expandable link group holding the active link starts expanded', () => {
    render(<SideNavigation items={items} activeHref="#/invoices" />);
    expect(screen.getByRole('button', { name: 'Billing' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Invoices' })).toHaveAttribute('aria-current', 'page');
  });

  test('passes id and data attributes to the root', () => {
    render(<SideNavigation items={items} id="side" data-testid="side" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'side');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'side');
  });
});

describe('SideNavigation sheet index', () => {
  const indexed: SideNavigationProps.Item[] = [
    { type: 'link', text: 'Overview', href: '#/overview', code: 'A-01' },
    { type: 'link', text: 'Services', href: '#/services', code: 'A-02' },
    { type: 'link', text: 'Notes', href: '#/notes' },
    { type: 'divider' },
    {
      type: 'section',
      text: 'Account',
      code: 'Set B',
      items: [{ type: 'link', text: 'Billing', href: '#/billing', code: 'B-01' }],
    },
    {
      type: 'section-group',
      title: 'Reference',
      code: 'Set C',
      items: [
        {
          type: 'expandable-link-group',
          text: 'Guides',
          href: '#/guides',
          code: 'C-01',
          items: [{ type: 'link', text: 'Rollouts', href: '#/guides/rollouts', code: 'C-01a' }],
        },
      ],
    },
  ];

  test('shows each code before its link text, as part of the link', () => {
    render(<SideNavigation items={indexed} activeHref="#/services" />);
    expect(screen.getByRole('link', { name: 'A-01 Overview' })).toHaveAttribute('href', '#/overview');
    expect(wrapper().findActiveLink()!.getText()).toBe('A-02 Services');
    expect(
      wrapper()
        .findLinkCodes()
        .map(code => code.getText())
    ).toEqual(['A-01', 'A-02', '', 'B-01', 'C-01', 'C-01a']);
  });

  test('keeps a code column for links without a code when other links have one', () => {
    render(<SideNavigation items={indexed} />);
    expect(screen.getByRole('link', { name: 'Notes' })).toBeInTheDocument();
    expect(wrapper().findLinkByHref('#/notes')!.findAll('span')).toHaveLength(2);
  });

  test('draws no code column when no link has a code', () => {
    render(<SideNavigation items={items} />);
    expect(wrapper().findLinkCodes()).toHaveLength(0);
  });

  test('letters sections and section groups with their set code', () => {
    render(<SideNavigation items={indexed} />);
    expect(screen.getByRole('button', { name: 'Set B Account' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('group', { name: 'Set C Reference' })).toBeInTheDocument();
  });

  test('draws expand state and external links as type marks hidden from assistive technology', () => {
    const { container } = render(<SideNavigation items={items} />);
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.getByRole('button', { name: 'Compute' }).querySelector('[aria-hidden="true"]')).toHaveTextContent(
      '\u2212'
    );
    expect(screen.getByRole('button', { name: 'Storage' }).querySelector('[aria-hidden="true"]')).toHaveTextContent(
      '+'
    );
  });

  test('has no accessibility violations with codes and sets', async () => {
    const { container } = render(<SideNavigation header={header} items={indexed} activeHref="#/guides/rollouts" />);
    await expectNoAxeViolations(container);
  });
});

describe('SideNavigation test utilities and accessibility', () => {
  test('the wrapper finds links and toggles', () => {
    render(<SideNavigation header={header} items={items} />);
    expect(wrapper().findLinkByHref('#/images')!.getText()).toBe('Images');
    expect(wrapper().findSectionToggles()).toHaveLength(2);
    expect(wrapper().findExpandToggles()).toHaveLength(1);
    expect(wrapper().findLinks().length).toBeGreaterThan(5);
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<SideNavigation header={header} items={items} activeHref="#/nodes" />);
    await expectNoAxeViolations(container);
  });
});
