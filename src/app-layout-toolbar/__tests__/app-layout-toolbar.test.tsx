// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import AppLayoutToolbar, { AppLayoutToolbarProps } from '../../../lib/components/app-layout-toolbar';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

const drawers: AppLayoutToolbarProps.Drawer[] = [
  { id: 'activity', ariaLabel: 'Activity', iconName: 'history' },
  { id: 'notifications', ariaLabel: 'Notifications', iconName: 'notification', badge: true },
];

function getToolbar() {
  return createWrapper().findAppLayoutToolbar()!;
}

describe('AppLayoutToolbar', () => {
  test('renders the breadcrumbs slot', () => {
    render(<AppLayoutToolbar breadcrumbs={<nav aria-label="Breadcrumbs">Home</nav>} />);
    expect(getToolbar().findBreadcrumbs()!.getText()).toBe('Home');
  });

  test('the navigation toggle reports the requested state and names it', () => {
    const onNavigationChange = vi.fn();
    const { rerender } = render(
      <AppLayoutToolbar navigationOpen={false} onNavigationChange={event => onNavigationChange(event.detail)} />
    );
    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    getToolbar().findNavigationToggle()!.click();
    expect(onNavigationChange).toHaveBeenLastCalledWith({ open: true });

    rerender(<AppLayoutToolbar navigationOpen={true} onNavigationChange={event => onNavigationChange(event.detail)} />);
    const closeToggle = screen.getByRole('button', { name: 'Close navigation' });
    expect(closeToggle).toHaveAttribute('aria-expanded', 'true');
    closeToggle.click();
    expect(onNavigationChange).toHaveBeenLastCalledWith({ open: false });
  });

  test('navigationHide removes the toggle', () => {
    render(<AppLayoutToolbar navigationHide={true} />);
    expect(getToolbar().findNavigationToggle()).toBeNull();
  });

  test('drawer triggers open their drawer and close the active one', () => {
    const onDrawerChange = vi.fn();
    render(
      <AppLayoutToolbar
        drawers={drawers}
        activeDrawerId="activity"
        onDrawerChange={event => onDrawerChange(event.detail)}
      />
    );
    const toolbar = getToolbar();
    expect(toolbar.findDrawerTriggers()).toHaveLength(2);
    expect(toolbar.findDrawerTriggerById('activity')!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(toolbar.findDrawerTriggerById('notifications')!.getElement()).toHaveAttribute('aria-expanded', 'false');

    toolbar.findDrawerTriggerById('notifications')!.click();
    expect(onDrawerChange).toHaveBeenLastCalledWith({ activeDrawerId: 'notifications' });
    toolbar.findDrawerTriggerById('activity')!.click();
    expect(onDrawerChange).toHaveBeenLastCalledWith({ activeDrawerId: null });
  });

  test('groups the drawer triggers under a name', () => {
    render(<AppLayoutToolbar drawers={drawers} ariaLabels={{ drawers: 'Panels' }} />);
    expect(screen.getByRole('group', { name: 'Panels' })).toBeInTheDocument();
  });

  test('custom aria labels replace the built-in ones', () => {
    render(<AppLayoutToolbar ariaLabels={{ navigationToggle: 'Show menu' }} />);
    expect(screen.getByRole('button', { name: 'Show menu' })).toBeInTheDocument();
  });

  test('the toggles are native buttons, so Enter and Space work and they never submit a form', () => {
    render(<AppLayoutToolbar drawers={drawers} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');
    }
  });

  test('passes id and data attributes to the root', () => {
    render(<AppLayoutToolbar id="toolbar" data-testid="toolbar" />);
    expect(screen.getByTestId('toolbar')).toHaveAttribute('id', 'toolbar');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <AppLayoutToolbar
        breadcrumbs={<nav aria-label="Breadcrumbs">Home</nav>}
        drawers={drawers}
        activeDrawerId="activity"
      />
    );
    await expectNoAxeViolations(container);
  });
});
