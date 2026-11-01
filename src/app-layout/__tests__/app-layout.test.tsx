// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import Flashbar from '../../../lib/components/flashbar';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const drawers: AppLayoutProps.Drawer[] = [
  {
    id: 'activity',
    trigger: { iconName: 'history' },
    ariaLabels: { drawerName: 'Activity' },
    resizable: true,
    defaultSize: 320,
    content: <p>Recent events</p>,
  },
  {
    id: 'notifications',
    trigger: { iconName: 'notification' },
    ariaLabels: { drawerName: 'Notifications', triggerButton: 'Notifications, 2 unread' },
    badge: true,
    content: <p>Two updates</p>,
  },
];

function renderLayout(props: Partial<AppLayoutProps> = {}) {
  return render(
    <AppLayout
      navigation={<a href="#home">Home</a>}
      tools={<p>Help text</p>}
      content={<p>Page content</p>}
      {...props}
    />
  );
}

function getLayout() {
  return createWrapper().findAppLayout()!;
}

// jsdom lays nothing out, so a narrow layout is simulated through its measured width.
function simulateWidth(width: number) {
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(width);
}

afterEach(() => vi.restoreAllMocks());

describe('AppLayout regions', () => {
  test('uses landmarks for the navigation, the content and the help panel', () => {
    renderLayout({ toolsOpen: true });
    expect(screen.getByRole('navigation', { name: 'Navigation drawer' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Page content');
    expect(screen.getByRole('complementary', { name: 'Help panel' })).toHaveTextContent('Help text');
  });

  test('renders breadcrumbs and notifications in their slots', () => {
    renderLayout({ breadcrumbs: 'Home / Projects', notifications: 'Maintenance tonight' });
    const layout = getLayout();
    expect(layout.findBreadcrumbs()!.getText()).toBe('Home / Projects');
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveTextContent('Maintenance tonight');
    expect(layout.findNotifications()!.getText()).toBe('Maintenance tonight');
  });

  test('stickyNotifications changes the notifications class', () => {
    const { rerender } = renderLayout({ notifications: 'Note' });
    const before = getLayout().findNotifications()!.getElement().className;
    rerender(<AppLayout notifications="Note" stickyNotifications={true} />);
    expect(getLayout().findNotifications()!.getElement().className).not.toBe(before);
  });

  test.each([
    ['default', '1280px'],
    ['form', '800px'],
    ['wizard', '1080px'],
  ] as const)('content type %s limits the content to %s', (contentType, width) => {
    renderLayout({ contentType });
    expect(getLayout().findContent()!.getElement().style.maxInlineSize).toBe(width);
  });

  test.each(['table', 'cards', 'dashboard'] as const)('content type %s uses the full width', contentType => {
    renderLayout({ contentType });
    expect(getLayout().findContent()!.getElement().style.maxInlineSize).toBe('');
  });

  test('maxContentWidth overrides the content type', () => {
    renderLayout({ contentType: 'form', maxContentWidth: 640 });
    expect(getLayout().findContent()!.getElement().style.maxInlineSize).toBe('640px');
  });

  test('navigationWidth and toolsWidth size the side columns', () => {
    renderLayout({ navigationWidth: 300, toolsOpen: true, toolsWidth: 360 });
    expect(getLayout().findNavigation()!.getElement().style.inlineSize).toBe('300px');
    expect(getLayout().findTools()!.getElement().style.inlineSize).toBe('360px');
  });

  test('disableContentPaddings changes the sheet class', () => {
    const { rerender } = renderLayout();
    const sheet = () => getLayout().findContent()!.getElement().parentElement!.className;
    const before = sheet();
    rerender(<AppLayout content="Page" navigation="Nav" disableContentPaddings={true} />);
    expect(sheet()).not.toBe(before);
  });

  test('passes id and data attributes to the root', () => {
    renderLayout({ id: 'layout', 'data-testid': 'layout' });
    expect(screen.getByTestId('layout')).toHaveAttribute('id', 'layout');
  });
});

describe('AppLayout sheet', () => {
  test('frames the content on a sheet with grid reference letters', () => {
    simulateWidth(960);
    renderLayout();
    const layout = getLayout();
    expect(layout.findSheet()!.getElement()).toContainElement(layout.findContent()!.getElement());
    expect(layout.findGridReferenceLetters().map(letter => letter.getText())).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });

  test('counts the grid reference letters from the width, leaving out I and O', () => {
    simulateWidth(1600);
    renderLayout();
    const letters = getLayout()
      .findGridReferenceLetters()
      .map(letter => letter.getText());
    expect(letters).toHaveLength(10);
    expect(letters).not.toContain('I');
    expect(letters.at(-1)).toBe('K');
  });

  test('hides the grid reference letters from assistive technology', () => {
    renderLayout();
    const strip = getLayout().findGridReferenceLetters()[0].getElement().parentElement!;
    expect(strip).toHaveAttribute('aria-hidden', 'true');
  });

  test('pins the title block to the foot of the sheet, after the content', () => {
    renderLayout({ titleBlock: <p>Sheet A-02</p> });
    const layout = getLayout();
    const slot = layout.findTitleBlockSlot()!.getElement();
    expect(slot).toHaveTextContent('Sheet A-02');
    expect(slot.parentElement).toBe(layout.findSheet()!.getElement());
    expect(slot.previousElementSibling).toContainElement(layout.findContent()!.getElement());
  });

  test('renders no title block slot without a title block', () => {
    renderLayout();
    expect(getLayout().findTitleBlockSlot()).toBeNull();
  });
});

describe('AppLayout notifications position', () => {
  test('puts the notifications in the margin beside the sheet by default, first in reading order', () => {
    // jsdom has no layout; give the notifications a height so they count as shown.
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(60);
    renderLayout({ notifications: 'Maintenance tonight' });
    const layout = getLayout();
    expect(layout.isNotificationsInMargin()).toBe(true);
    const notes = layout.findNotifications()!.getElement();
    expect(notes.nextElementSibling).toBe(layout.findSheet()!.getElement());
  });

  test('puts the notifications above the breadcrumbs with the top position', () => {
    renderLayout({ notifications: 'Maintenance tonight', breadcrumbs: 'Home', notificationsPosition: 'top' });
    const layout = getLayout();
    expect(layout.isNotificationsInMargin()).toBe(false);
    expect(layout.findNotifications()!.getElement().nextElementSibling).toBe(layout.findBreadcrumbs()!.getElement());
  });

  test('falls back to the top when the content column is too narrow for the margin', () => {
    simulateWidth(1200);
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(800);
    renderLayout({ notifications: 'Maintenance tonight' });
    expect(getLayout().isNotificationsInMargin()).toBe(false);
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveTextContent('Maintenance tonight');
  });

  test('keeps the margin free when the notifications render nothing, such as an empty Flashbar', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(0);
    renderLayout({ notifications: <Flashbar items={[]} /> });
    const layout = getLayout();
    expect(layout.isNotificationsInMargin()).toBe(false);
    expect(layout.findNotifications()).not.toBeNull();
  });

  test('falls back to the top on narrow screens', () => {
    simulateWidth(400);
    renderLayout({ notifications: 'Maintenance tonight' });
    expect(getLayout().isNotificationsInMargin()).toBe(false);
  });
});

describe('AppLayout navigation', () => {
  test('starts open and collapses to a rail, moving focus between the toggles', () => {
    renderLayout();
    const layout = getLayout();
    expect(layout.findNavigation()!.getElement()).not.toHaveAttribute('hidden');
    expect(layout.findNavigationToggle()).toBeNull();

    layout.findNavigationClose()!.click();
    expect(layout.findNavigation()!.getElement()).toHaveAttribute('hidden');
    expect(layout.findNavigationToggle()!.getElement()).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');

    layout.findNavigationToggle()!.click();
    expect(layout.findNavigation()!.getElement()).not.toHaveAttribute('hidden');
    expect(layout.findNavigationClose()!.getElement()).toHaveFocus();
  });

  test('keeps the navigation mounted while closed, so it keeps its state', () => {
    renderLayout({ navigationOpen: false });
    expect(getLayout().findNavigation()!.getText()).toContain('Home');
  });

  test('is controlled by navigationOpen and reports changes', () => {
    const onNavigationChange = vi.fn();
    renderLayout({ navigationOpen: true, onNavigationChange: event => onNavigationChange(event.detail) });
    getLayout().findNavigationClose()!.click();
    expect(onNavigationChange).toHaveBeenCalledWith({ open: false });
    expect(getLayout().findNavigation()!.getElement()).not.toHaveAttribute('hidden');
  });

  test('the form content type starts with the navigation closed and the help panel open', () => {
    renderLayout({ contentType: 'form' });
    expect(getLayout().findNavigation()!.getElement()).toHaveAttribute('hidden');
    expect(getLayout().findTools()).not.toBeNull();
  });

  test.each([{ navigationHide: true }, { navigation: undefined }])('leaves out the navigation with %o', props => {
    renderLayout(props);
    expect(getLayout().findNavigation()).toBeNull();
    expect(getLayout().findNavigationToggle()).toBeNull();
  });

  test('ariaLabels replace the built-in names', () => {
    renderLayout({ navigationOpen: false, ariaLabels: { navigation: 'Main menu', navigationToggle: 'Show menu' } });
    expect(screen.getByRole('button', { name: 'Show menu' })).toBeInTheDocument();
    expect(getLayout().findNavigation()!.getElement()).toHaveAttribute('aria-label', 'Main menu');
  });
});

describe('AppLayout help panel and drawers', () => {
  test('the help panel opens from the rail and returns focus when it closes', () => {
    const onToolsChange = vi.fn();
    renderLayout({ onToolsChange: event => onToolsChange(event.detail) });
    const layout = getLayout();
    expect(layout.findTools()).toBeNull();

    layout.findToolsToggle()!.click();
    expect(onToolsChange).toHaveBeenLastCalledWith({ open: true });
    expect(layout.findTools()).not.toBeNull();
    expect(layout.findToolsToggle()!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(layout.findToolsClose()!.getElement()).toHaveFocus();

    layout.findToolsClose()!.click();
    expect(onToolsChange).toHaveBeenLastCalledWith({ open: false });
    expect(layout.findTools()).toBeNull();
    expect(layout.findToolsToggle()!.getElement()).toHaveFocus();
  });

  test('clicking the open trigger again closes the panel', () => {
    renderLayout({ toolsOpen: undefined });
    getLayout().findToolsToggle()!.click();
    getLayout().findToolsToggle()!.click();
    expect(getLayout().findTools()).toBeNull();
  });

  test.each([{ toolsHide: true }, { tools: undefined }])('leaves out the help panel with %o', props => {
    renderLayout(props);
    expect(getLayout().findToolsToggle()).toBeNull();
  });

  test('opening a drawer closes the help panel', () => {
    const onToolsChange = vi.fn();
    const onDrawerChange = vi.fn();
    renderLayout({
      drawers,
      onToolsChange: event => onToolsChange(event.detail),
      onDrawerChange: event => onDrawerChange(event.detail),
    });
    const layout = getLayout();
    layout.findToolsToggle()!.click();
    layout.findDrawerTriggerById('activity')!.click();
    expect(onToolsChange).toHaveBeenLastCalledWith({ open: false });
    expect(onDrawerChange).toHaveBeenLastCalledWith({ activeDrawerId: 'activity' });
    expect(layout.findTools()).toBeNull();
    expect(screen.getByRole('complementary', { name: 'Activity' })).toHaveTextContent('Recent events');
    expect(layout.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute('aria-label', 'Close Activity');
  });

  test('closing a drawer returns focus to its trigger', () => {
    renderLayout({ drawers });
    const layout = getLayout();
    layout.findDrawerTriggerById('activity')!.click();
    expect(layout.findActiveDrawerCloseButton()!.getElement()).toHaveFocus();
    layout.findActiveDrawerCloseButton()!.click();
    expect(layout.findActiveDrawer()).toBeNull();
    expect(layout.findDrawerTriggerById('activity')!.getElement()).toHaveFocus();
  });

  test('is controlled by activeDrawerId', () => {
    const onDrawerChange = vi.fn();
    renderLayout({ drawers, activeDrawerId: 'notifications', onDrawerChange: event => onDrawerChange(event.detail) });
    const layout = getLayout();
    expect(layout.findActiveDrawer()!.getText()).toBe('Two updates');
    layout.findActiveDrawerCloseButton()!.click();
    expect(onDrawerChange).toHaveBeenCalledWith({ activeDrawerId: null });
    expect(layout.findActiveDrawer()).not.toBeNull();
  });

  test('names the triggers and lists only the drawers', () => {
    renderLayout({ drawers });
    expect(getLayout().findDrawerTriggers()).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Notifications, 2 unread' })).toBeInTheDocument();
  });

  test('only resizable drawers have a resize handle, which reports the new size', () => {
    const onResize = vi.fn();
    const resizable = { ...drawers[0], onResize: (event: CustomEvent) => onResize(event.detail) };
    renderLayout({ drawers: [resizable, drawers[1]], activeDrawerId: 'activity' });
    const handle = getLayout().findActiveDrawerResizeHandle()!;
    expect(handle.getElement()).toHaveAttribute('aria-label', 'Resize Activity');
    handle.keydown('ArrowRight');
    expect(onResize).toHaveBeenCalledWith({ id: 'activity', size: 304 });
    expect(getLayout().findActiveDrawer()!.getElement().style.inlineSize).toBe('304px');
  });

  test('a drawer without resizable has no handle', () => {
    renderLayout({ drawers, activeDrawerId: 'notifications' });
    expect(getLayout().findActiveDrawerResizeHandle()).toBeNull();
  });
});

describe('AppLayout ref', () => {
  test('openTools opens the help panel and focuses its close button', () => {
    const ref = createRef<AppLayoutProps.Ref>();
    render(<AppLayout ref={ref} tools="Help" />);
    act(() => ref.current!.openTools());
    expect(getLayout().findToolsClose()!.getElement()).toHaveFocus();
  });

  test('focusToolsClose focuses the close button of the open help panel', () => {
    const ref = createRef<AppLayoutProps.Ref>();
    render(<AppLayout ref={ref} tools="Help" toolsOpen={true} />);
    act(() => ref.current!.focusToolsClose());
    expect(getLayout().findToolsClose()!.getElement()).toHaveFocus();
  });

  test('closeNavigationIfNecessary leaves the navigation open on wide layouts', () => {
    const ref = createRef<AppLayoutProps.Ref>();
    const onNavigationChange = vi.fn();
    render(<AppLayout ref={ref} navigation="Nav" onNavigationChange={onNavigationChange} />);
    act(() => ref.current!.closeNavigationIfNecessary());
    expect(onNavigationChange).not.toHaveBeenCalled();
  });
});

describe('AppLayout on narrow screens', () => {
  test('closes the open panels and shows a toolbar', () => {
    simulateWidth(400);
    const onNavigationChange = vi.fn();
    renderLayout({ breadcrumbs: 'Home', drawers, onNavigationChange: event => onNavigationChange(event.detail) });
    const layout = getLayout();
    expect(layout.isMobile()).toBe(true);
    expect(onNavigationChange).toHaveBeenCalledWith({ open: false });
    expect(layout.findToolbar()).not.toBeNull();
    expect(layout.findBreadcrumbs()!.getText()).toBe('Home');
    expect(layout.findToolbar()!.findDrawerTriggers()).toHaveLength(3);
  });

  test('the navigation covers the content, closes with Escape and returns focus', () => {
    simulateWidth(400);
    renderLayout();
    const layout = getLayout();
    layout.findNavigationToggle()!.click();
    expect(layout.findNavigationClose()!.getElement()).toHaveFocus();
    expect(screen.getByRole('main', { hidden: true })).toHaveAttribute('inert');

    fireEvent.keyDown(layout.findNavigation()!.getElement(), { key: 'Escape' });
    expect(layout.findNavigation()!.getElement()).toHaveAttribute('hidden');
    expect(layout.findNavigationToggle()!.getElement()).toHaveFocus();
    expect(screen.getByRole('main')).not.toHaveAttribute('inert');
  });

  test('a drawer covers the content and closes with Escape', () => {
    simulateWidth(400);
    renderLayout({ drawers });
    const layout = getLayout();
    layout.findToolbar()!.findDrawerTriggerById('activity')!.click();
    expect(layout.findActiveDrawerResizeHandle()).toBeNull();
    fireEvent.keyDown(layout.findActiveDrawer()!.getElement(), { key: 'Escape' });
    expect(layout.findActiveDrawer()).toBeNull();
    expect(layout.findToolbar()!.findDrawerTriggerById('activity')!.getElement()).toHaveFocus();
  });

  test('closeNavigationIfNecessary closes the covering navigation', () => {
    simulateWidth(400);
    const ref = createRef<AppLayoutProps.Ref>();
    render(<AppLayout ref={ref} navigation="Nav" />);
    getLayout().findNavigationToggle()!.click();
    act(() => ref.current!.closeNavigationIfNecessary());
    expect(getLayout().findNavigation()!.getElement()).toHaveAttribute('hidden');
  });

  test('holds the split panel at the bottom', () => {
    simulateWidth(400);
    render(
      <AppLayout
        splitPanelOpen={true}
        splitPanelPreferences={{ position: 'side' }}
        splitPanel={<div data-testid="split">Details</div>}
      />
    );
    expect(screen.getByTestId('split').parentElement!.className).toMatch(/bottom/);
  });
});

describe('AppLayout toolbar variant', () => {
  test('puts the breadcrumbs and toggles in a toolbar on wide screens', () => {
    renderLayout({ variant: 'toolbar', breadcrumbs: 'Home', drawers });
    const layout = getLayout();
    expect(layout.isMobile()).toBe(false);
    expect(layout.findToolbar()!.findBreadcrumbs()!.getText()).toBe('Home');
    expect(layout.findNavigationClose()).toBeNull();
    layout.findNavigationToggle()!.click();
    expect(layout.findNavigation()!.getElement()).toHaveAttribute('hidden');
    expect(layout.findNavigationToggle()!.getElement()).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('AppLayout accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = renderLayout({
      breadcrumbs: <nav aria-label="Breadcrumbs">Home</nav>,
      notifications: 'Maintenance tonight',
      titleBlock: <p>Sheet A-02</p>,
      toolsOpen: true,
      drawers,
    });
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations with the navigation collapsed and a drawer open', async () => {
    const { container } = renderLayout({ navigationOpen: false, drawers, activeDrawerId: 'activity' });
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations on narrow screens', async () => {
    simulateWidth(400);
    const { container } = renderLayout({ breadcrumbs: 'Home', drawers });
    await expectNoAxeViolations(container);
  });
});
