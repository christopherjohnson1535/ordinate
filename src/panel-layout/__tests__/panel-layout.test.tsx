// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import I18nProvider from '../../../lib/components/i18n';
import PanelLayout, { PanelLayoutProps } from '../../../lib/components/panel-layout';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectNoAxeViolations } from '../../__tests__/a11y';

import styles from '../../../lib/components/panel-layout/styles.css.js';

afterEach(() => {
  document.documentElement.dir = '';
});

function renderLayout(props: Partial<PanelLayoutProps> = {}) {
  const onPanelResize = vi.fn();
  render(
    <PanelLayout
      panelContent="Filters"
      mainContent="Results"
      resizable={true}
      onPanelResize={onPanelResize}
      {...props}
    />
  );
  const layout = createWrapper().findPanelLayout()!;
  const sizes = () => onPanelResize.mock.calls.map(([event]) => event.detail.panelSize);
  return { layout, handle: layout.findResizeHandle(), onPanelResize, sizes };
}

const panelSize = (layout: ReturnType<typeof renderLayout>['layout']) =>
  layout.getElement().style.getPropertyValue('--panel-size');

describe('PanelLayout', () => {
  test('shows the panel before the main pane by default', () => {
    const { layout } = renderLayout({ resizable: false });
    expect(layout.findPanelContent()!.getText()).toBe('Filters');
    expect(layout.findMainContent()!.getText()).toBe('Results');
    expect(layout.getElement().textContent).toBe('FiltersResults');
    expect(layout.findResizeHandle()).toBeNull();
    expect(layout.findByClassName(styles.divider)).not.toBeNull();
  });

  test('side-end puts the panel after the main pane', () => {
    const { layout } = renderLayout({ panelPosition: 'side-end' });
    expect(layout.getElement().textContent).toBe('ResultsFilters');
  });

  test.each([
    ['panel-only', 'Filters'],
    ['main-only', 'Results'],
  ] as const)('display %s shows one pane with no separator', (display, text) => {
    const { layout } = renderLayout({ display });
    expect(layout.getElement().textContent).toBe(text);
    expect(layout.findResizeHandle()).toBeNull();
    expect(layout.findByClassName(styles.divider)).toBeNull();
  });

  test('the handle is a focusable separator that controls the panel', () => {
    const { layout, handle } = renderLayout({ panelSize: 300, minPanelSize: 100, maxPanelSize: 500 });
    const separator = screen.getByRole('separator', { name: 'Resize panel' });
    expect(separator).toBe(handle!.getElement());
    expect(separator).toHaveAttribute('tabindex', '0');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveAttribute('aria-valuenow', '300');
    expect(separator).toHaveAttribute('aria-valuemin', '100');
    expect(separator).toHaveAttribute('aria-valuemax', '500');
    expect(separator).toHaveAttribute('aria-controls', layout.findPanelContent()!.getElement().id);
  });

  test('arrow keys resize a panel at the start', () => {
    const { handle, sizes } = renderLayout({ panelSize: 300 });
    handle!.keydown('ArrowRight');
    handle!.keydown('ArrowLeft');
    expect(sizes()).toEqual([310, 290]);
  });

  test('arrow keys narrow a panel at the end when moving toward the end', () => {
    const { handle, sizes } = renderLayout({ panelSize: 300, panelPosition: 'side-end' });
    handle!.keydown('ArrowRight');
    expect(sizes()).toEqual([290]);
  });

  test('arrow keys follow the reading direction', () => {
    document.documentElement.dir = 'rtl';
    const { handle, sizes } = renderLayout({ panelSize: 300 });
    handle!.keydown('ArrowRight');
    handle!.keydown('ArrowLeft');
    expect(sizes()).toEqual([290, 310]);
  });

  test('Home and End jump to the limits', () => {
    const { handle, sizes } = renderLayout({ panelSize: 300, minPanelSize: 120, maxPanelSize: 480 });
    handle!.keydown('Home');
    handle!.keydown('End');
    expect(sizes()).toEqual([120, 480]);
  });

  test('keeps the size within the limits and fires nothing at a limit', () => {
    const { layout, handle, sizes } = renderLayout({ panelSize: 1000, maxPanelSize: 400 });
    expect(panelSize(layout)).toBe('400px');
    handle!.keydown('ArrowRight');
    expect(sizes()).toEqual([]);
  });

  test('keeps its own size when panelSize is not set', () => {
    const { layout, handle, sizes } = renderLayout({ defaultPanelSize: 200 });
    expect(panelSize(layout)).toBe('200px');
    handle!.keydown('ArrowRight');
    expect(panelSize(layout)).toBe('210px');
    expect(sizes()).toEqual([210]);
  });

  test('a controlled size only changes through panelSize', () => {
    const { layout, handle } = renderLayout({ panelSize: 300 });
    handle!.keydown('ArrowRight');
    expect(panelSize(layout)).toBe('300px');
  });

  test('dragging the handle resizes the panel', () => {
    const { handle, sizes } = renderLayout({ panelSize: 300 });
    handle!.fireEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 300 }));
    handle!.fireEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 340 }));
    handle!.fireEvent(new MouseEvent('pointerup', { bubbles: true, clientX: 340 }));
    handle!.fireEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 400 }));
    expect(sizes()).toEqual([340]);
  });

  test('focusResizeHandle moves focus to the handle', () => {
    function WithRef() {
      const ref = useRef<PanelLayoutProps.Ref>(null);
      return (
        <>
          <button onClick={() => ref.current?.focusResizeHandle()}>Focus handle</button>
          <PanelLayout ref={ref} resizable={true} panelContent="Filters" mainContent="Results" />
        </>
      );
    }
    render(<WithRef />);
    screen.getByRole('button', { name: 'Focus handle' }).click();
    expect(screen.getByRole('separator')).toHaveFocus();
  });

  test('the handle label comes from i18nStrings, then the provider', () => {
    renderLayout({ i18nStrings: { resizeHandleAriaLabel: 'Resize filters' } });
    expect(screen.getByRole('separator', { name: 'Resize filters' })).toBeInTheDocument();

    const messages = {
      '@ordinate/components': { en: { 'panel-layout': { resizeHandleAriaLabel: 'Drag to resize' } } },
    };
    render(
      <I18nProvider messages={[messages]}>
        <PanelLayout resizable={true} panelContent="Filters" mainContent="Results" />
      </I18nProvider>
    );
    expect(screen.getByRole('separator', { name: 'Drag to resize' })).toBeInTheDocument();
  });

  test('focusable panes become named regions', () => {
    renderLayout({ panelFocusable: { ariaLabel: 'Filters' }, mainFocusable: { ariaLabel: 'Results' } });
    expect(screen.getByRole('region', { name: 'Filters' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('region', { name: 'Results' })).toHaveAttribute('tabindex', '0');
  });

  test('passes id and data attributes', () => {
    renderLayout({ id: 'split', 'data-testid': 'split' });
    expect(screen.getByTestId('split')).toHaveAttribute('id', 'split');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <PanelLayout
        resizable={true}
        panelSize={240}
        maxPanelSize={480}
        panelFocusable={{ ariaLabel: 'Filters' }}
        panelContent={<p>Filters</p>}
        mainContent={<p>Results</p>}
      />
    );
    await expectNoAxeViolations(container);
  });
});
