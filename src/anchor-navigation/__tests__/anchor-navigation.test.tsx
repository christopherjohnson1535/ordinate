// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import AnchorNavigation, { AnchorNavigationProps } from '../../../lib/components/anchor-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const anchors: AnchorNavigationProps.Anchor[] = [
  { text: 'Overview', href: '#overview', level: 1 },
  { text: 'Method', href: '#method', level: 1 },
  { text: 'Baseline', href: '#baseline', level: 2, info: 'Updated' },
  { text: 'Angles', href: '#angles', level: 3 },
  { text: 'Results', href: '#results', level: 1 },
];

const wrapper = () => createWrapper().findAnchorNavigation()!;

// A stand-in IntersectionObserver that records its targets and lets the test report a crossing.
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly targets: Element[] = [];
  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit
  ) {
    FakeIntersectionObserver.instances.push(this);
  }
  observe(target: Element) {
    this.targets.push(target);
  }
  disconnect() {
    this.targets.length = 0;
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
  trigger() {
    act(() => this.callback([], this as unknown as IntersectionObserver));
  }
}

function Page(props: Partial<AnchorNavigationProps>) {
  return (
    <>
      <h2 id="toc">On this page</h2>
      <AnchorNavigation anchors={anchors} ariaLabelledby="toc" {...props} />
      {anchors.map(anchor => (
        <h3 key={anchor.href} id={anchor.href.slice(1)}>
          {anchor.text}
        </h3>
      ))}
    </>
  );
}

function placeTargets(tops: Record<string, number>) {
  for (const [id, top] of Object.entries(tops)) {
    vi.spyOn(document.getElementById(id)!, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect);
  }
}

beforeEach(() => {
  FakeIntersectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('AnchorNavigation', () => {
  test('renders a navigation landmark named by ariaLabelledby', () => {
    render(<Page />);
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
  });

  test('nests anchors by level in ordered lists', () => {
    render(<Page />);
    const navigation = screen.getByRole('navigation');
    const topLevel = navigation.querySelector('ol')!;
    expect(Array.from(topLevel.children, item => item.querySelector('a')!.textContent)).toEqual([
      'Overview',
      'Method',
      'Results',
    ]);
    const method = within(topLevel.children[1] as HTMLElement);
    expect(method.getByRole('link', { name: 'Baseline' })).toBeInTheDocument();
    expect(method.getByRole('link', { name: 'Angles' }).closest('ol')!.closest('li')).toHaveTextContent('Baseline');
    expect(wrapper().findAnchorLinks()).toHaveLength(5);
  });

  test('links point at the sections and show info text', () => {
    render(<Page />);
    expect(wrapper().findAnchorLinkByIndex(3)!.getElement()).toHaveAttribute('href', '#baseline');
    expect(
      wrapper()
        .findInfos()
        .map(info => info.getText())
    ).toEqual(['Updated']);
  });

  test('activeHref marks the current anchor and turns off scroll tracking', () => {
    render(<Page activeHref="#baseline" />);
    expect(wrapper().findActiveAnchor()!.getText()).toBe('Baseline');
    expect(screen.getByRole('link', { name: 'Baseline' })).toHaveAttribute('aria-current', 'true');
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  test('a plain click fires onFollow with the anchor, and preventDefault stops the jump', () => {
    const onFollow = vi.fn((event: CustomEvent<AnchorNavigationProps.FollowDetail>) => event.preventDefault());
    render(<Page onFollow={onFollow} />);
    const notCancelled = fireEvent.click(screen.getByRole('link', { name: 'Baseline' }));
    expect(notCancelled).toBe(false);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ text: 'Baseline', href: '#baseline', level: 2 });
  });

  test('a modified click does not fire onFollow', () => {
    const onFollow = vi.fn();
    render(<Page onFollow={onFollow} />);
    fireEvent.click(screen.getByRole('link', { name: 'Baseline' }), { ctrlKey: true });
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('a followed anchor becomes current right away while tracking the scroll position', () => {
    render(<Page />);
    fireEvent.click(screen.getByRole('link', { name: 'Results' }));
    expect(wrapper().findActiveAnchor()!.getText()).toBe('Results');
  });

  test('tracks the last section scrolled past the offset line, and reports changes', () => {
    const onActiveHrefChange = vi.fn();
    render(<Page scrollSpyOffset={50} onActiveHrefChange={event => onActiveHrefChange(event.detail)} />);
    const observer = FakeIntersectionObserver.instances[0];
    expect(observer.targets.map(target => target.id)).toEqual(['overview', 'method', 'baseline', 'angles', 'results']);
    expect(observer.options.rootMargin).toBe('-50px 0px 0px 0px');

    placeTargets({ overview: -300, method: -100, baseline: 40, angles: 300, results: 900 });
    observer.trigger();
    expect(wrapper().findActiveAnchor()!.getText()).toBe('Baseline');
    expect(onActiveHrefChange).toHaveBeenLastCalledWith({ text: 'Baseline', href: '#baseline', level: 2 });

    placeTargets({ overview: -600, method: -400, baseline: -260, angles: 20, results: 600 });
    observer.trigger();
    expect(wrapper().findActiveAnchor()!.getText()).toBe('Angles');
    expect(onActiveHrefChange).toHaveBeenLastCalledWith({ text: 'Angles', href: '#angles', level: 3 });
    // A crossing that leaves the same section current is not reported again.
    const calls = onActiveHrefChange.mock.calls.length;
    observer.trigger();
    expect(onActiveHrefChange).toHaveBeenCalledTimes(calls);
  });

  test('marks the first section before any has reached the line', () => {
    render(<Page />);
    placeTargets({ overview: 200, method: 400, baseline: 600, angles: 800, results: 1000 });
    FakeIntersectionObserver.instances[0].trigger();
    expect(wrapper().findActiveAnchor()!.getText()).toBe('Overview');
  });

  test('passes id and data attributes to the root', () => {
    render(<Page id="toc-nav" data-testid="toc-nav" />);
    expect(wrapper().getElement()).toHaveAttribute('id', 'toc-nav');
    expect(wrapper().getElement()).toHaveAttribute('data-testid', 'toc-nav');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Page activeHref="#method" />);
    await expectNoAxeViolations(container);
  });
});
