// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import SplitPanel, { SplitPanelProps } from '../../../lib/components/split-panel';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

function renderInLayout(
  layoutProps: Partial<AppLayoutProps> = {},
  panelProps: Partial<SplitPanelProps> = {}
): ReturnType<typeof render> {
  return render(
    <AppLayout
      content="Content"
      splitPanelOpen={true}
      {...layoutProps}
      splitPanel={
        <SplitPanel header="na-01" {...panelProps}>
          Details
        </SplitPanel>
      }
    />
  );
}

function getSplitPanel() {
  return createWrapper().findSplitPanel()!;
}

afterEach(() => vi.restoreAllMocks());

describe('SplitPanel', () => {
  test('is a complementary region named by its header', () => {
    renderInLayout();
    expect(screen.getByRole('complementary', { name: 'na-01' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'na-01' })).toBeInTheDocument();
    expect(getSplitPanel().findContent()!.getText()).toBe('Details');
  });

  test('renders the header description, info and actions', () => {
    renderInLayout(
      {},
      {
        headerDescription: 'Node in zone a',
        headerInfo: <a href="#info">Info</a>,
        headerActions: <button>Restart</button>,
      }
    );
    const panel = getSplitPanel();
    expect(panel.findHeaderDescription()!.getText()).toBe('Node in zone a');
    expect(panel.findHeaderInfo()!.getText()).toBe('Info');
    expect(panel.findHeaderActions()!.getText()).toBe('Restart');
  });

  test('the close button asks the layout to close the panel', () => {
    const onSplitPanelToggle = vi.fn();
    renderInLayout({ onSplitPanelToggle: event => onSplitPanelToggle(event.detail) });
    getSplitPanel().findCloseButton()!.click();
    expect(onSplitPanelToggle).toHaveBeenCalledWith({ open: false });
  });

  test('collapses to a bar with the title, and moves focus between the open and close buttons', () => {
    renderInLayout({ splitPanelOpen: undefined });
    const panel = () => getSplitPanel();
    expect(panel().isOpen()).toBe(false);
    expect(panel().findHeader()!.getText()).toBe('na-01');

    panel().findOpenButton()!.click();
    expect(panel().isOpen()).toBe(true);
    expect(panel().findCloseButton()!.getElement()).toHaveFocus();

    panel().findCloseButton()!.click();
    expect(panel().isOpen()).toBe(false);
    expect(panel().findOpenButton()!.getElement()).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Open panel' })).toHaveAttribute('aria-expanded', 'false');
  });

  test('closeBehavior hide removes the panel while it is closed', () => {
    renderInLayout({ splitPanelOpen: false }, { closeBehavior: 'hide' });
    expect(createWrapper().findSplitPanel()).toBeNull();
  });

  test('collapses to a rail with an open button at the side', () => {
    const onSplitPanelToggle = vi.fn();
    renderInLayout({
      splitPanelOpen: false,
      splitPanelPreferences: { position: 'side' },
      onSplitPanelToggle: event => onSplitPanelToggle(event.detail),
    });
    const panel = getSplitPanel();
    expect(panel.getPosition()).toBe('side');
    expect(panel.findHeader()).toBeNull();
    panel.findOpenButton()!.click();
    expect(onSplitPanelToggle).toHaveBeenCalledWith({ open: true });
  });

  test('picks a new position in the preferences dialog', () => {
    const onChange = vi.fn();
    renderInLayout({ onSplitPanelPreferencesChange: event => onChange(event.detail) });
    getSplitPanel().findPreferencesButton()!.click();
    const modal = getSplitPanel().findPreferencesModal()!;
    expect(modal.findHeader()!.getText()).toBe('Split panel preferences');
    fireEvent.click(screen.getByRole('radio', { name: 'Side' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onChange).toHaveBeenCalledWith({ position: 'side' });
  });

  test('moves to the new position when the layout manages the preferences', () => {
    renderInLayout();
    getSplitPanel().findPreferencesButton()!.click();
    fireEvent.click(screen.getByRole('radio', { name: 'Side' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(getSplitPanel().getPosition()).toBe('side');
    expect(getSplitPanel().findPreferencesButton()!.getElement()).toHaveFocus();
  });

  test('cancelling the preferences keeps the position and returns focus', () => {
    const onChange = vi.fn();
    renderInLayout({ onSplitPanelPreferencesChange: onChange });
    getSplitPanel().findPreferencesButton()!.click();
    fireEvent.click(screen.getByRole('radio', { name: 'Side' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(getSplitPanel().findPreferencesModal()).toBeNull();
    expect(getSplitPanel().findPreferencesButton()!.getElement()).toHaveFocus();
  });

  test('hidePreferencesButton removes the preferences button', () => {
    renderInLayout({}, { hidePreferencesButton: true });
    expect(getSplitPanel().findPreferencesButton()).toBeNull();
  });

  test('i18nStrings replace the built-in labels', () => {
    renderInLayout({}, { i18nStrings: { closeButtonAriaLabel: 'Hide details', resizeHandleAriaLabel: 'Drag' } });
    expect(screen.getByRole('button', { name: 'Hide details' })).toBeInTheDocument();
    expect(screen.getByRole('separator', { name: 'Drag' })).toBeInTheDocument();
  });
});

describe('SplitPanel resizing', () => {
  test('the handle is a focusable horizontal separator at the bottom', () => {
    renderInLayout();
    const handle = screen.getByRole('separator', { name: 'Resize split panel' });
    expect(handle).toHaveAttribute('tabindex', '0');
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    expect(handle).toHaveAttribute('aria-valuemin', '0');
    expect(handle).toHaveAttribute('aria-valuemax', '100');
    expect(handle).toHaveAttribute('aria-valuenow');
  });

  test('arrow keys resize the bottom panel, Home and End jump to the limits', () => {
    const onResize = vi.fn();
    renderInLayout({ splitPanelSize: 300, onSplitPanelResize: event => onResize(event.detail.size) });
    const handle = getSplitPanel().findResizeHandle()!;
    handle.keydown('ArrowUp');
    expect(onResize).toHaveBeenLastCalledWith(316);
    handle.keydown('ArrowDown');
    expect(onResize).toHaveBeenLastCalledWith(284);
    handle.keydown('Home');
    expect(onResize).toHaveBeenLastCalledWith(160);
    handle.keydown('End');
    expect(onResize).toHaveBeenLastCalledWith(window.innerHeight - 160);
  });

  test('the layout keeps the size when it manages it', () => {
    renderInLayout();
    const before = Number(getSplitPanel().findResizeHandle()!.getElement().getAttribute('aria-valuenow'));
    getSplitPanel().findResizeHandle()!.keydown('ArrowUp');
    const after = Number(getSplitPanel().findResizeHandle()!.getElement().getAttribute('aria-valuenow'));
    expect(after).toBeGreaterThan(before);
  });

  test('at the side, the arrow toward the content makes the panel wider', () => {
    const onResize = vi.fn();
    renderInLayout({
      splitPanelPreferences: { position: 'side' },
      splitPanelSize: 320,
      onSplitPanelResize: event => onResize(event.detail.size),
    });
    const handle = getSplitPanel().findResizeHandle()!;
    expect(handle.getElement()).toHaveAttribute('aria-orientation', 'vertical');
    handle.keydown('ArrowRight');
    expect(onResize).toHaveBeenLastCalledWith(304);
    handle.keydown('Home');
    expect(onResize).toHaveBeenLastCalledWith(280);
  });

  test('a pointer drag resizes the bottom panel', () => {
    const onResize = vi.fn();
    renderInLayout({ splitPanelSize: 300, onSplitPanelResize: event => onResize(event.detail.size) });
    const handle = getSplitPanel().findResizeHandle()!.getElement();
    fireEvent.pointerDown(handle, { button: 0, clientX: 0, clientY: 500, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 0, clientY: 450, pointerId: 1 });
    expect(onResize).toHaveBeenLastCalledWith(350);
    fireEvent.pointerUp(handle, { pointerId: 1 });
    onResize.mockClear();
    fireEvent.pointerMove(handle, { clientX: 0, clientY: 400, pointerId: 1 });
    expect(onResize).not.toHaveBeenCalled();
  });
});

describe('SplitPanel outside an app layout', () => {
  test('warns and renders open at the bottom', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<SplitPanel header="Standalone">Details</SplitPanel>);
    expect(getSplitPanel().isOpen()).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('SplitPanel'));
  });
});

describe('SplitPanel accessibility', () => {
  test('has no accessibility violations when open', async () => {
    const { container } = renderInLayout({}, { headerDescription: 'Node in zone a' });
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations when collapsed', async () => {
    const { container } = renderInLayout({ splitPanelOpen: false });
    await expectNoAxeViolations(container);
  });

  test('has no accessibility violations with the preferences open', async () => {
    renderInLayout();
    getSplitPanel().findPreferencesButton()!.click();
    await expectNoAxeViolations(document.body);
  });
});
