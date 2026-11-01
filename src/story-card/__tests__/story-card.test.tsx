// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Media from '../../../lib/components/media';
import StoryCard, { StoryCardProps } from '../../../lib/components/story-card';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const card = () => createWrapper().findStoryCard()!;

describe('StoryCard', () => {
  test('renders the title as a level 3 heading by default, with the link inside it', () => {
    render(<StoryCard title="On walking slowly" href="/walking" />);
    const heading = screen.getByRole('heading', { level: 3, name: 'On walking slowly' });
    const link = screen.getByRole('link', { name: 'On walking slowly' });
    expect(heading).toContainElement(link);
    expect(link).toHaveAttribute('href', '/walking');
    expect(card().findTitleLink()!.getElement()).toBe(link);
  });

  test('headingLevel sets the heading level', () => {
    render(<StoryCard title="Cover story" headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Cover story' })).toBeInTheDocument();
  });

  test('without href the title is plain text', () => {
    render(<StoryCard title="Letters" />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(card().findTitleLink()).toBeNull();
  });

  test('renders every part it is given', () => {
    render(
      <StoryCard
        title="The last sail maker"
        href="/sail"
        number="03"
        kicker="Interview"
        summary="Forty years of canvas."
        meta="Tomás Reyes · 9 min read"
        media={<Media placeholderText="Photo" />}
      />
    );
    expect(card().findNumber()!.getText()).toBe('03');
    expect(card().findKicker()!.getText()).toBe('Interview');
    expect(card().findSummary()!.getText()).toBe('Forty years of canvas.');
    expect(card().findMeta()!.getText()).toBe('Tomás Reyes · 9 min read');
    expect(card().findMedia()!.findAllMedias()).toHaveLength(1);
  });

  test('the number is decoration and hidden from screen readers', () => {
    render(<StoryCard title="Story" number="02" />);
    expect(card().findNumber()!.getElement()).toHaveAttribute('aria-hidden', 'true');
  });

  test('has one link, so links in the byline are not nested in it', () => {
    render(
      <StoryCard
        title="A harbour learns"
        href="/harbour"
        meta={
          <>
            By <a href="/authors/mara">Mara Lindqvist</a>
          </>
        }
      />
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).not.toContainElement(links[1]);
    expect(links[1]).not.toContainElement(links[0]);
  });

  test('fires onFollow on a plain click, and preventDefault stops navigation', () => {
    const onFollow = vi.fn((event: CustomEvent) => event.preventDefault());
    render(<StoryCard title="Story" href="/story" onFollow={onFollow} />);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => {
      screen.getByRole('link').dispatchEvent(event);
    });
    expect(onFollow).toHaveBeenCalledWith(expect.objectContaining({ detail: { href: '/story' } }));
    expect(event.defaultPrevented).toBe(true);
  });

  test('leaves clicks with a modifier key to the browser', () => {
    const onFollow = vi.fn();
    render(<StoryCard title="Story" href="/story" onFollow={onFollow} />);
    fireEvent.click(screen.getByRole('link'), { metaKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('the title link is reachable with the keyboard', () => {
    render(<StoryCard title="Story" href="/story" />);
    card().findTitleLink()!.focus();
    expect(screen.getByRole('link')).toHaveFocus();
  });

  test('applies a different class for each variant', () => {
    const variants: StoryCardProps.Variant[] = ['default', 'ruled', 'feature'];
    render(
      <>
        {variants.map(variant => (
          <StoryCard key={variant} title={variant} variant={variant} />
        ))}
      </>
    );
    const classNames = createWrapper()
      .findAllStoryCards()
      .map(wrapper => wrapper.getElement().className);
    expect(new Set(classNames).size).toBe(variants.length);
  });

  test('passes id and data attributes, but not className', () => {
    const props = { id: 'story', 'data-testid': 'story', className: 'custom' } as unknown as StoryCardProps;
    render(<StoryCard {...props} title="Story" />);
    const root = screen.getByTestId('story');
    expect(root).toHaveAttribute('id', 'story');
    expect(root).not.toHaveClass('custom');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <h2>Also in this issue</h2>
        <StoryCard
          title="What the tide leaves behind"
          href="/tide"
          number="02"
          kicker="Field notes"
          summary="A morning on the mudflats."
          meta={<a href="/authors/lena">Lena Ortiz</a>}
          media={<Media src="/tide.jpg" alt="" />}
          variant="ruled"
        />
        <StoryCard title="Letters" variant="feature" />
      </>
    );
    await expectNoAxeViolations(container);
  });
});
