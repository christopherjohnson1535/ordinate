// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import Opening, { OpeningProps } from '../../../lib/components/opening';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const links: OpeningProps.Link[] = [
  { text: 'Essays', href: '#essays', current: true },
  { text: 'Field notes', href: '#notes' },
  { text: 'Archive', href: '#archive' },
];

const drawing = (
  <svg viewBox="0 0 10 10" aria-hidden="true">
    <path d="M1 9h8" />
  </svg>
);

describe('Opening', () => {
  test('renders the title as the level 1 heading by default', () => {
    render(<Opening title="We draw quiet houses." />);
    expect(screen.getByRole('heading', { level: 1, name: 'We draw quiet houses.' })).toBeInTheDocument();
  });

  test('headingLevel sets the heading element', () => {
    render(<Opening title="Spring menu" headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Spring menu' })).toBeInTheDocument();
  });

  test.each(['statement', 'split', 'masthead'] as const)('renders every part in the %s variant', variant => {
    render(
      <Opening
        variant={variant}
        title="The Allotment"
        kicker="A journal of small gardens"
        meta="No. 14"
        badge="New issue"
        description="Notes from twelve plots."
        actions={<a href="#read">Read the issue</a>}
        links={links}
        media={drawing}
        mediaCaption="Plot 7, plan"
      />
    );
    const opening = createWrapper().findOpening()!;
    expect(opening.findTitle().getText()).toBe('The Allotment');
    expect(opening.findKicker()!.getText()).toBe('A journal of small gardens');
    expect(opening.findMeta()!.getText()).toBe('No. 14');
    expect(opening.findBadge()!.getText()).toBe('New issue');
    expect(opening.findDescription()!.getText()).toBe('Notes from twelve plots.');
    expect(opening.findActions()!.getText()).toBe('Read the issue');
    expect(opening.findLinks().map(link => link.getText())).toEqual(['Essays', 'Field notes', 'Archive']);
    expect(opening.findMedia()!.getElement()).toContainElement(opening.getElement().querySelector('svg'));
    expect(opening.findMediaCaption()!.getText()).toBe('Plot 7, plan');
  });

  test('the kicker comes before the title in reading order', () => {
    render(<Opening title="Fixit Bikes" kicker="Repairs in Leith" />);
    const kicker = screen.getByText('Repairs in Leith');
    const heading = screen.getByRole('heading');
    expect(kicker.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(heading).not.toContainElement(kicker);
  });

  test('wraps the media in a figure only when it has a caption', () => {
    const { container, rerender } = render(<Opening title="Hut No. 3" media={drawing} />);
    expect(container.querySelector('figure')).toBeNull();
    rerender(<Opening title="Hut No. 3" media={drawing} mediaCaption="South elevation, 1:50" />);
    expect(screen.getByRole('figure')).toContainElement(screen.getByText('South elevation, 1:50'));
    expect(screen.getByText('South elevation, 1:50').tagName).toBe('FIGCAPTION');
  });

  test('renders the links in a navigation landmark with an English name by default', () => {
    render(<Opening variant="masthead" title="The Allotment" links={links} />);
    const navigation = screen.getByRole('navigation', { name: 'Sections' });
    expect(navigation).toContainElement(screen.getByRole('link', { name: 'Essays' }));
    expect(screen.getByRole('link', { name: 'Essays' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Archive' })).not.toHaveAttribute('aria-current');
  });

  test('navigationAriaLabel and I18nProvider name the links', () => {
    const { rerender } = render(<Opening title="The Allotment" links={links} navigationAriaLabel="In this issue" />);
    expect(screen.getByRole('navigation', { name: 'In this issue' })).toBeInTheDocument();
    rerender(
      <I18nProvider
        locale="en"
        messages={[{ '@ordinate/components': { en: { opening: { navigationAriaLabel: 'Parts' } } } }]}
      >
        <Opening title="The Allotment" links={links} />
      </I18nProvider>
    );
    expect(screen.getByRole('navigation', { name: 'Parts' })).toBeInTheDocument();
  });

  test('renders no navigation without links', () => {
    render(<Opening variant="masthead" title="The Allotment" links={[]} />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(createWrapper().findOpening()!.findNavigation()).toBeNull();
  });

  test('fires onFollow for a plain click and lets it take over the navigation', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    render(<Opening title="The Allotment" links={links} onFollow={onFollow} />);
    const link = screen.getByRole('link', { name: 'Field notes' });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    link.dispatchEvent(click);
    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ href: '#notes', text: 'Field notes' });
    expect(click.defaultPrevented).toBe(true);
  });

  test('leaves modified clicks to the browser', () => {
    const onFollow = vi.fn();
    render(<Opening title="The Allotment" links={links} onFollow={onFollow} />);
    fireEvent.click(screen.getByRole('link', { name: 'Archive' }), { ctrlKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('draws the masthead double rule as decoration only', () => {
    const { container } = render(<Opening variant="masthead" title="The Allotment" />);
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toBeEmptyDOMElement();
  });

  test('optional parts are absent when not set', () => {
    render(<Opening title="Fixit Bikes" />);
    const opening = createWrapper().findOpening()!;
    expect(opening.findKicker()).toBeNull();
    expect(opening.findMeta()).toBeNull();
    expect(opening.findBadge()).toBeNull();
    expect(opening.findDescription()).toBeNull();
    expect(opening.findActions()).toBeNull();
    expect(opening.findMedia()).toBeNull();
    expect(opening.findMediaCaption()).toBeNull();
  });

  test('passes id and data attributes', () => {
    render(<Opening id="top" data-testid="opening" title="Fixit Bikes" />);
    const root = createWrapper().findOpening()!.getElement();
    expect(root).toHaveAttribute('id', 'top');
    expect(root).toHaveAttribute('data-testid', 'opening');
  });
});

describe('Opening accessibility', () => {
  test.each(['statement', 'split', 'masthead'] as const)('has no accessibility violations as %s', async variant => {
    const { container } = render(
      <Opening
        variant={variant}
        title="Fixit Bikes"
        kicker="Repairs in Leith"
        meta="Since 1998"
        badge="Open Sundays"
        description="Same-day repairs for most bikes."
        actions={<a href="#book">Book a repair</a>}
        links={links}
        media={<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="The workshop on Shore Road" />}
        mediaCaption="The workshop"
      />
    );
    await expectNoAxeViolations(container);
  });
});
